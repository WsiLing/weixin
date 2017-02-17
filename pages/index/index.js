//index.js
//获取应用实例
var app = getApp()


var timer;
Page({
  data: {
    time:"60S",
    num:60,
    progress:100,
    submit_recordSuccess:false,//提交成功页面
    tempFilePath:"", //保存录音地址
    recordStart_disabled:false,//开始录音按钮
    recordStart_btn:'开始录音',
    recordBack_btn:'回听',
    recordFinish_disable:true,//录音完成按钮
    recordBack_disable:true,//录音回听按钮
    recordAgain_disable:true,//重新录制按钮
    recordSubmit_disable:true,//提交录音按钮
    broadcastOriginalText:false,//播放原文
    broadcastControl:true,
    text:{}
  },

   broadcast_origin:function(){ //播放原文
    var that = this;
    if(this.data.broadcastControl){
        wx.playBackgroundAudio({
          dataUrl: that.data.text.mp3url,
          title:'最美60S',
          coverImgUrl:that.data.text.mp3url,
          fail:function(res){
           
          },
          success:function(res){
           
          }
       });
       this.setData({
          broadcastControl:false,
          recordBack_disable:true
        });
        wx.onBackgroundAudioStop(function(){
          that.setData({
            broadcastControl:true,
          })
        })
    }else{
      wx.pauseBackgroundAudio();
      this.setData({
        broadcastControl:true,
        recordBack_disable:false
      })
    }
  },



  start_recording:function(){//开始录音
    var that = this;
    wx.stopVoice();
    wx.stopBackgroundAudio();
    wx.showNavigationBarLoading()//导航栏动画
    that.setData({
      time:"60S",
      num:60,
      progress:100,
      tempFilePath:"", //保存录音地址
      recordBack_disable:true,//录音回听
      recordSubmit_disable:true,//重新录制按钮
      recordStart_disabled:true,
      recordFinish_disable:false,
      broadcastOriginalText:true,//播放原文
      recordStart_btn:'正在录音',
    });
    wx.startRecord({
      success: function(res) {
        var tempFilePath = res.tempFilePath;
        that.setData({
          tempFilePath:tempFilePath
        });
        
      }
    })
    // timer = setInterval(function(){
    //         var num =parseInt( that.data.time )-1;
    //         that.setData({
    //           time:num + "S",
    //           progress:num/60*100
    //         })
    //         if(num<=0){
    //           clearInterval(timer); 
    //           wx.hideNavigationBarLoading()
    //           wx.stopRecord({
    //             success: function(res) {
    //               var tempFilePath = res.tempFilePath;
    //               that.setData({
    //                 tempFilePath:tempFilePath
    //               })
    //             }
    //           })
    //           that.setData({
    //             recordBack_disable:false,//录音回听
    //             recordSubmit_disable:false,//提交录音按钮
    //             recordStart_disabled:false,//开始录音按钮
    //             recordStart_btn:'重新录制',
    //             recordFinish_disable:true,//录音完成按钮
    //             broadcastOriginalText:false,//播放原文
    //           })
    //         }
    //     },1000)  
  },




  finish_record:function(){//录音完成
    wx.hideNavigationBarLoading()
    var that = this;
    clearInterval(timer);
    wx.stopRecord({
      success: function(res) {
        var tempFilePath = res.tempFilePath;
        that.setData({
          tempFilePath:tempFilePath,
          recordFinish_disable:true,//录音完成按钮
          recordSubmit_disable:false,//重新录制按钮
          recordStart_disabled:false,//开始录音按钮
          recordStart_btn:'重新录音',
          recordBack_btn:'回听',
          broadcastOriginalText:false,//播放原文
        })
      }
    })
    that.setData({
      recordBack_disable:false,//录音回听
      recordAgain_disable:false//重新录制
    })
  },




  submit_recording:function(){//提交录音
    var that = this;
    if(this.data.tempFilePath){
      wx.showModal({
        title: '提示',
        content: '你确定要提交录音吗？',
        success: function(res) {
          if (res.confirm) {
             wx.uploadFile({
                url: 'https://qy.gzpeiyou.com/index.php/Wxapi/Wxapi', 
                  filePath: that.data.tempFilePath,
                  name: 'file',
                  header: {
                      'content-type': 'multipart/form-data'
                  },
                  method:"post",
                success: function(res){
                  var str = res.data.split('\"')
                  var arr = str[1]?str[1]:res.data;
                  if(arr){ //录音提交成功
                      wx.request({
                        url: 'https://qy.gzpeiyou.com/index.php/Wxapi/Wxapi/upDat', 
                        data: {
                            origin:arr,
                            openid:that.data.userInfo.openId,
                            dataid:that.data.text.id
                        },

                        header: {
                            'content-type': 'application/json'
                        },
                        success: function(res) {
                          wx.saveFile({//保存文件
                            tempFilePath: that.data.tempFilePath,
                            success: function(res) {}
                          })
              
                          wx.redirectTo({
                            url: '../logs/logs'
                          })
                        },
                        fail:function(){}
                    })
                  }
                },fail:function(res){}
              })
          }
        }
      })

    }
  },



  backListen:function(){//回听录音
      var that = this;
      wx.stopVoice();
      if(this.data.recordBack_btn=='回听'){
          if(this.data.tempFilePath){
              wx.playVoice({
                filePath: this.data.tempFilePath,
                complete: function(){
                  that.setData({
                    broadcastOriginalText:false,//播放原文
                    recordSubmit_disable:false,//提交录音按钮
                    recordBack_btn:'回听',
                  })
                }
              })
          }
          this.setData({
            broadcastOriginalText:true,//播放原文
            recordSubmit_disable:true,//提交录音按钮
            recordBack_btn:'停止',
          })
      }else{
        this.setData({
            broadcastOriginalText:false,//播放原文
            recordSubmit_disable:false,//提交录音按钮
            recordBack_btn:'回听',
        })
      }
      
          
    },

  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
      wx.request({
          url: 'https://qy.gzpeiyou.com/index.php/Wxapi/Wxapi/getQuestion',
          data: {
              openid:userInfo.openId
          },
          header: {
              'content-type': 'application/json'
          },
          success: function(res) {
            if(typeof res.data == 'string'){
                var trr = res.data.replace(/\ufeff/g,'')
                var data = JSON.parse(trr);
            }else{
                var data = res.data;
            }
            that.setData({
              text:data
            })

            
          // 文本标识
            var wrongWord = data.word.toLowerCase();
            that.setData({
              wrongWord:wrongWord
            })
          }
      })
      // if(userInfo){
      //   wx.navigateTo({
      //     url: '../result/result'
      //   })
      // }
    })

  }
})
