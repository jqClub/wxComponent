//获取应用实例
var app = getApp();

var log = console.log.bind(log)

var first = 0

// components/Dialog/dialog.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
//  // 弹窗标题
//  adType: {            // 属性名
//    type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
////    value: 1     // 属性初始值（可选），如果未指定则会根据类型选择一个
//  },
//  // 弹窗内容
//  showBtn: {
//    type: Boolean,
//    value: true,
//  },

		adNewType:  {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 'index',     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
//  // 弹窗显示控制
//  isShow: false, 
//  loadSuccess: false,
    
    apidsAll: {
    	'index': [6054947, 6084166, 6084169]
    },
    
    apids: [6054947, 6084166, 6084169],
    //19.2.13新增，切换广告的id
		showAd: {},
		//新增一条广告去处理
		adType: 0,
  },
/* 组件 ,设置外部样式 */
externalClasses: ['my-class'],

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
  	created: function() {
  		var that = this
  		log('created', that.data.adNewType)
  		var adNewType = that.data.adNewType
//		根据传过来的判断数据
  		var apids =  that.data.apidsAll[adNewType]
  		that.setData({
  			apids,
  		})
  		log('created-apids', apids)
  	},
  	//	-----------------------------------
	//19.2.11新增,广告诱导点击相关  
	loadSuccess: function(e) {
  		var that = this  	
  		var btnStyle = e.target.dataset.style
			log('广告加载', e, btnStyle)
  		
			setTimeout(function() {
			var bmsControl =  app.data.bmsControl
			log('广告bms控制', bmsControl)
			var showAd = bmsControl.show_ad
//				var showAd = true
				
				//设置不同的地方
				var res = 'showAd.' + btnStyle;
				that.setData({
			        [res]:  showAd || false,
//			        bmsControl: bmsControl,
			    })
				console.log('显示广告诱导', res, showAd)
		  }, 1000)
			
			first = 0
  	},
  	loadError(e) {
  		var that = this
  		log('广告加载失败Error', e)
  		var btnStyle = e.target.dataset.style
  		//设置不同的地方,不显示对应的按钮
			var res = 'showAd.' + btnStyle;
			that.setData({
		        [res]: false,
		  })
			
			//错误的时候，不重复去请求（只请求长度）
			first++ 
			var len = that.data.apids.length
			if(first >= len) {
				return
			}
			
			//19.2.13新增, 如果失败,就判断去显示新的一条广告内容
			that.showNewAd()
  	},
  	//19.2.13新增, 判断去显示新的一条广告内容
  	showNewAd: function() {
  		var that = this
  		var adType = that.data.adType
  		adType += 1
  		var len = that.data.apids.length
  		if(adType == len) {
  			adType = 0
  		}
  		that.setData({
  			adType: adType,
  		})
  		log('重新加载广告', adType)
  	},
//	loadSuccess: function(e) {
//		var that = this
//		var btnStyle = e.target.dataset.style
//		
//		var adType = that.data.adType
//			log('广告加载', e, btnStyle, adType)
//		
//			if(btnStyle == adType) {
//				that.setData({
//	  			loadSuccess: true,
//	  		})
//	  		log('广告是否加载成功', that.data.loadSuccess)
//	  		
//	  		//	  		//11.15修改，直接去设置值
//			setTimeout(function() {
////				var showAd = app.data.show_ad
//				var controlBms = app.data.controlBms || {}
//				var showAd = controlBms.show_ad
//				
//			  	that.setData({
//			        showAd:  showAd || false,
//			     })
//			  	
//			  	console.log('显示广告', showAd)
//					}, 1000)
//			}	
//	},
//	loadError(e) {
//		var that = this
////		var btnStyle = e.target.dataset.style
////		log('广告加载失败Error', btnStyle)
////		//如果是福利中心，就去触发事件
////		if(btnStyle == 'gift_center') {
////			this.triggerEvent("loadError")
////		}
//	},
    /*
     * 公有方法
     */

    //隐藏弹框
//  hideDialog() {
//    this.setData({
//      isShow: !this.data.isShow
//    })
//  },
//  //展示弹框
//  showDialog() {
//    this.setData({
//      isShow: !this.data.isShow
//    })
//  },
//  /*
//  * 内部私有方法建议以下划线开头
//  * triggerEvent 用于触发事件
//  */
//  _cancelEvent() {
//    //触发取消回调
//    this.triggerEvent("cancelEvent")
//  },
//  _confirmEvent() {
//    //触发成功回调
//    this.triggerEvent("confirmEvent");
//  }
 },
  ready: function() {
 		var that = this
 	}
})