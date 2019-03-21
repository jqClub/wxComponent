var log = console.log.bind(console)
//获取应用实例
var app = getApp()

var loginNew = require("./loginNew.js");   //关于微信授权的获取

 //10.15新增缓存内容
var getWx = require("./getWx.js") 

var clickLogin= function() {
	var that = this
//			1.是否有授权信息
//			有,直接去登陆
//			没有,弹出提示框
	//////				1.判断是否有授权过的信息
	getWx.getSettingNew(function() {
		log('获取用户信息-有授权')
		//有授权信息
		that.getUserInfo()
	}, function() {
		log('获取用户信息-没有授权')
		//没有用户的授权信息
		that.hasNoUbqr()
	})
}
//没有授权信息的操作
var hasNoUbqr= function() {
	var that = this
//	//11.12新增,显示loading动画
//	app.loading.show()
	
	//	3.如果关闭了,打开用户设置界面
	//说明用户拒绝了授权
	var refuse = that.data.refuse
	log('弹窗是否拒绝或失败', refuse)
	if(refuse) {
//		//11.08新增,loading的动画
//		app.loading.hide()
		
		//说明拒绝过，直接设置的界面
		getWx.openSettingNew(function() {
			log('打开了设置的界面')
//						that.setData({
//							refuse: false,
//						})
		}, function() {})
	} else {
		//调起用户授权的弹窗
		that.openAuthorizeNew()
	}
}
//调起用户授权的弹窗
var openAuthorizeNew= function() {
	var that = this
//	//11.12新增,显示loading动画
//	app.loading.hide()
	
	//				//				2.如果没有授权,信息,就打开授权的弹窗
	getWx.authorizeNew(function() {
		log('用户点击的授权--确定')
		that.getUserInfo()
	}, function() {
		log('用户点击的授权--拒绝')
		that.setData({
			refuse: true,
		})
	})

}
//获取用户的授权信息
var getUserInfo= function() {
	var that = this
	//11.06新增登陆模块（通过授权去登陆）
	loginNew.authorizedInfo(that, function() {
//		 that.triggerEvent('login')
		that.onlogin()
	})
}

//关闭登录的弹窗
var closeLogin = function() {
	var that = this
	that.setData({
		initial_show: false,
	})
}


//11.29新增一个登录app的弹窗
var clickLoginApp = function() {
	var that = this

//	loginNew.getCodeNew(that, that.onlogin.bind(that))
	loginNew.getCodeNew(that, function() {
		//12.12修改，因为从我的地图进入后，再去登录百度账号，可能没有玩过第6关，所以就直接归到0
		//从我的地图进入后，会带有参数，需要在重新登录之后，去清空数据
		that.setData({
			options: {},
		})
		that.onlogin()
	})
}

module.exports = {
 	getUserInfo,
 	openAuthorizeNew,
 	hasNoUbqr,
 	clickLogin,
 	
 	closeLogin,
 	//11.29新增-先登录app的弹窗
 	clickLoginApp,
}
