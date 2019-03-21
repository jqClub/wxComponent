//获取应用实例
var app = getApp()
var log = console.log.bind(console)
//10.15新增缓存内容
var wcache = require("./wcache.js") 

//10.15新增缓存内容
var isWx = require("./isWx.js") 


//11.19判断下，有没有授权信息，有的话， 就去请求。没有的话，直接传code过去
//是否有微信授权过
var isUbqr = function(page, callback) {
	var that = page

	//是否有微信授权过
	isWx.getWxUbqr({
		success: function() {
			//如果授权过,先去设置授权的标示
			app.data.hasAccredit = true   //07.03新增：设置已经授权过的信息
			that.setData({
				hasAccredit: true  //这个需要在页面里面去设置，因为需要更新数据
			})
			
			authorizedInfo(callback)
		},
		fail: function(res) {
			app.data.hasAccredit = false  //没有微信授权的信息
			that.setData({
				hasAccredit: false  //这个需要在页面里面去设置，因为需要更新数据
			})
			//去登录	
			getCode(callback)
		}
	})
}


//1.直接通过code去登录
//通过code去登录(只有通过code去登录)
var getCode = function(callback) {
	isWx.wxLogin().then(function(res) {
//		直接去登录
		Wechat_auth(callback, {
			code: res.code,
		})
	}).catch(function() {})
}

//2.获取到授权后的登录
var authorizedInfo  = function(callback) {
	//11.08新增,loading的动画
//	app.loading.show()
	
	//06.29新增，处理获取到授权信息后的操作
	var getUserInfo = isWx.getUserInfo()
	getUserInfo.then(function(res) {
//		//这里是获取的值
//		var logMSG = {}
//		logMSG.encryptedData = res.encryptedData;
//		logMSG.iv = res.iv;
//		logMSG.rawData = res.rawData;
//		logMSG.signature = res.signature;
//		logMSG.code = res.code

		//用户信息，全部发过去
		Wechat_auth(callback, res)
	}).catch(function(res) {
		log('用户拒绝了授权', res)
	})	
}

//登录斑马英语
var	Wechat_auth = function(callback, logMSG) {
		//11.19新增，获取的信息
		logMSG = logMSG || {}
		
		if(logMSG.userInfo) {
			logMSG.rawData = logMSG.userInfo
		}
		
		//11.23新增一个wechat_type标识
		logMSG.wechat_type = app.data.logmsg.wechat_type
		wx.request({
			url: app.data.API.WECHAT_AUTH,
			data: logMSG,
			header: {
				'content-type': 'application/json'
			},
			success: function(res) {
				console.log('WECHAT_AUTH-logMSG-3', res, logMSG)
				console.log(`statusCode: ${res.statusCode}`)
				//11.19新增判断处理--是否有授权信息
				if(logMSG.userInfo) {
					//设置是否有授权信息
					app.data.hasAccredit = true
				}
				
				
				var statusCode = res.statusCode //返回的状态码
				//06.29修改(不是200，直接返回，并提示需要再次点击登录按钮)
				if(statusCode != 200) {
					Wechat_auth_retry(statusCode, res, callback)
					return
				}

				if(res.data.c == '0') {
					//08.16新增，这里判断是否是新的用户(在aboutTsjiChannle函数里面)
					app.isAccreditNew(res, logMSG)

					if(typeof(res.data.d.user.uid) == 'string' && res.data.d.user.uid > 0) {
						var user = res.data.d.user
						
						//11.12新增，用户的信息
						var user_msg = user
//						user_msg.avatarUrl = user.avatar

						user_msg.user_id = user.uid;
						
						var name = dealName(user)
						user_msg.nickName = name
						user_msg.nickname = name
						
						//11.23新增，用户头像默认
						var head = dealHead(user)
						user.avatar = head
						user_msg.avatarUrl = head
						
						user_msg.user_id = res.data.d.user.uid;
						
						//12.14新增，因为ad广告统计，需要传这个，直接设置一下
						if(logMSG.userInfo) {
							user_msg.gender = logMSG.userInfo.gender || ''
						}
						
//						user_msg.token = res.data.d.user.token;
//						user_msg.pass = res.data.d.user.pass;
//						user_msg.score = res.data.d.user.score;

						//08.31新增，是否是首次登录
						user_msg.first_login = res.data.d.user.first_login;
						//登录时间
						user_msg.set_time = app.gettimestamp();

						//放入本地缓存
						wx.setStorage({
							key: "user_msg",
							data: user_msg
						})
						wx.setStorage({
							key: "token",
							data: user_msg.token
						})
						wx.setStorage({
							key: "user_id",
							data: user_msg.user_id
						})

						app.data.userInfo = user_msg;

						//07.05设置用户的openid
						app.setOpenId(res)

						//11.19去掉提示信息
//						wx.showToast({
//							title: '登录成功',
//							icon: 'success',
//							duration: 1000
//						})

						//回调
						if(typeof(callback) == "function") {
//							log(11111, app.data.userInfo)
							callback(res);
						}
					} else {
						//06.29修改登录的信息
						Wechat_auth_retry(statusCode, res, callback)
					}

				} else {
					//06.28修改：估计登录的问题是获取code太频繁了，导致原来数据解密失败。(处理登录的bug，不知道有没效果)
					//再次重试先
					Wechat_auth_retry(statusCode, res, callback)
				}
			},
			fail: function(res) {
//				console.log('fail-WECHAT_AUTH', res);
				//提示
				wx.showToast({
					title: '登录失败',
					icon: 'loading',
					duration: 2000
				})
			}
		})
	}


var Wechat_auth_retry= function(statusCode, res, callback) {
//		var that = this
		var content = `-返回: ${JSON.stringify(res)}`
		try{
			if(res) {
				if(res.data) {
					content = '-返回:' + res.data.m + '-登录错误号:' + res.data.c
				}
			}
		}catch(e){}
		//去掉重试信息
		wx.showModal({
			title: '登录错误',
			showCancel: false,
			cancelText: '玩点别的',
			confirmText: '重新登录',
			content: '状态码:' + statusCode + content,
			success: function(res) {
				if(res.confirm) {
					console.log('用户点击确定，需要再次去登录');
					getCode(callback)
				} else if(res.cancel) {

				}
			}
		})
	}

//1.处理用户姓名为空的情况
var dealName = function(user) {
	var nickname = user.nickname
	var uid = user.uid
	var bmhk = uid.slice(-7)
	if(!nickname) {
		nickname = '小可爱' + bmhk + '号'
	}
	return nickname
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

module.exports = {
	//1.直接通过code去登录
	getCode,
	//2.获取到授权后的登录
	authorizedInfo,
	//11.19新增是否有授权过
	isUbqr,
	//11.19新增，登录的函数
	Wechat_auth,
}