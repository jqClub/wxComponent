//小程序版本
var app_ed = 2000;
var bms_ed = '2.0.0';

//域名
var domain 	= 'https://api.zuiqiangyingyu.net';
var wss_domain= 'wss://wss.zuiqiangyingyu.net'
var wss_domain_god= 'wss://wss.zuiqiangyingyu.net'

//测试域名
//var domain = 'https://t1api.zuiqiangyingyu.net';
//var wss_domain= 'wss://wss.zuiqiangyingyu.net/test'
//var wss_domain_god= 'wss://wss.zuiqiangyingyu.net/test'

//测试用的域名
//var domain = 'http://t2api.zuiqiangyingyu.net';
//var wss_domain= 'wss://wss.zuiqiangyingyu.net'
//var wss_domain_god= 'wss://wss.zuiqiangyingyu.net'


//最原来的wss地址
////var wss_domain= 'wss://wss.zuiqiangyingyu.net'
////var wss_domain= 'ws://t1api.zuiqiangyingyu.net:8222'


//保存用户入群组  参数 user_id  code
//var QUERY_PK_GROUP		= 'https://api.zuiqiangyingyu.net/index.php/api/banma/wechat/query_pk_group';
// 登录斑马后台 Wechat_auth
var WECHAT_AUTH = domain + '/index.php/api/guess_v2/Wechat_auth';
//提交fromID
var SAVE_FORM_ID = domain + '/index.php/api/guess_v2/misc/Save_form_id';

var loginStatus = true;
var logMSG = {};
logMSG.wechat_type = 'wechat_song'; //成语研究所  6b92f49bce0c5802b935cad30317d4ca

var GROUPMSG = {};
var shareTicket_numb = 0;

var user_msg;
var log = console.log.bind(console)


var mta = require("./utils/mta_analysis.js");
var util = require("./utils/util.js");
import { api } from './utils/api.js'
//import { shareSuccess } from 'utils/share.js'
var obj_can = require("./utils/canIUse.js");
var isWx = require("./utils/isWx.js");   //关于微信授权的获取
var share_new = require("./utils/share_new.js");   //关于获取分享相关
var aboutTsjiChannle = require("./utils/aboutTsjiChannle.js");   //关于渠道统计来源

var wondeConfig = require("./utils/wondeConfig.js"); //07.18引入配置信息

var wcache = require("./utils/wcache.js") //引入缓存的机制
//本地缓存
var let_getStorageSync = {};

//app.js
var appParameter = {
	data: {
		group_id: "",
		shareTicket: '',
		options_scene: 0,
		//配置信息
		indexdl: '',
		//设备信息
		getSystemInfo: '',
		idiom_id: 0,
		//用户信息
		userInfo: '',
		//用户数据
		user_index: '',
		is_melogin: 0, //API
		//游戏状态
		game: {},
		//分享信息
		share_msg: '',
		//分享群组
		share_group: '',
		//pk配置信息
		pk_config: '',
		//活动信息
		push_activity: '',
		//抽奖活动配置
		activity_config: '',
		//小程序跳转信息
		recom_weapp: '',

		//应用信息
		logmsg: {
			OPSTYLE: 'api',
//			OPSTYLE: 't1api',
			wechat_type: 'wechat_song',
			bmsName: 'guess_song',
			appName: 'guess_song',
			mtaId: 'caigedarenhome',
			//渠道来源统计数据
			mtaChannle: 'caigedarenchannle',
			app_ed: app_ed,
			bms_ed,
			domain: domain,
			//09.14修改
			wss_domain,
			wss_domain_god,
////			wss_domain	:	'wss://wss.zuiqiangyingyu.net',
////    		wss_domain: 'ws://t1api.zuiqiangyingyu.net:8222',
//			wss_domain: 'wss://wss.zuiqiangyingyu.net',
//    		wss_domain_god: 'wss://wss.zuiqiangyingyu.net',
////			wss_domain: 'wss://wss.zuiqiangyingyu.net/test',
////    		wss_domain_god: 'wss://wss.zuiqiangyingyu.net/test',	
		},
		//域名
		domain: domain,
		//接口的地址
		API: api(domain),
		//重新登录次数
		loginerro_num: 0,
		//频率控制
		function_time: 0,
		frequency: 2,
		//方法错误次数
		ajax_num: {},
		//网页地址
		webview_data: '',
		//广告
		get_ad: '',
		//音频控件
		innerAudioContext: '',
		//页面对象
		pagetarge: '',
		//播放音频
		Audio: {},
		//数据库
		arena_config: {},
		WECHAT_AUTH: WECHAT_AUTH,
		//06.14处理版本兼容的问题
		obj_can: obj_can,

		//07.12新增分享语
		shareAllWord: share_new.shareAllWord(),
		//09.07新增
		funnelAll: {
			'caigepaiweisai': 1, 
			'mengmiangeshenl': 1, 
			'gedanchuangguan': 1,
			//09.19新增
			'tongzhizhongxin': 1,
			'lingyinfu': 1,
		},
		
		//09.13新增
		canPlay: true,
		
		//剩余的分享次数（默认给1，好去请求数据）
		share_times: 1,
		
		//11.12新增分享看答案的接口（默认给1，好去请求数据）
		skip_times: 1,
		
		////10.24运营新增,渠道来源的新用户,通过闯关关数的漏斗,用来存储已经发送过漏斗统计的LV等级
		//使用的键值对，即前面的是渠道，后面的lv数量
		hasSendFunnel: {},
		//10.25新增，渠道的来源对象（appid, source等）
		returnDataNew: {},
		
		//11.15新增，屏蔽的字段
		show_share: 1, //默认显示求助好友
		show_ad: 0, //默认不显示广告
		show_center: 0, //默认不显示福利中心
		show_tiaoguo: 0, //默认不显示跳过的功能
		
		//11.23新增，默认的头像
		defaultAvatar: 'https://static.zuiqiangyingyu.cn/admin/1811/caigebobo2018112301.png',
	},

	onLaunch: function(options) {
		var that = this;
		//07.23渠道来源统计
		that.data.optionsFrome = options

		//08.27强制进行更新
		that.update()
		
		//09.07新增是否是新用户（注册函数）
		that.saveNewUser()
//		wcache.put('isNewUser', 1, wcache.nextDayTime()) //说明是第二次
		that.saveNewUser.get()

		//不在这里去统计，因为这里统计的，还需要在页面中注册才可以打开
//		that.channle()
//		aboutTsjiChannle.channle({
//			page: that,
//			options: options,
//		})
		//这是示例代码，应用的接入代码请到“应用管理”进行拷贝
		mta.App.init({
			"appID": "500511103",
			"eventID": "500512430",
			"statPullDownFresh": true,
			"statShareApp": true,
			"statReachBottom": true,
			"lauchOpts": options
		});

		//读取本地缓存
		try {
//			console.log('getStorageSync user_id', wx.getStorageSync('user_id'), typeof(wx.getStorageSync('user_id')))
			
			var local_user_msg = wx.getStorageSync('user_msg') || {}
			local_user_msg = that.dealHead(local_user_msg)
			local_user_msg.nickName = local_user_msg.nickname
			let_getStorageSync.user_msg = local_user_msg
			
//			let_getStorageSync.user_msg = wx.getStorageSync('user_msg');
			let_getStorageSync.user_id = wx.getStorageSync('user_id');
			let_getStorageSync.socket_token = wx.getStorageSync('socket_token');
			

			//07.05新增，获取用户的open_id
			that.data.open_id = wx.getStorageSync('open_id');

//			console.log('getStorageInfo读取数据缓存', let_getStorageSync)

			let let_time = that.gettimestamp();
			if(let_time - let_getStorageSync.user_msg.set_time > 691200 || !let_getStorageSync.user_msg.set_time) {
				console.log('缓存数据超过8天自动清除', let_getStorageSync.user_msg.set_time)
				return
			}
			if(typeof(let_getStorageSync.user_id) == "string" && let_getStorageSync.user_id.length > 0) {
				user_msg = let_getStorageSync.user_msg;
				that.data.userInfo = user_msg;   //用户的信息
				console.log("获取缓存成功")
			}
		} catch(e) {
			console.log('失败 ：getStorageInfo读取数据缓存')
		}

		//缓存配置信息
		var indexdl = wx.getStorageSync('indexdl');
		that.data.indexdl = indexdl;

		//06.25修改设置背景音乐
		that.setBackgroundAudio()
		
		//		11.22优化_用来处理ios下静音情况下，无法播放出声音的问题
		if(wx.setInnerAudioOption) {
			wx.setInnerAudioOption({ obeyMuteSwitch: false});
		}
	},

	mta: mta,

	onShow: function(options) {
		var that = this;
//		console.log('onShow', options);

		//06.25修改设置背景音乐
		that.setBackgroundAudio()

		// 获取屏幕宽度
		wx.getSystemInfo({
			success: function(res) {
//				console.log('getSystemInfo', res);
				try {
					var let_getSystemInfo = res;
					let_getSystemInfo.SDKVersion_str = let_getSystemInfo.SDKVersion;
					let_getSystemInfo.SDKVersion = (let_getSystemInfo.SDKVersion).replace(/\./g, '') - 0;
					let_getSystemInfo.system_str = let_getSystemInfo.system.indexOf('iOS') < 0 ? 'an' : 'ios';

					let_getSystemInfo.app_ed = app_ed;

					//05.25新增将rpx转px的方法
					var rpxToPx
					if(res.screenWidth) {
						var getSystemInfoWidth = res.screenWidth
						rpxToPx = (getSystemInfoWidth / 750) //1px = xx rpx
					}
					let_getSystemInfo.rpxToPx = rpxToPx

					that.data.getSystemInfo = let_getSystemInfo;

				} catch(e) {}

			}
		})
	},

	onHide: function(options) {
		var that = this;
//		console.log('app onHide', options, that.data.game);

		//判断游戏状态
//		if(that.data.game.game_state != 3 && that.data.game.type == 'battle_pk') {
//			console.log('好友对战退出');
//			that.SendSocketMessage('', 'discard');
//		}
	},
	//06.25新增背景音乐
	setBackgroundAudio: function() {
		var that = this

		//设置背景播放器
		if(wx.getBackgroundAudioManager) {
			//获取播放器API
			if(!that.backgroundAudioManager) {
				that.backgroundAudioManager = wx.getBackgroundAudioManager();
			}
		}

		if(wx.createInnerAudioContext) {
			//获取播放器API
			if(!that.innerAudioContext) {
				that.innerAudioContext = wx.createInnerAudioContext();
			}
		}
	},
	//////////////////////////////////////////////////////////////////////////////
	//登录授权分流
	APP_USERLOGIN: function(callback, fail_fun) {
		var that = this;
		//10.19修改//获取群组ID 启动授权接口,這里不再去自动登录
		//因为现在微信无法获取群组ID，所以不去请求了
		return 
		
//		//		//小程序登录授权 - 登录
//		//		that.getPromission(callback);
//
//		//判断是否有 user_id 缓存  检查老用户 user_id 缓存是否正确
//		if(typeof(that.data.userInfo.token) == "string" && that.data.userInfo.token.length > 0) {
//			//			user_msg = let_getStorageSync.user_msg;
//			//			that.data.userInfo = user_msg;
//			//分享信息统计
//			//			that.STAT_SHARE();
//			//回调
//			if(callback) {
//				callback();
//			}
//		} else {
//			//小程序登录授权 - 登录
//			that.getPromission(callback, fail_fun);
//		}
	},

	//重新授权
	GET_GRANT_AGAIN: function(callback, fail_fun) {
		var that = this;
		//10.19修改//已经注释了页面所有调用的地方
		return
//		console.log('重新获取数据');
//		loginStatus = true;
//		//清空全局user_di
//		//		app.data.userInfo.user_id = '';
//		//小程序登录授权 - 登录
//		that.getPromission(callback, fail_fun);
	},

	//登录斑马英语
	Wechat_auth: function(callback) {
		var that = this;
		logMSG = that.songGod(logMSG)
		
		//发送授权信息 ，请求斑马登录后台登录
//		that.consoleExamine(WECHAT_AUTH, logMSG)//这个是判断请求的链接是否正确的，先去掉不显示
		log(`Wechat_auth-logMSG-2: ${JSON.stringify(logMSG)}`)
		wx.request({
			url: WECHAT_AUTH,
			data: logMSG,
			header: {
				'content-type': 'application/json'
			},
			success: function(res) {
				console.log('WECHAT_AUTH-logMSG-3', res, logMSG)
				console.log(`statusCode: ${res.statusCode}`)
				var statusCode = res.statusCode //返回的状态码
				//06.29修改(不是200，直接返回，并提示需要再次点击登录按钮)
				if(statusCode != 200) {
					that.Wechat_auth_retry(statusCode, res)
					return
				}

				if(res.data.c == '0') {
					//08.16新增，这里判断是否是新的用户(在aboutTsjiChannle函数里面)
					that.isAccreditNew(res)

					if(typeof(res.data.d.user.uid) == 'string' && res.data.d.user.uid > 0) {
						user_msg.user_id = res.data.d.user.uid;
						user_msg.token = res.data.d.user.token;
						user_msg.pass = res.data.d.user.pass;
						user_msg.score = res.data.d.user.score;

						//08.31新增，是否是首次登录
						user_msg.first_login = res.data.d.user.first_login;
						//登录时间
						user_msg.set_time = that.gettimestamp();

						//放入本地缓存
						wx.setStorage({
							key: "user_msg",
							data: user_msg
						})
						wx.setStorage({
							key: "token",
							data: user_msg.token
						})
						wx.setStorage({
							key: "user_id",
							data: user_msg.user_id
						})

						that.data.userInfo = user_msg;

						//07.05设置用户的openid
						that.setOpenId(res)

						wx.showToast({
							title: '登录成功',
							icon: 'success',
							duration: 1000
						})

						//回调
						if(typeof(callback) == "function") {
							callback(res);
							//获取活动信息
							//that.ACTIVITY_CONFIG();
						}
					} else {
						//06.29修改登录的信息
						that.Wechat_auth_retry(statusCode, res)
//						wx.showModal({
//							title: '登录错误',
//							cancelText: '玩点别的',
//							confirmText: '重新登录',
//							content: '缺少用户ID ' + res,
//							success: function(res) {
//								if(res.confirm) {
//									//重新登录
////									that.Wechat_auth(callback);
//									//06.29修改
//									that.data.loginerro_num = 0;
//								} else if(res.cancel) {
//									that.navigateToMiniProgram();
//								}
//							}
//						})
					}

				} else {
					//06.28修改：估计登录的问题是获取code太频繁了，导致原来数据解密失败。(处理登录的bug，不知道有没效果)
					//再次重试先
					that.Wechat_auth_retry(statusCode, res)
					//回调
//					if(that.data.loginerro_num < 3) {
//						that.getPromission();
//						wx.showToast({
//							title: '正在登录',
//							icon: 'loading',
//							duration: 1000
//						})
//						that.data.loginerro_num = that.data.loginerro_num - 0 + 1;
//					} else {
//						wx.showModal({
//							title: '登录错误',
//							showCancel: false,
//							cancelText: '玩点别的',
//							confirmText: '重新登录',
//							content: '状态码:' + statusCode + '-返回:' + res.data.m + '-登录错误号:' + res.data.c,
//							//						  content: '返回数据:'+res.data.m+'登录错误号码:'+res.data.c+'状态码:'+statusCode ,
//							//						  content: res.data.m + '登录错误号码:'+res.data.c+' - 请截图联系客服' ,
//							success: function(res) {
//								if(res.confirm) {
//									console.log('用户点击确定');
//									//重新登录
//									that.Wechat_auth(callback);
//									that.data.loginerro_num = 0;
//								} else if(res.cancel) {
//									//跳转小程序     else if(res.cancel) {}      cancelText:'玩点别的',
//									that.navigateToMiniProgram();
//									//							app.bindViewTap_three('index','','redirectTo',that.data.index)
//								}
//							}
//						})
//					}
				}

			},
			fail: function(res) {
				console.log('fail-WECHAT_AUTH', res);
				//提示
				wx.showToast({
					title: '登录失败',
					icon: 'loading',
					duration: 2000
				})
				//				wx.reportAnalytics('login_erro', {data:res,});
				//腾讯统计 - 错误报告
				that.mta.Event.stat('error', {
					'error': 'app/登录失败' + 'fail-WECHAT_AUTH' + JSON.stringify(res)
				})
			},
			complete: function(res) {
				//				console.log('complete WECHAT_AUTH', res)
			}
		})
	},
	Wechat_auth_retry: function(statusCode, res) {
		var that = this
		var content = `-返回: ${JSON.stringify(res)}`
		try{
			if(res) {
				if(res.data) {
					content = '-返回:' + res.data.m + '-登录错误号:' + res.data.c
				}
			}
		}catch(e){}
//		if(res.data) {
//			content = '-后台返回:' + res.data.m + '-登录错误号:' + res.data.c
//		} else {
//			content = `-后台返回: ${JSON.stringify(res)}`
//		}
		//去掉重试信息
		wx.showModal({
			title: '登录错误',
			showCancel: false,
			cancelText: '玩点别的',
			//07.09提交后修改，长度不能超过4个长度。之前超过了报错，会无法显示
//			confirmText: '请再次点击登录按钮，试试~',
			confirmText: '重新登录',
			content: '状态码:' + statusCode + content,
			success: function(res) {
				if(res.confirm) {
					console.log('用户点击确定');
					//重新登录（06.29去掉了重新登录请求，需要用户再次点击登录的按钮）
//					that.Wechat_auth(callback);
//					that.data.loginerro_num = 0;  //这个是判断次数，先去掉
				} else if(res.cancel) {
					//跳转小程序     else if(res.cancel) {}      cancelText:'玩点别的',
					that.navigateToMiniProgram();
					//							app.bindViewTap_three('index','','redirectTo',that.data.index)
				}
			}
		})
	},
	//小程序登录授权
//	getPromission: function(callback) {
	getPromission: function(callback ,failCall) {
		var that = this;
		//10.19修改，只有首页的一个地方，才会调用這个方法，其他地方不会调用（已注释）。
		
		//先查看是否有微信授权信息，如果没有就跳到登录的界面，如果有，先授权
		isWx.getWxUbqr({
			success: function() {
				//如果授权过,先去获得微信的授权信息
				var getAll = isWx.getUserInfo() //获得微信授权信息
				getAll.then(function(res) {
					log(`res: ${JSON.stringify(res)}`)
					that.getPromisSucces(res, callback)
				}).catch(function() {})
			},
			fail: function() {
				//回调，如果失败的话，先去再次去登录先
				if(typeof(failCall) == "function") {
					failCall();
				}
			}
		})
		return

//		if(!loginStatus) {
//			wx.openSetting({
//				success: function(data) {
//					if(data) {
//						if(data.authSetting["scope.userInfo"] == true) {
//							loginStatus = true;
//							wx.getUserInfo({
//								success: function(data) {
//									console.info("2成功获取用户返回数据");
//									console.info(data);
//
//									user_msg = data.userInfo;
//									logMSG.encryptedData = data.encryptedData;
//									logMSG.iv = data.iv;
//									logMSG.rawData = data.rawData;
//									logMSG.signature = data.signature;
//									that.Wechat_auth(callback);
//
//								},
//								fail: function() {
//									console.info("2授权失败返回数据");
//								}
//							});
//						}
//					}
//				},
//				fail: function() {
//					console.info("设置失败返回数据");
//				}
//			});
//		} else {
//			wx.login({
//				success: function(res) {
//					if(res.code) {
//						console.log('getPromission', res);
//						logMSG.code = res.code;
//						wx.getUserInfo({
//							success: function(data) {
//								console.info("1成功获取用户返回数据");
//								//								console.info(data);
//
//								user_msg = data.userInfo;
//								logMSG.encryptedData = data.encryptedData;
//								logMSG.iv = data.iv;
//								logMSG.rawData = data.rawData;
//								logMSG.signature = data.signature;
//								that.Wechat_auth(callback);
//
//							},
//							fail: function() {
//								console.info("用户没有授权过");
//								loginStatus = false;
//							}
//						});
//					}
//				},
//				fail: function() {
//					console.info("登录失败返回数据");
//				}
//			});
//		}
	},
	//06.25修改
	getPromisSucces: function(data ,callback) {
		var that = this
		user_msg = data.userInfo;
		logMSG.encryptedData = data.encryptedData;
		logMSG.iv = data.iv;
		logMSG.rawData = data.rawData;
		logMSG.signature = data.signature;

		logMSG.code = data.code
		that.Wechat_auth(callback);  //再去登录一遍
	},
	////////////////////////////////////////////////////////////
	//常用接口

	//小程序跳转信息
	RECOM_WEAPP: function(callback) {
		var that = this;
		wx.request({
			url: that.data.API.RECOM_WEAPP,
			data: {
				app_ed: app_ed,
			},
			header: {
				'content-type': 'application/json'
			},
			success: function(res) {
				console.log('RECOM_WEAPP', res)
				if(res.data.c == '0') {
					that.data.recom_weapp = res.data.d;
					if(typeof(callback) == 'function') {
						callback()
					}
				}
			}
		})
	},

	//对战配置
	PK_CONFIG: function(type, let_data, callback) {
		var that = this;
		var let_data = {
			wechat_type: logMSG.wechat_type,
			token: that.data.userInfo.token
		};
		wx.request({
			url: that.data.API.PK_CONFIG,
			data: let_data,
			header: {
				'content-type': 'application/json'
			},
			success: function(res) {
				that.data.pk_config = res.data.d;
				if(typeof(callback) == "function") {
					callback(res)
				}
			}
		})
	},

	//分享群，限定单日分享一次得一次奖励
	SHARE_GROUP: function(type, let_data, callback) {
		var that = this;
		wx.request({
			url: that.data.API.SHARE_GROUP,
			data: let_data,
			header: {
				'content-type': 'application/json'
			},
			success: function(res) {
				that.data.share_group = res.data.d;
				if(typeof(callback) == "function") {
					callback(res)
				}
			}
		})
	},

	//分享群，限定单日分享一次得一次奖励
	ARENA_SHARE: function(type, let_data, callback) {
		var that = this;
		wx.request({
			url: that.data.API.ARENA_SHARE,
			data: let_data,
			header: {
				'content-type': 'application/json'
			},
			success: function(res) {
				//				that.data.arena_share = res.data.d;
				if(typeof(callback) == "function") {
					callback(res)
				}
			}
		})
	},

	//分享群，限定单日分享一次得一次奖励
	REWARD_SHARE: function(type, let_data, callback) {
		var that = this;
		wx.request({
			url: that.data.API.REWARD_SHARE,
			data: let_data,
			header: {
				'content-type': 'application/json'
			},
			success: function(res) {
				//06.01修改如果是闯关模式，因为有动画，就不给提示信息了
				if(type != 'song') {
//					shareSuccess(res)
					share_new.shareSuccess(res)
				}
				//				that.data.arena_share = res.data.d;
				if(typeof(callback) == "function") {
					callback(res)
				}
			}
		})
	},

	//分享加分
	//	REWARD_SHARE : function( type , sid , data02 , callback ){
	//		var that = this;
	//		var let_data = {
	//			wechat_type		: logMSG.wechat_type,
	//			token 			: that.data.userInfo.token,
	//			uid 			: that.data.userInfo.user_id,
	//			type			: type,
	//			sid				: sid,
	//		}
	//		var let_data = Object.assign(let_data, data02);
	//		wx.request({
	//			url: that.data.API.REWARD_SHARE,
	//			data : let_data,
	//			header: {'content-type': 'application/json'},
	//			success: function(res) {
	//				console.log('SHARE',res)
	//				if(res.data.c == '0'){
	//					if( typeof(callback)=="function" ){callback(res)}
	//				}else{
	//					console.log( "错误 " + 'SHARE' + res.data.m , res , let_data );
	//					wx.showToast({
	//						title: res.data.m,
	//						icon: 'none',
	//						duration: 2000
	//					});
	//				}
	//			},
	//			fail: function(res) {
	//				console.log( "失败fail " + 'SHARE' , res , let_data );
	////				if( typeof(callback)=="function" ){callback(res)}
	//			}
	//		})
	//	},

	//查询当前活动：
	PUSH_ACTIVITY: function(act, act_code, callback) {
		var that = this;

		var let_data = {
			action: act,
			wechat_type: logMSG.wechat_type,
			token: that.data.userInfo.token
		};
		//决定是否加分
		if(act_code) {
			let_data.activity = act_code
		}
		wx.request({
			url: that.data.API.PUSH_ACTIVITY,
			data: let_data,
			header: {
				'content-type': 'application/json'
			},
			success: function(res) {
				console.log('PUSH_ACTIVITY', res)
				switch(res.data.c) {
					case '0':
						that.data.push_activity = res.data.d;
						break;
					default:
						console.log('PUSH_ACTIVITY 失败', res)
						break;
				}
				if(typeof(callback) == "function") {
					callback(res)
				}

			}
		})
	},

	//猜歌活动抽奖
	ACTIVITY_CONFIG: function(type, getApp) {
		var that = this;
		if(!getApp) {
			getApp = {
				data: {}
			}
		}
		getApp.data.token = that.data.userInfo.token ? that.data.userInfo.token : '';
		getApp.data.user_id = that.data.userInfo.user_id;
		getApp.data.app_ed = that.data.logmsg.app_ed;
		getApp.data.wechat_type = that.data.logmsg.wechat_type;
		wx.request({
			url: that.data.API.ACTIVITY_CONFIG,
			data: getApp.data,
			header: {
				'content-type': 'application/json'
			},
			success: function(res) {
				if(res.data.c == '0') {
					that.data.activity_config = res.data.d;
				}
				if(typeof(getApp.callback) == "function") {
					getApp.callback(res)
				}
			},
		})
	},

	//首页广告
	GET_AD: function(style, type, callback) {
		var that = this;
		that.appRequest({
			urls: that.data.API.GET_AD,
			data: {
				app: 'guess',
				position: type,
				app_ed: that.data.logmsg.app_ed,
				wechat_type: that.data.logmsg.wechat_type,
			},
			success: function(res) {
				console.log('GET_AD 进入', res)
				if(res.data.c == '0') {
					that.data.get_ad = res.data.d;
				}
				if(typeof(callback) == "function") {
					callback(res)
				}
			},
		})
	},

	//客服消息
	H_KF: function() {
		var that = this;
		wx.request({
			url: that.data.API.KF_MSG,
			data: {
				wechat_type: logMSG.wechat_type,
				token: that.data.userInfo.token
			},
			header: {
				'content-type': 'application/json'
			},
			success: function(res) {
				console.log('H_KF', res)
			}
		})
	},

	//提交fromID接口
	SAVE_FORM_ID: function(form_id) {
		var that = this;
		//缓存里的日期和数量
		var dayFormid = wx.getStorageSync('form_id');
		//		console.log('getStorageSync dayFormid',dayFormid);
		//今天日期
		var let_day = new Date();
		let_day = let_day.toDateString();
		//天数重置
		if(let_day != dayFormid.day) {
			//凌晨五点后才允许重置
			var let_date = new Date();
			var let_Hours = let_date.getHours();
			if(let_Hours < 5) {
				return
			}
			//重置FORM_ID缓存
			wx.setStorage({
				key: 'form_id',
				data: {
					day: let_day,
					form_num: 0,
					form_arr: {}
				}
			})
		}
		if(typeof(that.data.userInfo.user_id) == 'string' && that.data.userInfo.user_id.length > 0) {
			//如果是13位字符串则不发送
			form_id = form_id + '';
			//今天储存的FORMID超过26个就不存了
			if(dayFormid.form_num > 8) {
				return
			}
			var form_num;
			form_num = typeof(dayFormid.form_num) == "number" ? dayFormid.form_num + 1 : 1;
			var form_arr = dayFormid.form_arr ? dayFormid.form_arr : {};
			form_arr[form_num - 1] = form_id;
			wx.setStorage({
				key: 'form_id',
				data: {
					day: let_day,
					form_num: form_num,
					form_arr: form_arr
				}
			})
			that.data.form_num = form_num;
			var let_data = {
				user_id: that.data.userInfo.user_id,
				token: that.data.userInfo.token,
				scode: logMSG.wechat_type,
				fid: form_arr,
				app_ed: app_ed,
			}

			//第一条时候发一次
			if(form_num == 1) {
				//发送FORM_ID
				sendform_id();
			}

			if(dayFormid.form_num < 8) {
				return
			}
			if(!form_arr[5]) {
				return
			}
			if(form_id == 'the formId is a mock one') {
				return
			}
			//发送FORM_ID
			sendform_id();

		}

		function sendform_id() {
			console.log('正在发送 FORM_ID')
			//发起请求
			wx.request({
				url: that.data.API.FORM_ID,
				data: let_data,
				header: {
					'content-type': 'application/json'
				},
				success: function(res) {
					console.log('SAVE_FORM_ID', res);
					if(res.data.c == '0') {
						wx.setStorage({
							key: 'form_id',
							data: {
								day: let_day,
								form_num: form_num,
								form_arr: {}
							}
						})
					}
				},
				fail: function() {
					console.info("提交失败 SAVE_FORM_ID", '1');
				}
			})
		}
	},

	//查询微信后台订单
	QUERY_ORDER_PAY: function(oid, sid, callback) {
		var that = this;
		//https://api.zuiqiangyingyu.net/index.php/api/guess_v2/pay/query?token=06369e318fb51ee1532494cf81371fb1&wechat_type=wechat_song&oid=
		var let_data = {
			token: that.data.userInfo.token,
			oid: oid,
			sid: sid,
			wechat_type: that.data.logmsg.wechat_type,
		}
		wx.request({
			url: that.data.API.QUERY,
			data: let_data,
			header: {
				'content-type': 'application/json'
			},
			success: function(res) {
				console.log('QUERY', res);
				if(res.data.c == '0') {} else {
					console.log('app QUERY 接口错误', res);
					wx.reportAnalytics('pop_erro', {
						erro_name: 'QUERY_ORDER_PAY',
						erro_data: res
					});
				}
				if(typeof(callback) == "function") {
					callback(res)
				}
			},
			fail: function(res) {
				console.log('app QUERY 接口错误', res);
				wx.reportAnalytics('pop_erro', {
					erro_name: 'QUERY_ORDER_PAY',
					erro_data: res
				});
				if(typeof(callback) == "function") {
					callback(res)
				}
			}
		})
	},

	//接口入口
	appRequest: function(sendData) {
		var that = this;
		if(!sendData.data) {
			sendData.data = {}
		}
		//插入参数
		sendData.data.token = that.data.userInfo.token;
		sendData.data.app_ed = that.data.logmsg.app_ed;
		sendData.data.wechat_type = that.data.logmsg.wechat_type;
		//发起请求
		wx.request({
			url: sendData.urls,
			data: sendData.data,
			header: {
				'content-type': 'application/json'
			},
			success: function(res) {
				if(typeof(sendData.success) == "function") {
					sendData.success(res)
				}
				if(sendData.isregister && res.data.c == "0") {
					that.data[sendData.isregistername] = res.data.d;
				}
			},
			fail: function(res) {
				console.log('接口错误', res, sendData);
				if(typeof(sendData.fail) == "function") {
					sendData.fail(res)
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
	/// Socket
	////////////////////////////////////////

	//链接 Socket
	ConnectSocket: function(callback) {
		var that = this;
		//		that.setData({
		//			socketOpened	:	false,
		//			socketMsgQueue 	:	[],
		//		})
		that.data.socketOpened = false;
		wx.connectSocket({
			url: that.data.logmsg.wss_domain,
		  	success:function(res){
//		  		console.log('connectSocket -- ' , res )
		  	},
		  	fail:function(res){
//		  		console.log('fail -- ' , res )
		  	},
		})

		//连接成功
		wx.onSocketOpen(function(res) {
			console.log('WebSocket连接已打开！')
			//		  	console.log('pagetarge',that.data.pagetarge)
			that.data.socketOpened = true;
			//			that.setData({socketOpened	:	true,})
			//发送未发送的消息
			//			for (var i = 0; i < that.socketMsgQueue.length; i++){
			//   			that.SendSocketMessage(that.socketMsgQueue[i])
			//			}
			//	     	that.setData({socketMsgQueue:[]});

			//发送匹配消息
			//	     	var let_msg = {
			//		    	token	:	that.data.userInfo.token,
			//		    	cmd		:	'match',
			//	     	}
			//	     	that.SendSocketMessage(let_msg);

			if(typeof(callback) == "function") {
				callback()
			}

			//开始监听WebSocket关闭。
			//			wx.onSocketClose(function(res) {
			////				that.setData({socketOpened	:	false,})
			//				that.data.socketOpened = false;
			//			  	console.log('WebSocket 已关闭！')
			//			})
		})
	},

	//发送消息
	SendSocketMessage: function(msg, type) {
		var that = this;
		if(type) {
			msg = {
				token: that.data.userInfo.token,
				cmd: type,
			}
		}
		//向 socket 发送消息
		console.log('socket 发送 ----------- ' + msg.cmd, msg);
		var send_msg = JSON.stringify(msg);
		wx.sendSocketMessage({
			data: send_msg,
			fail: function(res) {
				console.log(res)
				//链接 connectSocket
				that.ConnectSocket(function() {
					that.SendSocketMessage(msg, type)
				});
			}
		});
  },

  // 张晓彬
	ConnectSocket2: function(callback) {
		var that = this;
		that.data.socketOpened = false;
		wx.connectSocket({
			url: that.data.logmsg.wss_domain_god,
		})
		wx.onSocketOpen(function(res) {
			console.log('WebSocket连接已打开！')
			that.data.socketOpened = true;
			if(typeof(callback) == "function") {
				callback()
			}
		})
  },


  // 张晓彬
  SendSocketMessage2: function (type, msg = {}) {
    console.log(type, msg);
    var that = this;
    const data = Object.assign(msg, {
      token: that.data.userInfo.token,
      cmd: type
    })
    //向 socket 发送消息
    console.log('socket 发送 ----------- ' + data.cmd, data);
    var send_msg = JSON.stringify(data);
    wx.sendSocketMessage({
      data: send_msg,
      fail: function (res) {
        console.log(res)
        //链接 connectSocket
        that.ConnectSocket2(function () {
          that.SendSocketMessage2(type, msg)
        });
      }
    });
  },


	// 关闭 WebSocket 连接。
	CloseSocket: function() {
		var that = this;
		//		if( that.data.socketOpened ){
		that.data.socketOpened = false;
		console.log('关闭 WebSocket 连接。')
		wx.closeSocket()
		//			that.setData({socketOpened	:	false,})
		//		}
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

	//播放音频
	playAudio: function(data) {
		var that = this;
		//		统一使用最新的播放接口,原来的不在维护了
//		that.innerAudioContext.autoplay = true;
//		//09.12新增修改------------------start
//		that.innerAudioContext.loop = data.loop || false;
//		that.innerAudioContext.src = data.urls;
//		log('-开始播放背景音乐-')
//		that.innerAudioContext.play()
//		//09.12新增修改------------------end
//		that.innerAudioContext.onPlay(() => {
//			console.log('开始播放')
//		})
//		log('播放', that.innerAudioContext, data, that.innerAudioContext.loop)
//		that.innerAudioContext.onError((res) => {
//			console.log(res.errMsg)
//			console.log(res.errCode)
//		})
//		return 
		//10.25新增，判断是否有音乐文件地址
		var src = data.urls
		if(!src) {
			log('playAudio-音频地址为空了')
			return
		}

		//09.18修改，改成原来的
		if(wx.createInnerAudioContext) {
			log('wx.createInnerAudioContext------------------1')
			that.innerAudioContext.autoplay = true;
			//09.12新增修改------------------start
			that.innerAudioContext.loop = data.loop || false;
			that.innerAudioContext.src = data.urls;
//			log('wx.createInnerAudioContext', '开始播放')
			that.innerAudioContext.play()
			//09.12新增修改------------------end
//			that.innerAudioContext.onPlay(() => {
//				console.log('开始播放')
//			})
//			log('播放', that.innerAudioContext, data, that.innerAudioContext.loop)
//			that.innerAudioContext.onError((res) => {
//				console.log(res.errMsg)
//				console.log(res.errCode)
//			})
		} else {
			log('wx.playVoice------------------2')
			wx.playVoice({
				filePath: data.urls,
				complete: function() {}
			})
		}		
//		log(1111111, that.innerAudioContext)
	},

	//停止音频
	stopAudio: function() {
		var that = this;
//		统一使用最新的播放接口,原来的不在维护了
//		that.innerAudioContext.stop();
//		return 	
		
		//09.18修改，改成原来的
		if(wx.createInnerAudioContext) {
			log('-停止播放背景音乐-1')	
			that.innerAudioContext.stop();
		} else {
			log('-停止播放背景音乐-2')	
			wx.stopVoice();
		}
	},
	//09.18新增暂停的函数
	pauseSound : function() {
		var that = this;
		if(wx.createInnerAudioContext) {
			log('-暂停播放背景音乐-1')	
			that.innerAudioContext.pause();
		} else {
			log('-暂停播放背景音乐-2')	
			wx.pauseVoice()
		}
	},

	//播放背景音频
	playBgAudio: function(type, data) {
		var that = this;
		//09.12修改如果没有链接的话，直接返回
		if(!data.urls) {
			log('playBgAudio-音频地址为空了')
			return
		}
		
		//09.14新增，在這里去设置先暂停所有的播放，防止重复出现声音
		that.stopAudio()
		
		//06.25新增处理报警群里的bug
		try {
			that.data.Audio = data;
//			that.backgroundAudioManager.title = '猜歌达人';
//			that.backgroundAudioManager.epname = '猜歌达人';
//			that.backgroundAudioManager.singer = '喵鹰鹰';
//			that.backgroundAudioManager.src = data.urls;
//			that.backgroundAudioManager.play();
////----------------------------------------------------------
//			//09.12新增，打开播放的效果
//			that.backgroundAudioManager.onPlay(function(){
//				log('播放---app.js')
//				if( typeof(data.onPlay) == 'function' ){ data.onPlay()}
//			});
//			that.backgroundAudioManager.onPause(function(){
//				log('暂停---app.js')
//				if( typeof(data.onPause) == 'function' ){ data.onPause()}
//			});
////----------------------------------------------------------
//			that.backgroundAudioManager.onEnded(function(){
//				log('播放结束---app.js')
//				if( typeof(data.onEnded) == 'function' ){ data.onEnded()}
//			});
//			that.backgroundAudioManager.onError = function(res) {
//				subError(res)
//			};
			
			//09.18新增修改，改成原来的接口
			if(wx.backgroundAudioManager) {
				log('wx.backgroundAudioManager')
				try {
					that.backgroundAudioManager.title = '猜歌达人';
					that.backgroundAudioManager.epname = '猜歌达人';
					that.backgroundAudioManager.singer = '喵鹰鹰';
					that.backgroundAudioManager.src = data.urls;
					that.backgroundAudioManager.play();
//----------------------------------------------------------
					//09.12新增，打开播放的效果
					that.backgroundAudioManager.onPlay(function(){
						log('播放---app.js')
						if( typeof(data.onPlay) == 'function' ){ data.onPlay()}
					});
					that.backgroundAudioManager.onPause(function(){
						log('暂停---app.js')
						if( typeof(data.onPause) == 'function' ){ data.onPause()}
					});
//----------------------------------------------------------
					that.backgroundAudioManager.onEnded(function(){
						log('播放结束---app.js')
						if( typeof(data.onEnded) == 'function' ){ data.onEnded()}
					});
					that.backgroundAudioManager.onError = function(res) {
						subError(res)
					};
				} catch(err) {
					that.showModalNew(err.message)
				}
			} else {
				log('wx.playBackgroundAudio')
				try {
					wx.playBackgroundAudio({
						dataUrl: data.urls,
						title: '猜歌达人',
						success: function(e) {
							if(typeof(data.onPlay) == 'function') {
								data.onPlay()
							}
						},
						fail: function(e) {}
					})
				} catch(err) {
					that.showModalNew(err.message)
				}
			}

			//提交错误报告
			function subError(res) {
				if(typeof(data.onError) == 'function') {
					data.onError()
				}
				that.appRequest({
					urls: that.data.API.LOG,
					data: {
						msg: {
							type: 'playBgAudio',
//							sid: that.data.Audio.sid,
							msg: JSON.stringify(res),
						}
					}
				})
				//腾讯统计
				that.mta.Event.stat('audioErro', {
//					sid: that.data.Audio.sid
				})
			}
		} catch(err) {
			that.showModalNew(err.message)
		}
	},

	//停止背景音频
	stopBgAudio: function(type, urls) {
		var that = this;
		//09.12新增修改，V1.2不在维护下面的接口
//		that.backgroundAudioManager.stop();

		//09.18新增修改，改成原来的接口
		if (wx.backgroundAudioManager){
			that.backgroundAudioManager.stop();
		}else{
			wx.stopBackgroundAudio()
		}
	},

	//获得群组信息
	getShareInfo: function(type, shareTic, let_data, callback) {
		var that = this;
		wx.login({
			success: function(res) {
				if(res.code) {
					let_data.code = res.code;
					wx.getShareInfo({
						shareTicket: shareTic,
						complete(res) {
							let_data.encryptedData = res.encryptedData;
							let_data.iv = res.iv;
							let_data.rawData = res.rawData;
							let_data.signature = res.signature;
							let_data.token = that.data.userInfo.token;
							if(typeof(callback) == "function") {
								callback(let_data)
							}
						}
					})
				} else {}
			}
		});
	},

	//获得用户加密信息
	getUserInfo: function(subData) {
		var that = this;
		if(!subData.data) {
			subData.data = {}
		}
		//06.29新增，处理获取到授权信息后的操作
		var getUserInfo = isWx.getUserInfo()
		getUserInfo.then(function(res) {
			log(`getUserInfo-logMSG: ${JSON.stringify(logMSG)}`)
			that.getUbqrLast(subData ,res)  //获取数据后的操作
		}).catch(function(res) {
			log('用户拒绝了授权', res)
		})
//      原来的代码
//		wx.login({
//			success: function(res) {
//				if(res.code) {
//					subData.data.code = res.code;
//					wx.getUserInfo({
//						withCredentials: true,
//						success: function(res) {
//							subData.data.encryptedData = res.encryptedData;
//							subData.data.iv = res.iv;
//							subData.data.rawData = res.rawData;
//							subData.data.signature = res.signature;
//							subData.data.token = that.data.userInfo.token;
//							switch(subData.type) {
//								case 'login':
//									logMSG = subData.data;
//									log(`getUserInfo-success-logMSG: ${JSON.stringify(logMSG)}`)
//									user_msg = JSON.parse(res.rawData);
//									that.Wechat_auth(function() {
//										if(typeof(subData.success) == "function") {
//											subData.success(subData.data)
//										}
//									})
//									break;
//								default:
//									if(typeof(subData.success) == "function") {
//										subData.success(subData.data)
//									}
//									break;
//							}
//
//						}
//					})
//				} else {}
//			}
//		});
	},
	//06.92新增：获取授权信息后的操作
	getUbqrLast: function(subData, res) {
		var that = this
		subData.data.code = res.code;
		subData.data.encryptedData = res.encryptedData;
		subData.data.iv = res.iv;
		subData.data.rawData = res.rawData;
		subData.data.signature = res.signature;
		subData.data.token = that.data.userInfo.token;
		switch(subData.type) {
			case 'login':
				logMSG = subData.data;
				log(`getUserInfo-success-logMSG: ${JSON.stringify(logMSG)}`)
				user_msg = JSON.parse(res.rawData)
				that.Wechat_auth(function() {
					if(typeof(subData.success) == "function") {
						subData.success(subData.data)
					}
				})
				break;
			default:
				if(typeof(subData.success) == "function") {
					subData.success(subData.data)
				}
				break;
		}
	},

	MillisecondToDate: function(msd) {
		var time = parseFloat(msd) / 1000;
		if(null != time && "" != time) {
			if(time > 60 && time < 60 * 60) {
				time = parseInt(time / 60.0) + "'" + parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60) + '"';
			} else {
				time = parseInt(time) + '"';
			}
		} else {
			time = '0"';
		}
		return time;
	},

	MillisecondToDate02: function(msd) {
		var time = parseFloat(msd) / 1000;
		if(null != time && "" != time) {
			if(time > 60 && time < 60 * 60) {
				time = parseInt(time / 60.0) + "'" + parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60) + '"';
			} else {
				time = parseInt(time) + '"';
			}
		} else {
			time = '0"';
		}
		return time;
	},
	//打印检查
	consoleExamine: function(url, data) {
		let that = this,
			text = '';

		if(url && data) {
			text = url + '?';
			for(var i in data) {
				text += i + '=' + data[i] + '&'
			}
		} else {
			console.info('信息不完整')
		}

		return text
	},

	//小程序导航
//	navigateToMiniProgram: function(appid, path, data, envVersion) {
	//10.23新增，如果成功，才发送请求
	navigateToMiniProgram: function(appid, path, data, envVersion, callBack) {
		var that = this;
		appid = appid ? appid : 'wxf2a06e4b30d4ad83';
		console.log("准备进入小程序", appid, path, data)
		//10.23新增先判断下版本，然后再去执行下面的方法，不执行下面的方法
		if(that.data.obj_can.comparison207) {
			//如果是支持navigateToMiniProgram方法,就使用新的
			return
		}				

		if(wx.navigateToMiniProgram) {
			try {
				wx.navigateToMiniProgram({
					appId: appid,
					path: path ? path : 'pages/index/index',
					extraData: data ? data : {
						foo: 'bar'
					},
					envVersion: envVersion || 'develop',
					success(res) {
						if(typeof callBack == 'function') {
							callBack()
						}
						
//						console.log('跳转小程序')
//						//腾讯统计
//						that.mta.Event.stat('click', {
//							'page': '进入小程序'
//						});
//						//腾讯统计
//						that.mta.Event.stat('Ad_' + appid, {
//							'click': 1
//						});
					},
				})
			} catch(e) {}
		} else {
			wx.showModal({
				title: '鸭鸭提示',
				showCancel: false,
				confirmText: '好的',
				content: '微信版本过低不支持该功能，请更新后体验',
				success: function(res) {
					if(res.confirm) {} else if(res.cancel) {}
				}
			})
		}
	},
	//页面跳转 3
	bindViewTap_three: function(targe_id, data, type, targe_from) {
		var that = this;
		//频率控制
		if(that.gettimestamp() - that.data.function_time < that.data.frequency) {
			console.log('点太快了你');
			return
		}
		that.data.function_time = that.gettimestamp();

		var let_url = '../' + targe_id + '/' + targe_id;
		if(data) {
			let_url = let_url + data
		}
		switch(type) {
			case 'navigateTo':
				//				console.log('navigateTo')
				wx.navigateTo({
					url: let_url
				})
				break;
			case 'redirectTo':
				//				console.log('redirectTo')
				wx.redirectTo({
					url: let_url
				})
				break;
			case 'switchTab':
				//				console.log('switchTab')
				wx.switchTab({
					url: let_url
				})
				break;
			case 'reLaunch':
				//				console.log('reLaunch')
				wx.reLaunch({
					url: let_url
				})
				break;
			case 'navigateBack':
				//				console.log('navigateBack')
				wx.navigateBack({
					delta: 1
				})
				break;
			default:
				//				console.log('default')
				wx.navigateTo({
					url: let_url
				})
				break;
		}
		//腾讯统计
		that.mta.Event.stat(targe_from + '_to_' + targe_id, {})
		console.log(targe_from + '_to_' + targe_id, let_url)
	},

	//获得时间戳
	gettimestamp: function() {
		var let_timestamp = Date.parse(new Date()) + '';
		let_timestamp = let_timestamp.substring(0, 10)
		return let_timestamp
	},
	//时间戳转成日期
	timestampToTime: function(timestamp) {
		var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
		var Y = date.getFullYear() + '-';
		var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
		//      var D = date.getDate();
		//      D = date.getDate() + ' ';
		//      h = date.getHours() + ':';
		//      m = date.getMinutes() + ':';
		//      s = date.getSeconds();
		return Y + M + D;
	},

	//数组随机取值
	GetArrTarge: function(arr) {
		var index = Math.floor((Math.random() * arr.length));
		return arr[index]
	},

	//产生随机数
	GetRandomNum: function(Min, Max) {
		var Range = Max - Min;
		var Rand = Math.random();
		return(Min + Math.round(Rand * Range));
	},

	///相册重新授权
	getSetting: function() {
		var that = this;
		// 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
		wx.getSetting({
			success: function success(res) {
				console.log(res.authSetting);
				var authSetting = res.authSetting;
				console.log(util)
				if(util.isEmptyObject(authSetting)) {
					console.log('首次授权');
					wx.authorize({
						scope: 'scope.writePhotosAlbum',
						success() {
							//用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
							console.log('首次授权成功');
						}
					})
				} else {
					console.log('不是第一次授权', authSetting);
					// 没有授权的提醒
					wx.openSetting({
						success: function success(res) {
							console.log('openSetting success', res.authSetting);
						}
					});
				}
			}
		});
	},
	log: function() {
		return console.log.bind(console)
	},
	logN: function() {
		var logN = function(strName, str, type) {
			//strName: 传参的名字，str： 传过来的参数，type： 是否显示类型
			var log = console.log.bind(console)
			var result = ""
			if(type) {
				result = `参数的类型 : ${typeof(str)}---`
			}
			if(typeof str == "object") {
				result += `${strName}: ${JSON.stringify(str, null, 4)}`
			} else {
				result += `${strName}: ${str}`
			}
			log(result)
			return result
		}
		return logN
	},
	shareTitleImg: function(pageType, battle_pk_Type) {
		//battle_pk_Type 页面的类型
		var that = this
		//这里返回的是一个对象，所以需要再次返回
		var result = share_new.shareTitleImg(that, pageType, battle_pk_Type)
		return result
	},
	//腾讯统计(分享的统计)
	mtaShare: function(index) {
		var that = this
		var result = 'share'
		for(var i = 0; i < arguments.length; i++) {
			var a = arguments[i]
			if(a) {
				result += ('_' + arguments[i])
			}
		}
		console.log(`result: (${result})`)
		//腾讯统计
		//		that.mta.Event.stat('share_'+result,{} )
		that.mta.Event.stat(result, {})
	},
	//接口错误的返回方式
	returnError: 　 function(res) {
		if(res.data.m) {
			wx.showToast({
				title: res.data.m,
				icon: 'none',
				duration: 1000
			})
		}
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
		wx.showModal({
			title: title ? title : '错误提示',
			confirmText: '好的',
			showCancel: false,
			content: content,
			success: function(res) {}
		})
	},
	//07.05设置用户的openid
	setOpenId: function(res) {
		var that = this
		var open_id = res.data.d.user.open_id
		wx.setStorage({
			key: "open_id",
			data: open_id
		})
		//07.05新增，加上openid
		that.data.open_id = open_id//获取用户的
	},
	
	//分享语相关
	showToastNew: function(title) {
		//如果不存在,不去显示
		if(!title) {
			log('弹窗内容--', title)
			return
		}
		wx.showToast({  
			title: title,  
			icon: 'none',  
			duration: 2000  
		})
	},
}
Object.assign(appParameter, aboutTsjiChannle, wondeConfig)

//配置文件
App(appParameter)
