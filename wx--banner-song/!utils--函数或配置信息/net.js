var log = console.log.bind(console)

//获取应用实例
var app = getApp()

var hasNoNet = function(that, fun) {
	wx.getNetworkType({
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
		      	//09.26新增，断网处理
//				var nonet = that.data.nonet
//				log('index网络状态', nonet)
//				if(!nonet) {
//					that.selectComponent('#popup').show('network')
////					return 
//				}
				noNetDo(that, fun)
		  },
		  fail: function() {
		  	that.setData({nonet: false})
		  		noNetDo(that, fun)
		  		//09.26新增，断网处理
//				var nonet = that.data.nonet
//				log('index网络状态', nonet)
//				if(!nonet) {
//					that.selectComponent('#popup').show('network')
////					return 
//				}
//		  	that.setData({nonet: false})
		  }
		})
}


var noNetDo = function(that, fun) {
	//09.26新增，断网处理
	var nonet = that.data.nonet
	log('index网络状态', nonet)
	if(!nonet) {
		that.selectComponent('#popup').show('network')
	} else {
		if(typeof fun == 'function') {
			log(22222, fun)
			fun()
		}
//		that.selectComponent('#popup').hide()
////		重新去请求
//		log(3333333, fun)
//		if(typeof fun == 'function') {
//			log(22222, fun)
//			fun()
//		}
	}
}


var setNet = function(that, fun) {
	hasNoNet(that, fun)
	//无网络时做提示no net
    wx.onNetworkStatusChange(function(res){
      console.log('监听网络状态', res)
      if(res.networkType == "none"){
	        that.setData({nonet: false})
      }else{
	        that.setData({nonet: true})
      }
      noNetDo(that, fun)
    }) 
}


module.exports = {
	hasNoNet,
	noNetDo,
	setNet,
}