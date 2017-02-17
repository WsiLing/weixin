//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({ //login
        success: function (log) {  
        var session_key = "";
         wx.request({   //获取session_key        
url:'https://qy.gzpeiyou.com/index.php/Wxapi/Wxapi/getSessionKey/code/'+log.code,
            header: {
                'content-type': 'application/json'
            },
            success: function(res_) {
              session_key =res_.data;
              wx.getUserInfo({ //解密
              success: function (res) {
                  wx.request({
                    url: 'https://qy.gzpeiyou.com/index.php/Wxapi/Wxapi/decryptData',
                    data:{
                      session:session_key,
                      encryptedData:res.encryptedData,
                      iv:res.iv
                    },success:function(response){//用户数据
                        
                        if( typeof response.data == 'string'){
                          var trr = response.data.replace(/\ufeff/g,'')
                          var data = JSON.parse(trr)  
                        }else{
                          var data = response.data;
                        }
                      that.globalData.userInfo = data
                      typeof cb == "function" && cb(that.globalData.userInfo)
                    }
                  })
                },fail:function(res){
                 
                    wx.navigateTo({
                      url: '../loginFail/loginFail'
                    })
                }
              })
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
  }
})