var app = getApp()
var progress = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]

Page({
    data:{
        curUserInfo:'',//当前用户
        day:1,
        dayProgressImg:'',
        progress:progress
    },
    onPullDownRefresh:function(){
        wx.redirectTo({
            url: '../wait/wait'
        })
    },
    onLoad:function(){
        var that = this;
        app.getUserInfo(function(userInfo){//获取用户信息
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
                    console.log(res.data[res.data.day].status)
                    that.setData({
                        day:parseInt(res.data.day),
                        one:parseInt(res.data.day)%10,
                        decade:parseInt(parseInt(res.data.day)/10)
                    })

                    // wx.redirectTo({
                    //     url: '../wait/wait'
                    // })
                },
                fail:function(){}
            })
        });

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

