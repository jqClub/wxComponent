var log = console.log.bind(console)
var app = getApp()
////19.2.19新增，等级相关的资料
//import {levels} from '../../utils/content';

////总的题目数量
//var timuLen = 740
var comp

let compObj = {
  properties: {
    page: {
      type: String,
      value: '',
    },
  },
  data: {
  	game_state: 0, //弹窗类型（为0，关闭弹窗）
  	userInfo: {}, //用户的信息
  	balance: 0,//用户余额
  },
//ready: function(){
//	在组件实例进入页面节点树时执行
	attached: function(){
  	var that = this
//		//19.2.19根据用户题目数量，来显示不同等级和解锁状态
//		that.judgeUserTimu(361)
  },
  methods: {
//	//提现时间已过，转成能量值
//	timeOutTurnEnergy: function() {
//		var that = this
//			//这里去存在本地去
////		  		/获取用户的信息
//		    var prom1 = app.apiAsk('CLEAR_POWER_API', {});
//		    // 题目
//		    prom1.then(res => {
//		    	if(res.data.c == '0') {
//		    		log('清空成功')
//		    		app.setUser(comp)
//		    	}
//		    })
//		
//	},
  	showRedpacketFirst: function(obj) {
  		var that = this
  		comp = obj.page
  		that.setData({
  			userInfo: app.data.userInfo,
  		})
  		
  		var game_state = 1
//		if(obj.type == 'timeOutTurnEnergy') {
//			game_state = 6
//			that.timeOutTurnEnergy()
//		}
  		that.setData({
  			game_state: game_state,
  		})
  	},
  	//点击排行榜，提示授权的弹窗
	//10.09新增公用的点击事件
  clickAll: function(e) {
  	var that = this
  	var clickType = e.target.dataset.clicktype
  	that.clickEvent(clickType, e)
  	
  	//19.2.27新增音效
  	comp.audioPlayNew('other_click')
  },
  clickEvent: function(clickType, e) {
	  	var that = this
	  	if(!clickType) {
	  		return
	  	}
	  	var events = {
	  		closeOnly: function() {
	  			var self = this
	  			that.setData({
		  			game_state: 0,
		  		})
	  		},
		  	close: function() {
//		  		log('增加')
		  		var self = this
		  		
//		  			//播放音效
//		  		self.gotoPlay(e)
		  		
		  		self.closeOnly()
		  		//触发成功回调
  				that.triggerEvent("closered");
		  	},
//		  	//继续游戏播放音效
//		  	gotoPlay: function(e) {
//		  		var self = this
//		  		try{
//		  			var play = e.target.dataset.play
//			  		if(play) {
//			  			comp.audioPlayNew('other_click')
//			  		}
//		  		}catch(e){
//		  			//TODO handle the exception
//		  		}
//		  	},
		  	openShare: function() {
		  		var self = this
//		  		log('打开分享')
						app.showToastNew('分享给好友后，可抢现金红包哦！')
		  			var result = {
		  				success: function() {
					  		setTimeout(function() {
					  				self.getPower()	
					  		}, 1000)
		  				},
		  				fail: function() {
		  					var value = app.shareFail()
		  					app.showToastNew(value)
		  					
		  				},
		  			}
		  			//打开分享的界面
		  			app.openShare(result)
		  			
//		  			//19.2.25新增音效
//		  			comp.audioPlayNew('open_libao')
		  	},
		  	getPower: function() {
		  		var self = this
		  				  			//19.2.25新增音效
		  		comp.audioPlayNew('open_libao')
		  		
		  		var oldValue = app.data.userInfo.powerValue
		  		var powerValue = app.content.getEnergyRange(oldValue)
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
				    var prom1 = app.apiAsk('POWER_API', {
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
		  	//去提现
		  	goto_withdraw: function() {
		  		app.showToastNew('暂未达到提现额度哦~')
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
