var app = getApp()
var progress = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]
var hideHintTimer;

Page({
    data:{
        curUserInfo:'',//当前用户
        day:1,
        dayProgressImg:'',
        progress:progress,
        greatList:'',
        showRefreshStatus:true
    },
    lookGreat:function(e){
        var status = e.currentTarget.dataset.status;
        var id = e.currentTarget.dataset.id;
        var day = parseInt(e.currentTarget.dataset.day)+1;
        if(status=='1'){
            wx.navigateTo({
                url: '../result/result?id='+ id+'&day='+day
            })
        }else{
            wx.navigateTo({
                url: '../wait/wait'
            })
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
                showRefreshStatus: true  
            })  
            setTimeout(function () {   
                animation.translateY(0).step()   
                this.setData({    
                    animationData: animation.export()   
                    })  }.bind(this), 200) 
           setTimeout(function(){
           that.setData({
               showRefreshStatus: false   
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
            showRefreshStatus: false   
            })  
        }.bind(this), 200) 
    },
    attend:function(){//参加
        wx.navigateTo({
            url: '../ward/ward'
        })
    },
    onPullDownRefresh:function(){
        wx.redirectTo({
            url: '../logs/logs'
        })
    },
    onLoad:function(){
        var that = this;
        var userInfo = app.globalData.userInfo;
        that.setData({
            curUserInfo:userInfo,
        });
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
                    one:parseInt(res.data.day)%10,
                    decade:parseInt(parseInt(res.data.day)/10),
                    greatList:res.data.list
                });
                var date = res.data.day.toString();
                var status = res.data.list[res.data.day].status;
              
            //    wx.removeStorage({
            //         key: date,
            //         success: function(res) {
            //             wx.showToast({
            //                 title: '缓存已清除',
            //                 icon: 'success',
            //                 duration: 5000
            //             })
            //         } 
            //     })
                wx.getStorage({
                    key: date,
                    success: function(res) {
                        
                    },fail:function(){
                        wx.setStorage({
                            key:date,
                            data:status
                        })
                        wx.showToast({
                            title: '成绩正在玩命生成中',
                            icon: 'loading',
                            duration: 9000
                        })
                        setTimeout(function(){
                            wx.hideToast()
                            wx.redirectTo({
                                url: '../logs/logs'
                            })
                        },9000)
                    } 
                })


            },
            fail:function(){}
        })

        // var animation = wx.createAnimation({   
        //         duration: 1500,   
        //         timingFunction: "linear",   
        //         delay: 1500  
        //     })  
        //     that.animation = animation  
        //     animation.top(-150).step()  
        //     that.setData({   
        //         animationData: animation.export(),
        //     }) 
    },
    onShow:function(){
        var that = this;
        


        hideHintTimer = setTimeout(function(){
            that.setData({
                showRefreshStatus:false
            });
        },1500); 
        
        


        //var key;
        // wx.getStorage({
        //     key: 'key',
        //     success: function(res) {
        //         that.setData({
        //             showRefreshStatus:false
        //         });
        //     },fail:function(res){
        //         console.log(res)
        //         that.setData({
        //             showRefreshStatus:true
        //         });
        //         hideHintTimer = setTimeout(function(){
        //             that.setData({
        //                 showRefreshStatus:false
        //             })
        //         },2000); 
        //      var animation = wx.createAnimation({   
        //             duration: 2000,   
        //             timingFunction: "linear",   
        //             delay: 1000  
        //         })  
        //         that.animation = animation  
        //         animation.top(-150).step()  
        //         that.setData({   
        //             animationData: animation.export(),
        //         }) 
        //         wx.setStorage({
        //             key:'key',
        //             data:"1"
        //         });
        //     }
        // })
       
    }
})

