var log = console.log.bind(console)

var loginNew = require("../../utils/loginNew.js");   //关于微信授权的获取

 //10.15新增缓存内容
var isWx = require("../../utils/isWx.js") 


//获取应用实例
var app = getApp()
// components/component-tag-name.js
Component({
	  properties: {
	
	  },
	
	  data: {
	
	  },
	
  methods: {
  	//隐藏弹框
	    hideDialog(){
	    	var that = this
	      //在页面中去设置关闭的功能
	      that.triggerEvent('closelogin')
	    },
			//授权登录操作
			bindGetUserInfo: function(e) {
					var that = this ;
					log('授权登录操作', e)	
//				//11.16修改，这里是获取授权登录的操作
					var detail = e.detail || {}  //这里可以直接获取用户的信息
					var userInfo = detail.userInfo
					//如果有，说明成功了
					if(userInfo) {
						//说明获取成功了(因为还需要获取code，所以先去拿code值)
						isWx.wxLogin().then(function(res) {
								var code = res.code
								
								var callback = function() {
									//进行回调
									that.triggerEvent('login', res, )
								}
//								//11.19修改，去设置code的值
								detail.code = code
								
								loginNew.Wechat_auth(callback, detail)
						}).catch(function() {})
					}

//				//原来的授权登录逻辑		
//			    app.getUserInfo({
//			    	type:'login',
//			    	success : function( res ){
//							that.triggerEvent('login', res, )
//			    	},
//			    	fail: function(res) {
//			    		log('登录页面', res)
//			    	}
//			    })
			},
  }
  
  
})
