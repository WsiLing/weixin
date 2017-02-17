var app = getApp()
var great = ['一年级','二年级','三年级','四年级','五年级','六年级','初一','初二','初三','高一','高二','高三']



Page({
  data: {
      showShareStatus:false,
      day:1,
      id:'',
      great:great,
      showModalStatus:false//遮罩层
  },
  attend:function(){
    wx.navigateTo({
        url: '../home/home'
    })
  },
  onShareAppMessage: function () {//分享
    return {
      title: '21天口语养成计划',
      desc: "我在‘21天口语养成计划’坚持了"+this.data.day+"天，你也快来打卡吧！",
      path: '/pages/ward/ward?id=1&day='+this.data.day+'&name='+this.data.name
    }
  },
  showShareModal: function () {  // 显示遮罩层 
        var that = this;
        var animation = wx.createAnimation({   
                duration: 200,   
                timingFunction: "linear",   
                delay: 0  
            })  
            this.animation = animation  
            animation.translateY(300).step()  
            this.setData({   
                animationData: animation.export(),
                showShareStatus: true  
            })  
            setTimeout(function () {   
                animation.translateY(0).step()   
                this.setData({    
                    animationData: animation.export()   
                    })  }.bind(this), 200) 
           setTimeout(function(){
           that.setData({
               showShareStatus: false   
           })
           },1500)

    },
    hideShareModal: function () {  // 隐藏遮罩层 
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
            showShareStatus: false   
            })  
        }.bind(this), 200) 
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
                        //app.globalData.name = name;
                    }else{
                        wx.showModal({
                            content: '个人信息提交失败，请重新填写',
                            showCancel:false,
                            success: function(res) {
                            }
                        });
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



  onLoad:function(options){
    var that = this;
    var userInfo = app.globalData.userInfo;
    that.setData({
        curUserInfo:userInfo,
    });
    if(options.id){ //判断是否分享的页面
        var day = options.day
        this.setData({
            day:day,
            name:options.name,
            id:options.id
        });
        if(parseInt(day)<3){
            that.setData({                  Img:"http://qy.gzpeiyou.com/Public/60s/reward/1.png"
                })
            }else if(parseInt(day)>=3&&parseInt(day)<5){
                that.setData({ 
                    Img:"http://qy.gzpeiyou.com/Public/60s/reward/3.png"
                })
            }else if(parseInt(day)>=5&&parseInt(day)<7){
                that.setData({ 
                    Img:"http://qy.gzpeiyou.com/Public/60s/reward/5.png"
                })
            }else if(parseInt(day)>=7&&parseInt(day)<14){
                that.setData({ 
                    Img:"http://qy.gzpeiyou.com/Public/60s/reward/7.png"
                })
            }else if(parseInt(day)>=14&&parseInt(day)<21){
                that.setData({ 
                    Img:"http://qy.gzpeiyou.com/Public/60s/reward/14.png"
                })
            }else if(parseInt(day)==21){
                that.setData({ 
                    Img:"http://qy.gzpeiyou.com/Public/60s/reward/21.png"
                })
            }     
    }else{
        wx.request({
            url: 'https://qy.gzpeiyou.com/index.php/Wxapi/Wxapi/getDay', 
            data: {
                openid:userInfo.openId
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                if(typeof(res.data) == 'string'){
                    res.data = res.data.replace(/\ufeff/g,'');
                    res.data = JSON.parse(res.data);
                }
                
                that.setData({
                    day:parseInt(res.data.day),
                    name:res.data.name
                });
                if(res.data.name){
                    that.setData({
                        showModalStatus:false
                    })
                }else{
                    that.setData({
                        showModalStatus:true
                    })
                }

                var day = parseInt(res.data.day);
          
                if(parseInt(day)<3){
                    that.setData({ 
                        Img:"http://qy.gzpeiyou.com/Public/60s/reward/1.png"
                    })
                }else if(parseInt(day)>=3&&parseInt(day)<5){
                    that.setData({ 
                        Img:"http://qy.gzpeiyou.com/Public/60s/reward/3.png"
                    })
                }else if(parseInt(day)>=5&&parseInt(day)<7){
                    that.setData({ 
                        Img:"http://qy.gzpeiyou.com/Public/60s/reward/5.png"
                    })
                }else if(parseInt(day)>=7&&parseInt(day)<14){
                    that.setData({ 
                        Img:"http://qy.gzpeiyou.com/Public/60s/reward/7.png"
                    })
                }else if(parseInt(day)>=14&&parseInt(day)<21){
                    that.setData({ 
                        Img:"http://qy.gzpeiyou.com/Public/60s/reward/14.png"
                    })
                }else if(parseInt(day)==21){
                    that.setData({ 
                        Img:"http://qy.gzpeiyou.com/Public/60s/reward/21.png"
                    })
                }                
            },
            fail:function(){}
        })
      }
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