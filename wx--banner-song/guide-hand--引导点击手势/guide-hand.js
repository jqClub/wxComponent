//获取应用实例
var app = getApp();

var log = console.log.bind(log)

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
    // 弹窗标题
    adType: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
//    value: 1     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗内容
    showBtn: {
      type: Boolean,
      value: true,
    },
    // 弹窗内容
//  content: {
//    type: String,
//    value: '弹窗内容'
//  },
//  // 弹窗取消按钮文字
//  cancelText: {
//    type: String,
//    value: '取消'
//  },
//  // 弹窗确认按钮文字
//  confirmText: {
//    type: String,
//    value: '确定'
//  }
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    isShow: false, 
    loadSuccess: false,
  },
  /* 组件 ,设置外部样式 */
  externalClasses: ['my-class'],

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
  	loadSuccess: function(e) {
  		var that = this
//		log(111111, e)
  		var btnStyle = e.target.dataset.style
  		
  		var adType = that.data.adType
			log('广告加载', e, btnStyle, adType)
  		
			if(btnStyle == adType) {
				that.setData({
	  			loadSuccess: true,
	  		})
	  		log('广告是否加载成功', that.data.loadSuccess)
	  		
//	  		//11.15修改，直接去设置值
			setTimeout(function() {
				var showAd = app.data.show_ad
			  	that.setData({
			        showAd:  showAd || false,
			     })
			  	
			  	console.log('显示广告', showAd)
			  }, 500)

//	  		//延迟一点去，设置ipShow的值
//			  setTimeout(function() {
//			  	that.setData({
//			        ipShow: app.data.ipShow || false,
//			      })
//			  	
//			  	console.log(that.data.ipShow, app.data.ipShow)
//			  }, 500)
				
			}	
  	},
  	loadError(e) {
  		var that = this
  		var btnStyle = e.target.dataset.style
  		log('广告加载失败Error', btnStyle)
  		//如果是福利中心，就去触发事件
  		if(btnStyle == 'gift_center') {
  			this.triggerEvent("loadError")
  		}
  	},
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
// 	if(!that.data.loadSuccess) {
// 		return
// 	}
 	
 	
// 	//延迟一点去，设置ipShow的值
//setTimeout(function() {
//	that.setData({
//      ipShow: app.data.ipShow || false,
//    })
//	
//	console.log(that.data.ipShow, app.data.ipShow)
//}, 500)
 }
})