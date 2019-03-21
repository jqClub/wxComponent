//小程序版本
var app_ed = 1330;
var bms_ed = '1.3.3';
//统计的使用的是什么环境（默认不填为生产环境，true为测试环境）
var analysts = false
var trialData = false  //11.03新增_默认不显示打印的信息，否则显示出来

//域名
var domain 	= 'https://api.zuiqiangyingyu.net';

//测试域名
//var domain = 'https://t3api.zuiqiangyingyu.net';

//接入游戏的域名，用来获取广告和分享
var game_domain =  'https://game.zuiqiangyingyu.net'


var user_msg = {};
var log = console.log.bind(console)

import { api } from './utils/api.js'

var wcache = require("./utils/wcache.js") //引入缓存的机制

//引入请求数据
var wxRequest = require("./utils/wxRequest.js") //引入缓存的机制

//11.27新增配置信息
import { ajax } from './utils/wxRequest.js'   //引入ajax请求模块


////11.30新增bms统计
import WonderJsSdk from "./utils/analysts/WonderJsSdk.js";

////12.03新增统计的数据
var mta = require("./utils/mta_analysis.js");

var log = console.log.bind(console)
//import BmsAd from './utils/bms-ad.v2'

//11.08新增
var timeLoad 

App({
	data: {
		//设备信息
		getSystemInfo: {},
		//用户信息
		userInfo: {},
		//应用信息
		logmsg: {
			OPSTYLE: 'api',
			wechat_type: 'wechat_song',
//			bmsName: 'guess_song_baidu',
			appName: 'baiducaigedaren',
			app_ed: app_ed,
			bms_ed,
			domain: domain,
			appId: 14741167,
		},
		//域名
		domain: domain,
		//接口的地址
		API: api(domain, game_domain),
		//频率控制
		function_time: 0,
		frequency: 2,
		//方法错误次数
		ajax_num: {},
		//音频控件
//		innerAudioContext: '',

		//剩余的分享次数（默认给1，好去请求数据）
		share_times: 1,

		// 10.30测试参数
		//测试函数（如果为真的话，就显示测试的地方）
		trialData: trialData,
		addYnfu: 30,
		
		hrcpTime: 691200, //缓存的时间（8天）
		
		songInfo: {}, //11.5新增-设置进入歌曲的信息
		
		hasAccredit: false, //是否授权过
		
		//11.15新增，屏蔽的字段
		show_share: 1, //默认显示求助好友
		show_ad: 0, //默认不显示广告
		//11.15新增分享的剩余次数
		share_look_times: 1,
		
		//11.23新增，默认的头像
		defaultAvatar: 'https://static.zuiqiangyingyu.cn/admin/1811/caigebobo2018112301.png',
	},
	
	mta: mta,

	onLaunch: function(options) {
		var that = this;
		
//      //获取广告信息
//      const bmsAd = new BmsAd({
//	      appName: that.data.logmsg.appName,
//	      isDev: true,
//	    })
//	    this.bmsAd = bmsAd
		
//		//这是示例代码，应用的接入代码请到“应用管理”进行拷贝
		mta.App.init({
			"appID": "500511103",
			"eventID": "500512430",
			"statPullDownFresh": true,
			"statShareApp": true,
			"statReachBottom": true,
			"lauchOpts": options
		});
		
		//11.30新增，判断当前是否有登录百度app
		that.isLoginApp()
		
		// 获取屏幕宽度
		swan.getSystemInfo({
			success: function(res) {
				try {
					var let_getSystemInfo = res;
					let_getSystemInfo.system_str = let_getSystemInfo.system.indexOf('iOS') < 0 ? 'an' : 'ios';

					that.data.getSystemInfo = let_getSystemInfo;
					log('设备信息', that.data.getSystemInfo)
				} catch(e) {}
			}
		})
		
//		//		//11.30新增是否是新用户（注册函数）
//		//12.11修改，先判断下， 再去注册函数
//		if(that.saveNewUser.getNew) {
//			that.saveNewUser.getNew()
//		} else {
//			that.saveNewUser()
//			that.saveNewUser.getNew()
//		}

		//12.12修改，直接去获取是否 是新用户的缓存
		that.saveNewUserGet()
		
		//读取本地缓存
		try {
//			var user_msg = wcache.get('user_msg') || {}
//
//			console.log('getStorageInfo读取数据缓存', user_msg)
////
//			let let_time = that.gettimestamp();
//			if(let_time - user_msg.set_time > that.data.hrcpTime || !user_msg.set_time) {
//				console.log('缓存数据超过8天自动清除', user_msg.set_time)
//				return
//			}
//			
//			var user_id = user_msg.user_id
//			if(user_id) {
//				that.data.userInfo = user_msg;   //用户的信息
//				console.log("获取缓存成功")
//			}
			
			//12.03新增，获取本地的swan_id,防止后面需要取登录
			var swan_id = wcache.get('swan_id') || ''
			that.data.swan_id = swan_id
		} catch(e) {
			console.log('失败 ：getStorageInfo读取数据缓存')
		}

		//获取授权信息
		//12.03先判断有没有授权过
		if(that.data.loginApp) {
			that.getLoginData()
		}
		
////		//11.30新增_强制进行更新
//12.11去掉这个，防止卡
//		that.update()
	},
	onShow: function(options) {
		var that = this;
	},

	onHide: function(options) {
		var that = this;
	},
	////////////////////////////////////////////////////////////
	//常用接口
	//分享群，限定单日分享一次得一次奖励（這个接口是获取分享次数的）
	REWARD_SHARE: function(type, let_data, callback) {
		var that = this;
		swan.request({
			url: that.data.API.REWARD_SHARE,
			data: let_data,
			header: {
				'content-type': 'application/json'
			},
			success: function(res) {
				if(typeof(callback) == "function") {
					callback(res)
				}
			}
		})
	},
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//页面跳转 3
	bindViewTap_three: function(targe_id, data, type, targe_from) {
		var that = this;
		//频率控制
		if(that.gettimestamp() - that.data.function_time < that.data.frequency) {
			console.log('点太快了你');
			return
		}
		that.data.function_time = that.gettimestamp();
		
		//這里加上一个判断条件
		if(!targe_id) {
			that.showToastNew('请检查url地址')
		}

		var let_url = '../' + targe_id + '/' + targe_id;
		if(data) {
			let_url = let_url + data
		}
		switch(type) {
			case 'navigateTo':
				swan.navigateTo({
					url: let_url
				})
				break;
			case 'redirectTo':
				swan.redirectTo({
					url: let_url
				})
				break;
			case 'switchTab':
				swan.switchTab({
					url: let_url
				})
				break;
			case 'reLaunch':
				swan.reLaunch({
					url: let_url
				})
				break;
			case 'navigateBack':
				swan.navigateBack({
					delta: 1
				})
				break;
			default:
				swan.navigateTo({
					url: let_url
				})
				break;
		}
	},

	//获得时间戳
	gettimestamp: function() {
		var let_timestamp = Date.parse(new Date()) + '';
		let_timestamp = let_timestamp.substring(0, 10)
		return let_timestamp
	},
	

	//数组随机取值
	GetArrTarge: function(arr) {
		var index = Math.floor((Math.random() * arr.length));
		return arr[index]
	},

	log: function() {
		return console.log.bind(console)
	},
	//分享的图片
	shareTitleImg: function(type, battle_pk_Type) {
		var that = this
		type = type
		var lists = that.data.shareNew || {}
		var list = lists[type]
		//随机取一个值返回
		var result = that.GetArrTarge(list)
		return result
	},
	//合并2个数组的方法
	assignObject: function(obj1, obj2) {
		//es2015 Object.assign(): 注意目标对象自身也会改变。
		var obj
		if(Object.assign) {
			obj = Object.assign(obj1, obj2)
		} else {
			for(key in obj2) {
				obj1[key] = obj2[key]
			}
			obj = obj1
		}
		return obj
	},
	//	06.20针对报错给的提示信息
	showModalNew: function(content, title) {
		swan.showModal({
			title: title ? title : '错误提示',
			confirmText: '好的',
			showCancel: false,
			content: content,
			success: function(res) {}
		})
	},
	//分享语相关
	showToastNew: function(title, time) {
		//如果不存在,不去显示
		if(!title) {
			log('弹窗内容--', title)
			return
		}
		swan.showToast({
			title: title,
			icon: 'none',
			duration: time || 2000,
		})
	},
	//09.14新增异常情况处理
	dealUnusual : function(res, that) {
		var c = res.c
	//	log('----------', res, that)
		if(c != 0) {
			if(c == 4) {
				log('需要重新去登录-app')
				//09.14新增,处理需要登录的情况
				//需要重新登录,直接打开登录的按钮
				that.setData({
					initial_show: true
				})
			} else {
				if(res.m) {
					//其他报错,直接弹出来
					swan.showToast({
						title: res.m,
						icon: 'none',
						duration: 2000
					})
				}
				console.error(res)
			}
		}
	},
	//11.07判断是否有授权的信息
	getLoginData : function(page, fun) {
		var that = this
		swan.getSetting({
	         success: (res) => {
	            if(res.authSetting) {
			        if(res.authSetting['scope.userInfo']) {
			        	callBack(true)
			        } else {
			        	callBack()
			        }
			    } else {
			    	callBack()
			    }
	          },
	          fail: function() {
	          	callBack()
	         }
	   })
	
		  let callBack = function(bool) {
		 	that.data.hasAccredit = bool 
		 	//如果是函数，就去调用
		 	if(typeof fun == 'function') {
		 		fun(bool)
		 	}
		 	log('是否有授权信息--', bool)
		 }
	},
	
	//11.08新增一个loading的动效
	loading: {
		//显示loading
		show: function() {
			var self = this
			//12.14加上这个，可以减少定时器的个数，从而加快加载
			self.clearLoadingTime()
			
			//设置300ms后才显示，否则不显示  
			timeLoad = setTimeout(function() {
				swan.showLoading({
			        title: "请稍后..."
			     });
			}, 100) 
		},
		//隐藏提示框
		hide: function() {
			var self = this
//			if(timeLoad) {
//				clearTimeout(timeLoad)
//				timeLoad = null
//			}
			self.clearLoadingTime()
			
	    	swan.hideLoading();
		},
		clearLoadingTime: function() {
			var self = this
			if(timeLoad) {
				clearTimeout(timeLoad)
				timeLoad = null
			}
		},
	},
	
	/////////////////////////////////////////////
	/////////////////////////////////////////////
	//11.09新增统一的发送请求
	allGet : function(page, sData) {
		var that = this
		var result = {
			url: sData.url,
			data: sData.data,
		}
		log('发送的数据-', sData)
		wxRequest.ajaxNew(result).then(function(res) {
			log(`-接受的数据-: ${JSON.stringify(res)}`)
			if(res.c == '0') {
				if(typeof sData.callBack == 'function') {
					sData.callBack(res)
				}
			} else {
//				//09.14新增，去处理登录的信息
//				that.dealUnusual(res, page)
				//11.27新增处理
				if(typeof sData.failCallBack == 'function') {
					sData.failCallBack(res)
				}
			}
		})
	},
	/////////////////////////////////////////////
	/////////////////////////////////////////////
		//11.07因为在进入页面后，返回需要进入新的页面，所以需要清空options
	clearOptions: function() {
		var that = this
//		//11.5修改，去掉设置信息，再次进入的话，进入最新的歌曲(如果从其他页面返回，就去更新)
		that.data.songInfo.updateIndexl = true
		that.data.songInfo.type = ''
		that.data.songInfo.sid = ''
		//11.27新增，清空当前答题的通过关卡数量，防止进入的还是当前通关题（从地图进入）
		that.data.songInfo.pass = ''
	},
//	/////////////////////////////////////////////
//	/////////////////////////////////////////////
//	//11.27新增版本控制
//	//版本控制(BMS后台的数据)
//	getVerControl : function () {
//	  var that = this;
//	  var appName = that.data.logmsg.appName;
//	  var common = that.data.API.common
//		var version = that.data.logmsg.bms_ed;
//	  log(`版本控制号: ${version}`);
//	 
//	  return new Promise((resolve, reject) => {
//	    //发送ajax请求
//	    var result = {
//	      url: common.CONFIG_INFO, //请求的地址
//	      data: {
//	        app_name: appName,
//	        version: version,
//	      },
//	      contentType: "urlencoded"
//	    };
//	   
//	    //	log(`版本控制-数据: ${JSON.stringify(result)} `)
//	    ajax(result).then(function (res) {
//	      log(`版本控制-返回: ${JSON.stringify(res)}`);
//	      if (res.code == "0") {
//	      	var sData = res.data || {};
//	      	that.data.allControl = sData
//	      	resolve(sData)
//	      } else {
//	        console.error(res);
//	        reject(res)
//	      }
//	    });
//	  });
//	},
//
//	//版本控制（ip屏蔽）
//	 getIpControl: function (resolve) {
//	  var that = this;
//	  var appName = that.data.logmsg.appName;
//	  var common = that.data.API.common
//	  return new Promise((resolve, reject) => {
//	  //发送ajax请求
//	  var result = {
//	    url: common.IS_ENABLE, //请求的地址
//	    data: {
//	      app_name: appName
//	    },
//	    contentType: "urlencoded"
//	  };
//	 	 //	log(`ip控制-数据: ${JSON.stringify(result)} `)
//		  ajax(result).then(function (res) {
//		    if (res.code == "0") {
//		      //		log(`ip控制-返回: ${JSON.stringify(res)}`)
//		      //      0是广深的IP，1是其他地区的IP
//		      //		判断是0，就不显示，1的话，才显示出来
//		      //这里只获取ip屏蔽的
//		      	var sData = res.data || {};
//				that.data.ipControl = sData.is_enable || 0;
//				resolve(sData)
//		    } else {
//		      console.error(res);
//		      reject(res)
//		    }
//		  });
//	  })
//	},
//	//11.15新增，获取所有bms参数
//	bmsControl : function(fun) {
//		var that = this;
//		//11.15新增，同时屏蔽
//		var p1 = that.getVerControl()
//	    var p2 = that.getIpControl()
//		Promise.all([p1, p2]).then(function (results) {
//		    //then方法不会被执行
//		    console.log('bms后台控制返回ALL', results); 
////		    that.isShowControl(fun)
//		    
//		    that.commonControlEnter()
//		    
//		    if(typeof fun == 'function') {
//		   		fun()
//		   	}
//		}).catch(function (e){
//		    //catch方法将会被执行，输出结果为：2
//		    console.log(2);
//		});
//	},
//	//这里是配置的列表
//	controlAll: {
//		show_ad: {
//			all: 1,
//			no: 0,
//			ip: {
//				0: 0,
//				1: 1,
//			}
//		},
//		show_share: {
//			all: 0,
//			no: 1,
//			ip: {
//				0: 1,
//				1: 0,
//			}
//		},
//	},
//	//去循环遍历，所有的配置信息
//	commonControlEnter: function() {
//		var that = this
//		var allControl = that.data.allControl
//		//所有的对象
//		var controlBms = {}
//		
//		//循环遍历
//		for(var key in allControl) {
//			var value = allControl[key]
////			that.commonControl(key, value)
//			controlBms[key] = that.commonControl(key, value)
//		}
//		
//		that.data.controlBms = controlBms
//		log('-bms配置对应的是否显示-', that.data.controlBms)
//	},
//	//单独去设置不同的值
//	commonControl: function(key, value) {
//		var that = this
//		//	key: 后台控制的类型
//		var allControl = that.data.allControl
//		//获取ipControl的值
//		var ipControl = that.data.ipControl //ip屏蔽参数
//		//对应的配置信息（对象）
//		var controlAll = that.controlAll
//		var control = controlAll[key]
//		
//		var result = control['no'] //默认给no的值
//		if(value == 'ip') {
//			result = control[value][ipControl]
//		} else {
//			result = control[value]
//		}
////		log(key, result)
//		//去设置不同的值
////		that.data[key] = result
//		return result
//	},
	//11.29新增，打印函数
	showLogin: function(that, name, name1) {
		if(trialData) {
			var logE = JSON.stringify(name)
			if(name1) {
				logE += name1
			}
			that.setData({
				shareEmit: logE
			})
		}
	},
	///////////////////////////////////////////
	///////////////////////////////////////////
	//11.30新增，设置bms后台的统计数据
	setBms: function() {
		var that = this
		//12.12新增，这里做一个判断，如果有的话，就不用去请求了，防止多次请求，造成异常
		if(that.wondersdk) {
			return
		}
		
		var userInfo = that.data.userInfo || {}
		//12.03新增——游客模式下，没有这个值，所以只有是登录的账号
    	var openid = userInfo.openid || ''
		
		var pid = 4
		var appname = that.data.logmsg.appName
		var wondersdk = new WonderJsSdk(pid,appname,openid, analysts)
//		#用户打开小程序后调用，init函数只需执行一次，执行多次可能会造成数据统计异常
		wondersdk.init()
 		//这里挂到全局上面去
 		that.wondersdk = wondersdk	
	},
	
	
//	////////////////////////////////////////
//	//11.30新增统计的新用户的代码
//	saveNewUser: function() {
//		var that = this
//		var result = {
//			//10.19新增数据
//			saveNew: function(isNew) {
//				var self = this
//				
//				//11.15新增，再第二次登陆的时候，不去判断新用户
//				var is_new = that.data.is_new 
//				if(is_new == 'new') {
//					//不去做判断，因为第二次会清空这个缓存
//					return
//				}
//				
//	//			isNew是0的话,不用去发送请求了
//	//			如果是1的话,需要发送新用户的请求
//				//存新的名字，防止有影响
//				if(isNew == 1) {
//					//新用户，存本地
//					wcache.put('isNew', 'new', wcache.nextDayTime()) 
//					that.data.is_new = 'new'
//				} else if(isNew == 0) {
//					//旧用户，存本地,永久信息
//					wcache.put('isNew', 'old') 
//					that.data.is_new = 'old'
//				}
//				log('登陆获取的新旧用户判断', that.data.is_new)
//			},
//			getNew: function() {
//				var self = this
//				//获取本地数据,一天的缓存时间
//				var is_new = wcache.get('isNew')
//				that.data.is_new = is_new
//				log('本地的新旧用户判断', that.data.is_new)
//			},
//		}
//		that.saveNewUser = result
//	}, 
	//12.12修改，不用先去注册了
	saveNewUserGet: function() {
		var that = this
		//获取本地数据,一天的缓存时间
		var is_new = wcache.get('isNew')
		that.data.is_new = is_new
		log('本地的新旧用户判断', that.data.is_new)
	},
	
//	//11.30新增_更新的方法
//	//强制更新的方法
//	update : function() {
//		//09.17修改,先判断下，再去使用
//		if (!swan.canIUse('getUpdateManager')) {
//			return
//		}
//		//发布新版本有些用户还是老版的，提示一下更新就可以立马变新版
//		const updateManager = swan.getUpdateManager()
//		// 检测版本更新
//		updateManager.onUpdateReady(function () {
//			swan.showModal({
//				title: '更新提示',
//				content: '新版本已经准备好，是否重启应用？',
//				success: function (res) {
//					if (res.confirm) {
//						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
//						updateManager.applyUpdate()
//					}
//				}
//			})
//		});
//		updateManager.onCheckForUpdate(function (res) {
//			// 请求完新版本信息的回调
//			if (res.hasUpdate == false){
//					console.log("已更新到最新版")
//				}
//		});
//		updateManager.onUpdateFailed(function () {
//			// 新的版本下载失败
//		});
//	},

	//11.30新增， 失败请求中，弱网的处理函数
	reQequestFail: function(page, e) {
		var that = this
		//接口失败
		var errMsg = e.errMsg
		//弱网的处理
		var errCode =  e.errCode
		if(errCode == 1001) {
			//继续弹窗
			page.setData({network: true,})
		}
		if(errMsg) {
			that.showToastNew(errMsg)
		}
	},
	
	//11.30新增，判断用户是否登录过百度app
	isLoginApp: function() {
		var that = this
		var isLogin = false
		try {
		    var result = swan.isLoginSync() || {}
		    console.log('isLoginSync', result);
		    if(result.isLogin) {
		    	isLogin = true
		    }
		} catch (e) {
		    console.log('isLoginSync-error', e);
		}
		//判断是否登录过百度app
		that.data.loginApp = isLogin
	},
	
//	//10.23新增，如果成功，才发送请求
//	navigateToMiniProgram: function(appKey, path, extraData, callback) {
//		var that = this;
//		if(!appKey) {
//			log('没有appKey')
//			return 
//		}
//		swan.navigateToSmartProgram({
//		    appKey: appKey, // 要打开的小程序 App Key
//		    path: path || '', // 打开的页面路径，如果为空则打开首页
//		    extraData: extraData || {
//		    	
//		    },
//		    success: function (res) {
//		    	log('app小程序跳转成功')
//		        //如果是函数，就去调用 // 打开成功
//			 	if(typeof callback == 'function') {
//			 		callback()
//			 	}
//		    }
//		});
//	},
	navigateToMiniProgram(appKey, path, extraData, callback) {
   		var that = this
// 		//测试：在页面中，在可以拿到回调，再app.js里无法拿到回调信息
// 		app.navigateToMiniProgram('N220ccbtxFv72vsK84TzXiAvjIK4TIxW', '', {}, function() {
// 			app.logn('打开成功', {})
// 		})
   		swan.navigateToSmartProgram({
		    appKey: appKey, // 要打开的小程序 App Key
		    path: path, // 打开的页面路径，如果为空则打开首页
		    extraData: extraData || {
		    	source: 'baiducaigedaren'
		    },   //这里使用空的话，就不会进入success函数内
//		    envVersion: 'develop',  
		    success: function (res) {
//		    	that.logn('打开成功', {})
				log('-跳转小程序成功-')
		        //如果是函数，就去调用 // 打开成功
			 	if(typeof callback == 'function') {
			 		callback()
			 	}
		    }
		});	
    },
	//测试打印函数
	logn: function() {
		var num1 = arguments[0]
		var num2 = arguments[1]
		
		if(typeof num2 == 'object') {
			num2 = JSON.stringify(num2)
		}
		//	//测试打印信息
		swan.showModal({
			title: num1,
			confirmText: '好的',
			showCancel: false,
			content: num2,
			success: function(res) {}
		})
	},
})
