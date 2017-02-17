var app = getApp()

Page({
    data: {
        userInfo:"",
        day:''
     },
    attend:function(){ //我要打卡
        var that = this;
        if(that.data.userInfo.openId){
             wx.request({
                url: 'https://qy.gzpeiyou.com/index.php/Wxapi/Wxapi/isHas',
                data: {
                    openid:that.data.userInfo.openId
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                    if(res.data==3){//有数据没录音
                    wx.redirectTo({
                        url: '../index/index'
                    })
                    }else if(res.data==2){ //有录音没成绩
                    
                    }else if(res.data==1){ //有成绩
                    wx.redirectTo({
                        url: '../logs/logs'
                    })
                    }
                },
                fail:function(res){
                // console.log(res)
                }
            })
        }
    },
    onPullDownRefresh:function(){
        wx.redirectTo({
            url: '../home/home'
        })
    },
    onLoad:function(){  //信息入库
        var that = this
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function(userInfo){
            //更新数据
            that.setData({
               userInfo:userInfo
            });
            wx.request({
              url: 'https://qy.gzpeiyou.com/index.php/Wxapi/Wxapi/addUserinfo',
              data: {
                  avatarurl:userInfo.avatarUrl,
                  city:userInfo.city,
                  country:userInfo.country,
                  gender:userInfo.gender,
                  language:userInfo.language,
                  nickname:userInfo.nickName,
                  openid:userInfo.openId,
                  province:userInfo.province,
                  unionid:userInfo.unionId
              },
              header: {
                  'content-type': 'application/json'
              },
              success: function(res) {}
            }) 

            wx.request({ //获取连续打卡天数
                url: 'https://qy.gzpeiyou.com/index.php/Wxapi/Wxapi/newday', 
                data: {
                    openid:userInfo.openId
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function(res){
                    if(typeof(res.data) == 'string'){
                        res.data = res.data.replace(/\ufeff/g,'');
                        res.data = JSON.parse(res.data);
                    }
                
                    that.setData({
                        day:parseInt(res.data),
                        one:(parseInt(res.data))%10,
                        decade:parseInt((parseInt(res.data))/10)
                    });
                },
                fail:function(){}
            });

        });
    }
})