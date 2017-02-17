var app = getApp()

  var remark=[
        {demension:'准确度',content:'666…单词发音基本都读对了，要继续保持优秀哦~'},
        {demension:'流利度',content:'距离优秀只有一点点差距，想如英国人般 流利，请每天大声朗读课文！~'},
        {demension:'完整度',content:'朗读不完整是致命伤，都是平时不开口读 英语造成的，还不赶紧练习去！~'}]

var great = ['一年级','二年级','三年级','四年级','五年级','六年级','初一','初二','初三','高一','高二','高三']
var progress = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]


Page({
  data: {
      curUserInfo:"",//记录当前用户
      userInfo:'', //朗诵者信息
      remark:remark, //成绩报告信息
      recordPath:"", //回听录音路径
      hidden:true,
      messageSubmit:true,//留言提交按钮
      showMessageBoard: false,//留言板
      broadcastControl:true, //播放原文控制
      record:true,
      progress:progress, //打卡进度
      origin:false,
      back:false,

      load:false,
      inputTel:'', //手机号码
      code:'', //验证码
      hint:'' , //验证信息提示
      greatError:false,
      nameError:false,
      telError:false,
      codeError:false,
      great:great,
      requestCode:false,
      select:false, //调用选择年级
      curGreat:'', //记录当前选择的年级
      showModalStatus:false//补充信息遮罩层
  },


  broadcast_text:function(){//回听
    wx.stopBackgroundAudio()
    this.setData({
        broadcastControl:true,
        origin:true
    })
    var that = this;
    if(that.data.record){
        wx.playBackgroundAudio({
            dataUrl: that.data.userInfo.origin,
            title: '回听录音',
            coverImgUrl: that.data.userInfo.origin,
            complete:function(res){
                wx.onBackgroundAudioStop(function(){
                    that.setData({
                        record:true,
                        origin:false
                    })
                })
            }
        });
        that.setData({
            record:false,
        
          })
   
    }else{
      wx.stopVoice();
      wx.pauseBackgroundAudio();
      that.setData({
        record:true,
        origin:false
      })
    }
    
  },

  broadcast_origin:function(){ //播放原文
    var that = this;
    wx.stopVoice();
    that.setData({
      record:true,
      back:true
    })
    wx.stopBackgroundAudio()
    if(this.data.broadcastControl){
        wx.playBackgroundAudio({
          dataUrl: that.data.userInfo.mp3url,
          title: '播放原文',
          coverImgUrl: that.data.userInfo.mp3url,
          complete:function(res){
                wx.onBackgroundAudioStop(function(){
                    that.setData({
                        broadcastControl:true,
                        back:false
                    })
                })
            }
       });
       this.setData({
        broadcastControl:false
      });
      wx.onBackgroundAudioStop(function(){
          that.setData({
            broadcastControl:true,
            back:false
          })
        })
    }else{
      wx.pauseBackgroundAudio();
      this.setData({
        broadcastControl:true,
        back:false
      })
    }
  },



  attend:function(){//参加
      wx.navigateTo({
          url: '../ward/ward'
        })
  },


  showModal: function () {  // 显示遮罩层 
        var animation = wx.createAnimation({   
                duration: 200,   
                timingFunction: "linear",   
                delay: 0  
            })  
            this.animation = animation  
            animation.translateY(300).step()  
            this.setData({   
                animationData: animation.export(),
                showModalStatus: true  
            })  
            setTimeout(function () {   
                animation.translateY(0).step()   
                this.setData({    
                    animationData: animation.export()   
                    })  }.bind(this), 200) 
    },
    hideModal: function () {  // 隐藏遮罩层 
     var animation = wx.createAnimation({   
            duration: 200,  
            timingFunction: "linear",   
            delay: 0  
         })  
         this.animation = animation  
         animation.translateY(300).step()  
         this.setData({   
             animationData: animation.export(),  
        })  
        setTimeout(function () {   
            animation.translateY(0).step()   
            this.setData({    
                animationData: animation.export(),
            showModalStatus: false   
            })  
        }.bind(this), 200) 
    },
    obtainCode:function(){//验证码获取
        if(this.data.inputTel==""){
            this.setData({
                hint: "请输入手机",
                telError:true
            })
        }else if(this.data.inputTel.length!=11){
            this.setData({
                hint: "请正确输入手机",
                telError:true
            })
        }else{
            var that = this;
            this.setData({
                load: true,
                code:obtainCode(),
                requestCode:true
            })
            var time = 60;
            var codeTimer = setInterval(function(){
                    time = time - 1;
                    if(time == 0){
                        clearInterval(codeTimer);
                         that.setData({
                            load: false,
                            requestCode:false
                        })
                    }
                    that.setData({
                        time:time+'S后重发'
                    });
                },1000)

            wx.request({
                url: 'https://qy.gzpeiyou.com/index.php/Wxapi/Wxapi/sms', 
                data: {
                    mobile:that.data.inputTel,
                    num:that.data.code
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {},
                fail:function(){
                    that.setData({
                        code: res.data,
                        load: false,
                        requestCode:false
                    })
                }
            })
        }
        
    },

    formSubmit: function(e) {  //表单提交
        var that = this;
        var curUserInfo = this.data.curUserInfo;
        var userInfo = e.detail.value;
        var greatName = userInfo.greatName;
        var name = userInfo.name;
        var tel = userInfo.tel;
        var code = userInfo.code;
        var data = this.data;
        if(greatName==''){
            this.setData({
                hint: "年级不能为空",
                greatError:true
            })
        };
        if(name==""){
            this.setData({
                hint: "名字不能为空",
                nameError:true
            })
        };
        if(tel==""){
            this.setData({
                hint: "手机不能为空",
                telError:true
            })
        }else if(tel.length!=11){
            this.setData({
                hint: "请正确输入手机",
                telError:true
            })
        };
        if(code==""){
            this.setData({
                hint: "验证码不能为空",
                codeError:true
            })
        }
        if(!data.greatError&&!data.nameError&&!data.telError&&!data.codeError){
            this.hideModal();
            wx.request({
                url: 'https://qy.gzpeiyou.com/index.php/Wxapi/Wxapi/addGrade', 
                data: {
                    openid:curUserInfo.openId,
                    greatname:userInfo.greatName,
                    name:userInfo.name,
                    tel:userInfo.tel
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                 console.log(res.data)
                    if(parseInt(res.data) == 1){
                        that.setData({
                            showModalStatus:false,
                            name:name
                        });
                        wx.showToast({
                            title: '信息提交成功',
                            icon: 'success',
                            duration: 1000
                        })
               
                    }else{
                        wx.showModal({
                            content: '个人信息提交失败，请重新填写',
                            showCancel:false,
                            success: function(res) {
                            }
                        })
                    }  
                },
                fail:function(res){
                
                }
            })
        }
    },
    //输入监控
    obtain_tel:function(e){
        if(e.detail.value){
            this.setData({
                telError: false,
                hint:'',
                inputTel:e.detail.value
            })
        }
    },
    obtain_name:function(e){
        if(e.detail.value){
            this.setData({
                nameError: false,
                hint:''
            })
        }
    },
    obtain_great:function(e){
        this.setData({
            greatError: false,
            select:true,
            hint:''
        }) ;
        
    },
    selectGreat:function(e){
        var index = e.target.dataset.index;
        this.setData({
            curGreat:this.data.great[index],
            select:false,
        });
    },
    obtain_code:function(e){
        if(e.detail.value){
            this.setData({
                codeError: false,
                hint:''
            })
        }
        if(this.data.code == e.detail.value){
            this.setData({
                codeError: false
            })
        }else{
            this.setData({
                codeError: true,
                hint:'验证码不正确'
            })
        }
        
    },

  
  onLoad:function (options) {
    var that = this;
    app.getUserInfo(function(userInfo){//获取用户信息
      that.setData({
        curUserInfo:userInfo,
        curDay:options.day
      })
      wx.request({
        url: 'https://qy.gzpeiyou.com/index.php/Wxapi/Wxapi/getResult', 
        data: {
          openid:userInfo.openId,
          data:options.id
        },
        header: {
            'content-type': 'application/json'
        },
        success: function(response) {
          if( typeof response.data == 'string'){
            var trr = response.data.replace(/\ufeff/g,'')
            var data = JSON.parse(trr)  
          }else{
            var data = response.data;
          }
          
          that.setData({
            userInfo:data,
          })
          
          that.setData({
            'userInfo.overall':parseInt(data.overall),
             dayImg:"../img/day/"+ parseInt(data.day) +".png",
             day:parseInt(data.day),
             one:parseInt(data.day)%10,
             decade:parseInt(parseInt(data.day)/10)
          })
          console.log(data.name)
          if(!data.name){
            that.setData({
                showModalStatus:true,
            })
          }


          // 词语标错
          
          var wrongStr = data.false_word;
          var wrongStyle = [];
          var wrongWord = wrongStr.split(';');
          var wordArray = data.content.split(' ');
          
          for(var i=0;i<wordArray.length;i++){
            var word = wordArray[i];
                word = word.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,"");    
            wrongStyle[i] = 'black' 
            if(wrongWord.toString().indexOf(wordArray[i]) > -1){
                wrongStyle[i] = 'wrong'; 
            }     
          }
          that.setData({
            wrongStyle:wrongStyle,
            wordArray:wordArray
          })


          // 评语
          var accuracy = parseInt( data.accuracy);
          var fluency =parseInt( data.fluency);
          var integrity = parseInt(data.integrity);
          if(fluency>=95){
            that.setData({
              'remark[1].content':'这流利度猴赛雷啊！只能说一句，优秀！'});
          }else if(fluency>79){
            that.setData({
              'remark[1].content':'距离优秀只有一点点差距，想如英国人般流利，请每天大声朗读课文！'});
          }else if(fluency>59){
            that.setData({
              'remark[1].content':'读得断断续续会影响最终得分，还不赶紧放下手机朗读课文去！'});
          }else{
            that.setData({
              'remark[1].content':'这…一定是你的手机网络出了问题，但是该练的还是得练，快使出你的洪荒之力给我练习去！'});
          }
          if(accuracy>=95){
            that.setData({
              'remark[0].content':'666…单词发音基本都读对了，要继续保持优秀！'});
          }else if(accuracy>79){
             that.setData({
              'remark[0].content':'大部分发音准确，但是要注意不要忽略了单词尾音的发音。'});
          }else if(accuracy>59){
            that.setData({
              'remark[0].content':'看来发音还需努力，尤其是元音发音一定要饱满。好好复习学过的音标发音。'});
          }else{
            that.setData({
              'remark[0].content':'先别香菇，经过刻苦的训练你也一定可以变得很优秀！记得每天都要大声朗读课文并且坚持！'});
          }
          if(integrity>=95){
            that.setData({
              'remark[2].content':'完整朗读短文，棒棒哒！'});
          }else if(integrity>79){
            that.setData({
              'remark[2].content':'有个别的单词或句子没读出来，段落里的每个单词都必须大声读出。'});
          }else if(integrity>59){
            that.setData({
              'remark[2].content':'朗读不完整是致命伤，都是平时不开口读英语造成的，还不赶紧练习去！'});
          }else{
            that.setData({
              'remark[2].content':'抱抱么么哒~抱抱么么哒，完整度是基本要求，要把每个单词每句话清晰地读出来，继续奋斗吧少年！'});
          }

        }
      })   
    })
  }
})


function obtainCode(){
	//随机四位数
    var str ="";
    for(var i=0;i<4;i++){
       var num = parseInt(Math.random()*10);
       str = str + num;
    }
    return str;
}