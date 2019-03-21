//获取应用实例
var app = getApp()
var log = app.log()
		//处理 数据(版本控制)
	var isVer = function(data) {
		var app_ed = app.data.logmsg.app_ed  //我的版本号
		var ver = data
		log(`app_ed; ${app_ed}, ver; ${data}`)
		var isVer = (ver == app_ed)
		log(`isVer; ${isVer}`)
		app.data.isVer = isVer
	}
	//是否是ios版本
	var	isIos= function() {
		var system_str = app.data.getSystemInfo.system_str
		if(system_str == 'ios') {
			return true 
		} else {
			return false
		}
	}


module.exports = {
	isVer: isVer,
	isIos: isIos,
}