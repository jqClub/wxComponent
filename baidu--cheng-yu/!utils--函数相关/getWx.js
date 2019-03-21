var log = console.log.bind(console)

		
//是否有微信的授权信息
var getSettingNew = function(success, fail) {
	 swan.getSetting({
         success: (res) => {
            if(res.authSetting) {
		        if(res.authSetting['scope.userInfo']) {
		        	callBack(true)
		        } else {
		        	callBack()
		        }
		    } else {
		    	callBack()
		    }
          },
          fail: function() {
          	callBack()
         }
   })
	
	 let callBack = function(bool) {
	 	if(bool) {
	 		if(typeof success == 'function') {
						success()
					}
	 	} else {
	 		if(typeof fail == 'function') {
				fail()
			}
	 	}
	 }
}

//这个是获取code和微信的信息
var getUserInfoNew = function(success, fail) {
	swan.login({
        success: function(res) {
			log('getUserInfo1', res)
            if(res.code) {
                var code = res.code
                    //有授权的
                    swan.getUserInfo({
                        success : function(res){
                            res.code = code //把code添加进去
							log('getUserInfo2', res)
							callBack(true, res)
                        },
                        fail: function(res) {
							log('getUserInfo3')
							callBack(false, res)
                        }
                    })
            }
            callBack(false, res)
        },
        fail: function(res) {
        	log('isWx_getUserInfo_fail', res)
        	callBack(false, res)
        }
    })
	
	let callBack = function(bool, res) {
	 	if(bool) {
	 		if(typeof success == 'function') {
				success(res)
			}
	 	} else {
	 		if(typeof fail == 'function') {
				fail(res)
			}
	 	}
	 }
}

//直接去登录（获取用户的code值）
var wxLoginNew = function(success, fail) {
	swan.login({
            success: function(res) {
                if(res.code) {
                    if(typeof success == 'function') {
						success(res)
					}
                } else {
                	console.log('调用接口wx.login() 获取临时登录凭证（code）失败')
                }
            },
            fail: function(res) {
            	console.log('调用接口wx.login()失败')
            	if(typeof fail == 'function') {
						fail(res)
					}
            },
        })
}



// // // // // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // // // // 
// 10.30新增，打开设置界面
var openSettingNew = function(success, fail) {
	swan.openSetting({
			success: function (res) {
				if (res.authSetting["scope.userInfo"]) {
	                   //这里是授权成功之后 填写你重新获取数据的js
					if(typeof success == 'function') {
						success(res)
					}
	            }
			}
		});
}

//打开授权的弹窗
var authorizeNew = function(success, fail) {
	//授权的操作
		swan.authorize({
		  scope: 'scope.userInfo',
		  success: function (res) {
				if(typeof success == 'function') {
						success(res)
					}
			},
			fail: function(res) {
				log('登录页面失败', res)
				if(typeof fail == 'function') {
					fail(res)
				}
			},
		});
}

////////////////////////////////
//11.30新增，默认使用游客账号
var getSwanId = function(success, fail) {
	swan.getSwanId({
	    success: function (res) {
	        console.log('getSwanId成功', res.data.swanid);
	        if(typeof success == 'function') {
				success(res)
			}
	    },
	    fail: function(res) {
			log('getSwanId失败', res)
			if(typeof fail == 'function') {
				fail(res)
			}
		},
	});
}



module.exports = {
	//是否有微信的授权信息
	getSettingNew,
	//这个是获取code和微信的信息
	getUserInfoNew,
	//直接去登录（获取用户的code值）
	wxLoginNew,
	// 10.30新增，打开设置界面
	openSettingNew,
	//打开授权的弹窗
	authorizeNew,
	//11.30新增，默认使用游客账号
	getSwanId,
}
