var log = console.log.bind(console)

//19.2.19新增，等级相关的资料
import {levels} from '../../utils/content';
var app = getApp()

//log(111111, levels.timuLen)
//总的题目数量
var timuLen = levels.timuLen
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
  	//题库的数量
  	timuLen: timuLen,
		//用户已答题的数量
		userTimu: 1, //用户当前回答的题目数量
  	clickCiuu: 1,  //用户点击的次数
  	num: 90,  //默认显示的是90道题目
  	level: 0,//当前的等级
  	levelName: levels.names[0],  //用户等级名字
  	//是否显示左右2个按钮
  	showButton: {
  		left: 0,
  		right: 1,
  	},
  	//显示星星的颗数
  	showStar: 1,
  	//显示锁的状态
  	locks: [0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
//ready: function(){
//	在组件实例进入页面节点树时执行
	attached: function(){
  	var that = this
////		//19.2.19根据用户题目数量，来显示不同等级和解锁状态
//		that.judgeUserTimu(300)
  },
  methods: {
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
		  	add: function() {
//		  		log('增加')
		  		that.addReduce(1)
		  	},
		  	reduce: function() {
//		  		log('减少')
		  		that.addReduce(-1)
		  	},
		  }
	  	
	  	if(typeof events[clickType] == 'function') {
	  		events[clickType]()
	  	}
  },
  //增加和减少等级的函数
  addReduce: function(fuhk) {
  	var that = this
  	//点击一次是增加题目数9 * 10道题目（根据点击次数来增加相应的题数，来显示不同等级）
  	var clickNum = levels.eachgate * fuhk
  	var num =  that.data.num + clickNum
  	that.setData({
  		num,
  	})
  	//根据当前的等级来判断是否显示按钮
		that.judgeShowButton()
  	//判断星星的显示
  	that.judgeStar(fuhk)
  	//判断用户的等级
  	that.judgeLevel()
  	//判断用户显示的锁的状态
  	that.judgeLocak()
  },
  //根据用户的题目数量，来判断等级和星星等等
  judgeUserTimu: function(userTimu) {
  	var that = this
  	//是90的多少倍
  	var multipleThree = parseInt(userTimu / levels.eachgate)
  	log('用户当前题目数', userTimu)
  	that.setData({
  		userTimu,
  	})
  	//这里需要处理下
  	if(userTimu % levels.eachgate == 0) {
			multipleThree = multipleThree - 1
		}
		that.addReduce(multipleThree)
  },
  //判断用户显示的锁的状态
  judgeLocak: function() {
  	var that = this
		var clickCiuu = that.data.clickCiuu - 1
		var locks = that.data.locks
		//这里不一定是9个,需要根据题库数量来处理
		for(var i = 0; i < 9; i++) {
				locks[i] = clickCiuu * levels.eachgate  + (i + 1) * levels.timuNum
		}
		that.setData({
			locks,
		})
  },
  //判断星星的显示
  judgeStar: function(fuhk) {
  	var that = this
  	var clickCiuu = that.data.clickCiuu + fuhk
  	var starNumber = levels.starNumber
//	var showStar = clickCiuu % starNumber || starNumber
//	log('showStar', showStar)
  	that.setData({
  		clickCiuu,
//		showStar,
  	})
  	log('clickCiuu', clickCiuu)
  },
////判断用户的等级
//judgeLevel: function() {
//	var that = this
//	var num = that.data.num
//	log('num', num)
//	var eachPass = levels.eachPass + 1 //360道题目 	
////	丢弃小数部分,保留整数部分 
//		var level = 0
//		//这里的等级需要超过一个才可以生等级
//		if(num > eachPass) {
//			level = parseInt(num / eachPass)
//		}
//	
//	var levelName = levels.names[level]
//	if(level >= levels.len) {
//		return
//	}
//	that.setData({
//		level,
//		levelName,
//	})
//},
	 //判断用户的等级
	  judgeLevel: function() {
	  	var that = this
	  	var num = that.data.num
	  	num = Number(num)
	  	var eachPass = levels.eachPass //360道题目 	
		//	丢弃小数部分,保留整数部分 （默认给的是0）
		var level = 0
		//这里的等级需要超过360才可以生等级
		if(num >= eachPass) {
			level = parseInt(num / eachPass)
			//如果是整除的，需要减去1。因为是在上一个区间内
			if(num % eachPass == 0) {
				level -= 1
			}
		}
		//获取用户等级名字
	  	var levelName = levels.names[level]
	  	if(level >= levels.len) {
	  		return
	  	}
//	  	//这里的等级比实际的第一级，所以直接加上就好了
	  	level += 1
			
			log('点击等级和名字', level, levelName)
				that.setData({
					level,
					levelName,
				})
	  },
  //根据当前的等级来判断是否显示按钮
  judgeShowButton: function() {
  	var that = this
  	var num = that.data.num
  	var set = 0 
  	if(num > 90) {
    	set = 1
  	}
  	that.setData({
  			['showButton.' + 'left']: set,
  	})
  	var set1 = 1
		if(num >= timuLen) {
    	set1 = 0
  	}
  	that.setData({
  			['showButton.' + 'right']: set1,
  	})
  },
  //点击打开题目
  openTimu: function(e) {
  	var that = this
  	var item = e.target.dataset.item
  	var isopen = e.target.dataset.isopen
  	
  	//19.2.27新增音效
  	comp.audioPlayNew('other_click')
  	
  	if(isopen) {
  		//进入答题页面(下面的是进入的题目数量)
  		item = item - 9
  		
  		//跳转到新的题目
  		var myEventDetail = {   
					item: item,
     	} 
     	that.closePop()
  		//触发成功回调
      this.triggerEvent("openTimu", myEventDetail);
  	} else {
  		//提示信息
  		app.showToastNew('需要先完成前一关喔~')
  	}
  },
  
  
//firstSetNum: function(num) {
	firstSetNum: function(obj) {
  	var that = this
  	
  	comp = obj.page
  	var num = obj.num
  	that.setData({
  		showCustoms: true,
  	})
	//		//19.2.19根据用户题目数量，来显示不同等级和解锁状态
		//这里判断是当前的题目（需要加上1，因为是根据当前题目来显示的）
		that.judgeUserTimu(num + 1)
  },
  
  closePop: function() {
  	var that = this
  	
  	//19.2.27新增音效
  	comp.audioPlayNew('other_click')
  	
  	that.setData({
  		showCustoms: false,
  	})
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
