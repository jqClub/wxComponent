// import c from '../../utils/console';
var log = console.log.bind(console)

const app = getApp();
const appData = app.data;
let comp;

var timer = null

const compObj = {
  options: {
    multipleSlots: true,
  },
  externalClasses: ['myclass'],
  data: {
    isOpen: false, // 是否展开
  },
  properties: {
    list: {
      type: Array,
      value: [],
      //这里可以设置默认的值
      observer(newVal) {
      	var that = this 
      	newVal = newVal || []
//    	that.subShow(newVal)
      	
      	//设置顺序晃动的效果
      	that.setInter(newVal.length)
      },
    },
    // 需要循环的广告的flag
    flag: {
      type: String,
      value: '',
    },
    //出现广告的样式
    cssType: {
      type: String,
      value: '',
    },
  },
  created() {
    comp = this;
  },
  attached() {
  },
  detached() {},
  methods: {
//  trigger(e = {}, isBubble) {
//    const target = e.currentTarget;
//    const data = target ? target.dataset : e;
//    
//    app.bmsAd.subMsg(data.msg, true) // 展示元素时调用
//  },
    
    ad_navigateToMiniProgram(e) {
   		var that = this
   		var target = e.currentTarget.dataset
	  	var msg = target.msg
   		var appData = msg	
   		var sData = {
   			appid: appData.adWxAppId,
   			path: appData.path,
   			data: appData.extra || '',
   			msg,
   		}

// 		//调用小程序跳转的方法(navigateToMiniProgram函数中会先判断下，版本号，再去执行跳转的方法)
   		app.navigateToMiniProgram(sData.appid, sData.path, sData.data, that.successEvent.bind(that))	
    },
    
    successEvent: function() {
       	var that = this
       	var msg = that.data.msg

//	      // 触发click事件
//	      this.emitClick()
					  	//12.21点击发送，里面有处理为空的情况
      	app.bmsAd.subMsg(msg, true) // 点击元素时调用
	   },
    
    subShow: function(newVal) {
    	var that = this 	
    	newVal = newVal || []
        if (!newVal.length) return

        // 通过type和flag筛选需要循环的广告并根据权重排序
        var currentAdList = newVal.filter(item => {
//        return item.type === this.data.type && item.flag === this.data.flag
//2018.12.14 新接入的bms2广告，没有type，不用管这个字段
						return (item.flag === this.data.flag)
						
        }).sort((item1, item2) => {
          return Number(item2.weight) - Number(item1.weight) 
        })
        
        for(var i = 0; i < currentAdList.length; i++) {
        	var a = currentAdList[i]
        	app.bmsAd.subMsg(a) // 展示元素时调用
        }
    },

//  // 开关
//  switch() {
//  	var that = this
//    const isOpen = !this.data.isOpen;
//    this.setData({ isOpen });
//    var list1 = that.data.list || []
//    var list2 = that.data.list2 || []
//    var all = list1.concat(list2)
//    
//    var len = all.length
//    //这里去设置定时器
//    if(isOpen) {
//    	that.setInter(len)
//    } else {
//    	that.clearTimer()
//    }
//    
//    //12.27新增，这里发送请求
//    if(isOpen) {
//    	for(var i = 0; i < len; i++) {
//						var a = all[i]		
////						//发送展示
//						app.bmsAd.subMsg(a) // 展示元素时调用
//				} 
//    }
//  },
    detached: function() {
    	var that = this
    	//组件移除时执行
    	that.clearTimer()
    },
    //开始定时器
    setInter(len) {
    	var that = this
    	var i = 0
    	that.clearTimer()
    	
    	log('-开启定时器-')
    	that.timer = setInterval(function() {
    		i++
    		if(i > len) {
    			i = 0
    		}
    		that.setData({
    			showIndex: i,
    		})
//  		log(i)
//  	}, 1000)
			}, 1500)
    },
    //关闭定时器
    clearTimer() {
    	var that = this
    	if(that.timer) {
    		log('-关闭定时器-')
    		clearInterval(that.timer)
    	}
    },
    
     openImg(e) {
	  	var that = this
	  	var target = e.currentTarget.dataset
	  	var msg = target.msg
	  	log('openImg1', target)
	  	log('openImg2', msg)
	  	//12.21点击发送，里面有处理为空的情况
      	app.bmsAd.subMsg(msg, true) // 点击元素时调用
      
      
	  	var img = msg.poster
	  	if(!img) {
	  		log('没有配置预览图片')
	  		return
	  	}
	  	var urls = []
	  	urls.push(img)
	  	//图片预览
      	swan.previewImage({
			  current: img, // 当前显示图片的http链接
			  urls: urls // 需要预览的图片http链接列表
			})
      
      
	  },
  },

};

Component(compObj);
