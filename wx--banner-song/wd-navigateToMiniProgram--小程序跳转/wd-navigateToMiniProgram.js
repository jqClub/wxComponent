var log = console.log.bind(console)

//app的方法
let app = getApp();

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    // 这个是传递过来的跳转信息
    appData: {            // 属性名
      type: Object,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
//    value: '标题'     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    //这个是显示的位置，可能需要传递给父页面中去做统计的事件
   mta: {
   		type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
//    value: '标题'     // 属性初始值（可选），如果未指定则会根据类型选择一个
   }
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
  	
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
     /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
   	//小程序导航
		ad_navigateToMiniProgram : function(e){
			var that = this
			
			//获得自定义的属性(这里可以拿到appid, path, data)
			var sData = e.target.dataset
			
			//这个是传递的信息
			var appData = that.data.appData || {}
			//这个是跳转的位置信息
			//10.23如果有的话，就去添加，否则不添加
			if(that.data.mta) {
				var mta = that.data.mta
				log(appData, mta)
				appData.mta = mta
			}
			
			//detail对象，提供给事件监听函数。这个可以用来向父级传值
			//这里合并2个对象，可以直接拿appid，path，data
    	var myEventDetail = Object.assign(appData, sData)
    	
    	that.setData({
				myEventDetail,
			})
//  	//触发成功回调//把这个传递给父元素去统计等
//    this.triggerEvent("ToMiniProgram", myEventDetail);
			
			//调用小程序跳转的方法
//			app.navigateToMiniProgram(sData.appid, sData.path, sData.data, sData.envVersion)
				//调用小程序跳转的方法(navigateToMiniProgram函数中会先判断下，版本号，再去执行跳转的方法)
				app.navigateToMiniProgram(sData.appid, sData.path, sData.data, sData.envVersion, that.successEvent.bind(that))
		},
   successEvent :function() {
   		log('成功的函数', this)
   		var that = this
   		var myEventDetail = that.data.myEventDetail
   			//触发成功回调//把这个传递给父元素去统计等
      this.triggerEvent("ToMiniProgram", myEventDetail);
      
      
      //10.23新增统计数据，跳转过去的统计
      	var appid = myEventDetail.appid
      	if(appid) {
      		app.commonMtaNew('adsstatistical', 'appid', appid)
      	}
   },
},
})