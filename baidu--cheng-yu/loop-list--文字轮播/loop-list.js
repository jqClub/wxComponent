/**
 * wd-loop-ad
 * @desc 广告(小程序跳转) 循环显示
 * @需求 1、icon按BMS后台设置的权重排序进行展现
 *       2、用户点击过icon后，icon位自动更换为下一个用户未点击过的icon
 *       3、如所有icon都已点击过，即重新按排序出现
 *       4、用户如点击过一个icon，退出小程序再次进入，icon位也会自动更换为下一个
 * @param {array} [adList] - 从BMS得到的广告列表
 * @param {string} [type] -  需要循环的广告的type
 * @param {string} [flag] - 需要循环的广告的flag
 *
 * @example
 * "usingComponents": {
 *  "wd-loop-ad": "../../components/wd-loop-ad/wd-loop-ad",
 * }
 * 已删除<wd-loop-ad ad-list="{{bmsAdList}}" bind:click="跳转小程序" bind:show="统计小程序显示"></wd-loop-ad>
 *  <wd-loop-ad  ad-list="{{bmsAdIndexaIcon}}" loopControl="{{loopControl}}" flag="index_icon" ></wd-loop-ad>
 * @author: 张晓彬
 * @version: 1.0.1  2018.08.21
 * 			1.0.2  2018.12.14 新接入的bms2广告，没有type，不用管这个字段
 * 
 * 
 */
var log = console.log.bind(console)
//var commonAds = require("../../utils/commonAds.js")  //接入BMS广告后台
//var wcache = require("../../utils/wcache.js") //引入缓存的机制

//获取应用实例
var app = getApp()

//var STORAGE_KEY_ADLIST = 'loop-ad.currentAdList'
//var STORAGE_KEY_INDEX = 'loop-ad.index'

Component({
	properties: {
		background: [],
		looptype: '',
	},
  data: {
//  background: [
//  	1, 2, 3, 4
//  ],
    vertical: true,  //滑动方向是否为纵向
    autoplay: true,  //是否自动切换
    circular: true,  //是否采用衔接滑动
    interval: 3000,  //自动切换时间间隔
    duration: 500,  //动画时长
  },

  methods: {
    /*tap() {*/
   	ad_navigateToMiniProgram() {
   		var that = this
   		var appData = that.data.appData
   		
   		var sData = {
   			appid: appData.adWxAppId,
   			path: appData.path,
   			data: appData.extra || '',
   		}
   		
   		//10.23新增，如果成功，才执行回调函数
//		if(app.data.obj_can.comparison207) {
//			//如果是支持navigateToMiniProgram方法,就使用新的
//			return
//		}

// 		//调用小程序跳转的方法(navigateToMiniProgram函数中会先判断下，版本号，再去执行跳转的方法)
   		app.navigateToMiniProgram(sData.appid, sData.path, sData.data, that.successEvent.bind(that))	
    },
   successEvent :function() {
   		var that = this
// 		app.logn('haha', {})
   		
   		var currentAdList = that.data.currentAdList
      // 触发click事件
      this.emitClick()

      const oldIndex = this.data.index
      // 循环
      let index = ++this.data.index
      if (index >= this.data.currentAdList.length) {
        index = 0
      }
      
      var appData = currentAdList[index] || {}
      
      this.setData({
      	index,
      	
      	appData: appData,
      })

      if(oldIndex !== index){
        // 触发show事件, 用于统计
        this.emitShow()
      }
   },

    // 触发show事件, 用于统计
    emitShow() {
    	var that = this
    	var showAd = this.data.currentAdList[this.data.index]
//    this.triggerEvent('show', showAd)
//    
//    //10.23新增统计的需求(//显示的参数，去发送请求)
////    log('showAd', showAd)
//    commonAds.addTsji('showAd', showAd)
		app.bmsAd.subMsg(showAd) // 展示元素时调用
    },

    // 触发click事件
    emitClick() {
    	var that = this
    	var showAd = this.data.currentAdList[this.data.index]
//    	this.triggerEvent('click', showAd)
//    
//     //10.23新增统计的需求
//      log('click', showAd)
//     	commonAds.addTsji('clickAd', showAd)

		app.bmsAd.subMsg(showAd, true) // 展示元素时调用
    },
  }
})
