var log = console.log.bind(console)
var app = getApp()

//版本控制相关
var content = require("../../utils/content.js")  

//11.22api接口数据
import apiAsk from '../../utils/apiAsk'
var comp 

let compObj = {
  properties: {
    star: {
      type: String,
      value: '',
      
    },
  },
  data: {
  	game_state: 0, //是否显示弹窗
  	
  	powerValue: {
  		multiple: 1,  //能量值的倍数
  		energyNum: 1,  //能量数
  	},
  },
//ready: function(){
//	在组件实例进入页面节点树时执行
	attached: function(){
  	var that = this
//		//19.2.19根据用户题目数量，来显示不同等级和解锁状态
//		that.judgeUserTimu(361)
 },
  methods: {
  	firstSet: function(page) {
  		var that = this
  		that.setData({
  			game_state: 1,
  		})
  		//设置页面的that值
  		comp = page
  	},
  	//点击排行榜，提示授权的弹窗
	//10.09新增公用的点击事件
  clickAll: function(e) {
  	var that = this
  	var clickType = e.target.dataset.clicktype
  	that.clickEvent(clickType)
  	
  	//19.2.27新增音效
  	comp.audioPlayNew('other_click')
  },
  clickEvent: function(clickType) {
	  	var that = this
	  	if(!clickType) {
	  		return
	  	}
	  	var events = {
		  	close: function() {
		  			//触发成功回调
						that.setData({
							game_state: 0,
						})
		  	},
		  	
		  	shareOpen: function() {
		  		var self = this
		  		app.showToastNew('分享给好友后，可抢能量值哦！')
		  		setTimeout(function() {
		  			var result = {
		  				success: function() {
		  					self.getPower()
		  				},
		  			}
		  			//打开分享的界面
		  			app.openShare(result)
		  		}, 1000)
		  	},
		  	getPower: function() {
		  		var self = this
		  		var oldValue = app.data.userInfo.powerValue
		  		var powerValue = content.getEnergyRange(oldValue)
		  		that.setData({
		  			powerValue,
		  			game_state: 2,
		  		})
		  		self.save(powerValue)
		  	},
//		  	保存用户的能量值
		  	save: function(powerValue) {
		  		var self = this
		  			//这里去存在本地去
//		  		/获取用户的信息
				    var prom1 = apiAsk('POWER_API', {
				    	type: 'add', //增加能量值
				    	value: powerValue.energyNum,
//								type: 'reduce', //减少能量值
//						    	value: 1,
				    });
				    // 题目
				    prom1.then(res => {
				    	if(res.data.c == '0') {
				    		log('领取能量值成功')
				    		app.setUser(comp)
				    	}
				    })
		  	},
		  }
	  	
	  	if(typeof events[clickType] == 'function') {
	  		events[clickType]()
	  	}
  },
//------------------------
    show(popupName, someData) {
    	var that = this
      console.log('popup组件被调用', popupName, someData)
//    someData這里是父级传过来的值
      this.setData({
      	type: popupName,
        someData: someData || {},
//      page: someData.index,
      })
      log('父级传递的参数', that.data.type, that.data.someData, that.data.page)
    },
    hide() {
    	var that = this
    	//设置为空，就可以不显示了
    	this.setData({
      	type: '',
     })
   },
    v_taptwo(e) {
    	var that = this
//  	var a = e.target.dataset.index
			// detail对象，提供给事件监听函数。这个可以用来向父级传值
    	var myEventDetail = {   
					val: 1
      } 
    	//触发成功回调
      this.triggerEvent("taptwo", myEventDetail);
    },
  }
}

Component(compObj)
