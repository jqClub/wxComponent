//获取应用实例
var app = getApp()
var log = console.log.bind(console)
 //10.15新增缓存内容
var wcache = require("./wcache.js") 

 //10.15新增缓存内容
var getWx = require("./getWx.js") 
//12.03新增，1.如果没有登录app，先去判断本地有没有swan_id，没有，先去获取
//2.然后传swan_id去登录账号
//3.如果玩到第5题，会弹出登录的弹窗
//4.然后带上swan_id，后台去合并2个账号的数据

var logn = function() {
    var num1 = arguments[0]
    var num2 = arguments[1]
    
    if(typeof num2 == 'object') {
        num2 = JSON.stringify(num2)
    }
    //  //测试打印信息
    swan.showModal({
        title: num1,
        confirmText: '好的',
        showCancel: false,
        content: num2,
        success: function(res) {}
    })
}


//1.直接通过code去登陆
//通过code去登陆(只有通过code去登陆)
var getCode = function(that, callback) {
	//11.30新增，是否有登录过
	var loginApp = app.data.loginApp
	//说明没有登录过app
	if(!loginApp) {
//		that.setData({
//			is_login_app: true,
//		})
		hasSwanId(that, callback)
		
		app.loading.hide()
		return
	}
	//11.29新增，再用户登录app后，再去登录
	getCodeNew(that, callback)
}

//11.29新增，再用户登录app后，再去登录
var getCodeNew = function(that, callback) {
	//11.27新增,loading的动画
	app.loading.show()
	
	getWx.wxLoginNew(function(res) {
		Wechat_auth(callback, that, {
			code: res.code,
		})
	}, function(res) {
		log('-getCodeNew-', res)
			
		//11.12新增，没有登陆时的提示信息
		res = res || {}
		var errMsg = res.errMsg 
		log('-getCodeNew-', errMsg)
//		if(errMsg) {
//			app.showToastNew(errMsg)
//		}
		//11.29新增，这里去延迟去消失，可以看到内容
		setTimeout(function() {
			app.loading.hide()
		}, 1500)
	})
}

//2.获取到授权后的登陆
//2.获取到用户信息后，再去登陆
var authorizedInfo  = function(that, callback) {
	//11.08新增,loading的动画
	app.loading.show()
	
	getWx.getUserInfoNew(function(res) {			
		Wechat_auth(callback, that, {
			code: res.code,
			rawData: JSON.stringify(res.userInfo),
		})
	}, function() {
		
	})
}


//登录斑马英语
var	Wechat_auth = function(callback, that, logMSG) {
		//19.3.15新增，处理开发工具上的问题
		logMSG.swan_id = dealTool(logMSG.swan_id)
	
		//新增一个没有swanId也要加上的判断
		var app_swan_id = app.data.swan_id
		var swan_id = logMSG.swan_id
		if(!swan_id) {
			//判断有才加上，没有的话，不用加上
			if(app_swan_id) {
				logMSG.swan_id = app_swan_id
			}
		}
		
		swan.request({
			url: app.data.API.WECHAT_AUTH,
			data: logMSG,
			header: {
				'content-type': 'application/json'
			},
			success: function(res) {
				//11.08新增,loading的动画
				app.loading.hide()
				
//				//12.03新增，判断是否有授权过(不要在授权的时候去判断)
//				if(logMSG.rawData) {
//					//说明授权过
//					app.data.hasAccredit = true
//				}
				
//				//11.29新增，关闭用户登录的弹窗
//				12.12去除--原来的登录弹窗，直接去掉，使用新的登录弹窗
//				that.setData({
//					is_login_app: false,
//				})

				var statusCode = res.statusCode //返回的状态码
				//06.29修改(不是200，直接返回，并提示需要再次点击登录按钮)
				if(statusCode != 200) {
					//					Wechat_auth_retry(statusCode, res)
					Wechat_auth_retry(statusCode, res, callback, that, logMSG)
					return
				}

				log('登录接口的返回', res)
				if(res.data.c == '0') {
					var user = res.data.d.user
//					if(typeof(res.data.d.user.uid) == 'string' && res.data.d.user.uid > 0) {
//					if(user.uid) {
						//11.30新增判断是否是新用户
//						app.saveNewUser.saveNew(user.is_new_user)
						saveNewUserSave(user.is_new_user)

						var user_msg = user
						user_msg.user_id = user.uid;
						
						//11.23新增，用户头像默认
						var head = dealHead(user_msg)
						user_msg.avatar = head
						
						//12.03去除本地的登录信息，因为并不知道上一次是通过什么方式去登录的
////						//登录时间
//						user_msg.set_time = app.gettimestamp();						
//						//保存在本地里面（过期的秒数）
//						wcache.put('user_msg', user_msg)
					
						//放入本地缓存
//						swan.setStorage({
//							key: "user_msg",
//							data: user_msg
//						})
//						swan.setStorage({
//							key: "token",
//							data: user_msg.token
//						})
//						swan.setStorage({
//							key: "user_id",
//							data: user_msg.user_id
//						})

						app.data.userInfo = user_msg;

//						swan.showToast({
//							title: '登录成功',
//							icon: 'success',
//							duration: 1000
//						})

						//12.03新增，判断是否有授权过(不要在授权的时候去判断)
						if(logMSG.rawData) {
							//说明授权过
							app.data.hasAccredit = true
						}
						
						//回调
						if(typeof(callback) == "function") {
							callback(res);
						}
//					} else {
//						//06.29修改登录的信息
////						Wechat_auth_retry(statusCode, res)
//						Wechat_auth_retry(statusCode, res, callback, that, logMSG)
//					}
					
					//12.07新增,在成功之后,再去保存swan_id,防止有报错的情况出现
					saveSwanId(swan_id)
				} else {
					//06.28修改：估计登录的问题是获取code太频繁了，导致原来数据解密失败。(处理登录的bug，不知道有没效果)
					//再次重试先
//					Wechat_auth_retry(statusCode, res)
					Wechat_auth_retry(statusCode, res, callback, that, logMSG)
				}
			},
			fail: function(res) {
				//11.08新增,loading的动画
				app.loading.hide()
				
				console.log('fail-WECHAT_AUTH', res);
//				//提示,11.30新增，去掉这个提示信息
//				swan.showToast({
//					title: '登录失败',
//					icon: 'loading',
//					duration: 2000
//				})
			}
		})
	}


var Wechat_auth_retry= function(statusCode, res, callback, that, logMSG) {
	//19.2.13新增，报错的时候，带上参数
	logn('传递的参数', logMSG)
	
	var content = `-返回: ${JSON.stringify(res)}`
	try{
		if(res) {
			if(res.data) {
				content = '-返回:' + res.data.m + '-登录错误号:' + res.data.c
			}
		}
	}catch(e){}
	//去掉重试信息
	swan.showModal({
		title: '登录错误',
		showCancel: false,
		cancelText: '玩点别的',
		confirmText: '重新登录',
		content: '状态码:' + statusCode + content,
		success: function(res) {
			if(res.confirm) {
//					console.log('用户点击确定');
				//11.29新增，用户点击后，继续使用code去登录
//				getCodeNew(that, callback)

//				//12.03新增，重新去登录
//				Wechat_auth(callback, that, logMSG)
				
				
				//19.2.12新增，重新去登录，获取新的code和参数
				getCode(that, callback)
			} else if(res.cancel) {

			}
		}
	})
}

///////////////////////////////////////////
///////////////////////////////////////////
//11.30新增，判断是否有SwanId
var hasSwanId = function(that, callback) {
	//12.03新增，如果是有本地数据，就不用去获取了，否则再去获取
	var app_swan_id = app.data.swan_id
	if(app_swan_id) {
		//11.27新增,loading的动画
		app.loading.show()
		
		Wechat_auth(callback, that, {
			swan_id: app_swan_id,
		})
		return
	}
	
	getWx.getSwanId(function(res) {
		var swan_id = res.data.swanid
		
//		//设置一个全局的变量
//		app.data.swan_id = swan_id
//		
//		//12.03新增存本地，因为后面登录的时候，需要取这个值
//		wcache.put('swan_id', swan_id)
		
		//11.27新增,loading的动画
		app.loading.show()
		
		Wechat_auth(callback, that, {
			swan_id: swan_id,
		})
	}, function(res) {})
}


//2.处理用户头像为空的情况
var dealHead = function(user) {
	var avatar = user.avatar
	//如果没有，就去设置一个默认头像
	if(!avatar) {
		avatar = app.data.defaultAvatar
	}
	return avatar
}

//12.07新增,如果成功再去保存swan_id,防止出现错误
var saveSwanId = function(swan_id) {
	//12.07新增,如果没有,直接返回
	if(!swan_id) {
		return
	}
	
	//12.12新增判断，如果有，就不去设置了（说明本地是有的了）
	if(app.data.swan_id) {
		return
	}
	
	//设置一个全局的变量
	app.data.swan_id = swan_id
	
	//12.03新增存本地，因为后面登录的时候，需要取这个值
	wcache.put('swan_id', swan_id)
}

//////////////////////////////////////////////
//12.12新增，直接去设置本地的值
var saveNewUserSave = function(isNew) {
//	var self = this			
	//11.15新增，再第二次登陆的时候，不去判断新用户
	var is_new = app.data.is_new 
	if(is_new == 'new') {
		//不去做判断，因为第二次会清空这个缓存
		return
	}
	
//			isNew是0的话,不用去发送请求了
//			如果是1的话,需要发送新用户的请求
	//存新的名字，防止有影响
	if(isNew == 1) {
		//新用户，存本地
		wcache.put('isNew', 'new', wcache.nextDayTime()) 
		app.data.is_new = 'new'
	} else if(isNew == 0) {
		//旧用户，存本地,永久信息
		wcache.put('isNew', 'old') 
		app.data.is_new = 'old'
	}
	log('登陆获取的新旧用户判断', app.data.is_new)
}


//19.3.15处理开发工具上的问题
var dealTool = function(swan_id) {
	var that = this
	if(swan_id == 'SWAN-DEVTOOLS') {
		log('-开发工具上，需要修改swan_id-')
		swan_id = 'SwEKmBSskTb9HckhJGP6bica5vaykwuDCdfQ4EAVuwCaVRxHTRRYWsz6TdZ5WvAXM5DuZGPMbakBsmxLGDDGXudH'
	}
	return swan_id
}

module.exports = {
	//1.直接通过code去登陆
	getCode,
	//2.获取到授权后的登陆
	authorizedInfo,
	//3.登陆的接口
	Wechat_auth,
	//11.29新增，再用户登录app后，再去登录
	getCodeNew,
}