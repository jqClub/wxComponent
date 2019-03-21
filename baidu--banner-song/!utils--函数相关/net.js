var log = console.log.bind(console)

//获取应用实例
var app = getApp()

var hasNoNet = function(that, fun) {
	swan.getNetworkType({
		  success: function(res) {
		    // 返回网络类型, 有效值：
		    // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
		    var networkType = res.networkType
		    console.log('网络状态', networkType)
		    
		    if(res.networkType == "none"){
		        that.setData({nonet: false})
		     }else{
		        that.setData({nonet: true})
		     }
			noNetDo(that, fun)
		  },
		  fail: function() {
		  	that.setData({nonet: false})
		  		noNetDo(that, fun)
		  	}
		})
}


var noNetDo = function(that, fun) {
	//09.26新增，断网处理
	var nonet = that.data.nonet
	// log('index网络状态1', nonet, that.selectComponent('#popup'))
	if(!nonet) {
//		//11.22修改,如果没有就不去处理了
//		if(!that.selectComponent) {
//			return
//		}
//		that.selectComponent('#popup').show('network')
		
		that.setData({
			network: true,
		})
	} else {
		if(typeof fun == 'function') {
			fun()
		}
	}
}


var setNet = function(that, fun) {
	hasNoNet(that, fun)
	//无网络时做提示no net
    swan.onNetworkStatusChange(function(res){
      console.log('监听网络状态', res)
      var networkType = res.networkType
      
      if(res.networkType == "none"){
	        that.setData({nonet: false})
      }else{
	        that.setData({nonet: true})
      }
      noNetDo(that, fun)
    })
}

////////////////////////////////////////////////
////////////////////////////////////////////////
 //11.2新增弱网判断
var	v_goback = function(that) {
    hasNoNet(that, function() {
//		that.selectComponent('#popup').hide()
		that.setData({
			network: false,
		})
			
		//重新请求一遍（强制更新到页面中）
//		app.bindViewTap_three('index', '', 'reLaunch')
		//11.29修改，用上面的方法，会出现无法旋转（即有些接口无法继续设置）
		that.onLoad()
		that.onShow()
	})
}

 //11.2新增弱网判断(其他页面的判断)
var	v_goback_other = function(that) {
    hasNoNet(that, function() {
		//重新请求一遍页面
		app.bindViewTap_three(that.data.index, '', 'redirectTo')
		
		//设置全局的不显示弹窗
		app.data.isNet = true
	})
}


module.exports = {
	hasNoNet,
	noNetDo,
	setNet,
	v_goback,
	v_goback_other,
}
