//版本控制和ip控制
var log = console.log.bind(console)
var util = require("./util.js");


//存放一些公用的函数
//接入游戏的域名，用来获取广告和分享
var game_domain =  'https://game.zuiqiangyingyu.net'

var apiAll = {
	//获取广告的接口
	game_ads: {
		//获取游戏广告的接口
		getAds: game_domain + '/common/game/ads',
		//展示广告位的接口
		showAd: game_domain + '/statistics/ad/show',
		//点击广告位的接口
		clickAd: game_domain + '/statistics/ad/hit',
	},
//	//获取分享语的接口
//	share_words: {
//		//获取游戏分享的接口
//		shareList: game_domain + '/common/game/share_list',
//		//展示分享语的接口
//		showWord: game_domain + '/statistics/share/show',
//		//点击广告位的接口
//		clickWord: game_domain + '/statistics/login_log',
//	},
	//BMS公用接口
	common : {
		//	获取配置（审核的时候屏蔽）
		CONFIG_INFO : game_domain + '/common/config/info',
		//	IP 屏蔽
		IS_ENABLE : game_domain + '/common/ip/is_enable',
	},
	//08.29新增歌单
//	series: {
//		//banner列表接口
//		seriesBanner: '/index.php/api/guess_v2/series/v2/Banner',
//		//歌单专题列表接口
//		seriesList: '/index.php/api/guess_v2/series/v2/Series_list',
//		
//		//08.29新增 用户配置
//		USER_INFO: '/index.php/api/guess_v2/User_info',
//	}

	//09.18修改
	//banner列表接口
	seriesBanner: '/index.php/api/guess_v2/series/v2/Banner',
	//歌单专题列表接口
	seriesList: '/index.php/api/guess_v2/series/v2/Series_list',
	
	//08.29新增 用户配置
	USER_INFO: '/index.php/api/guess_v2/User_info',
//	---------------------------------------
	//09.18新增
//	首页弹窗
	Index_popup: '/index.php/api/guess_v2/Index_popup',
//	首页弹窗点击
	Index_popup_click: '/index.php/api/guess_v2/Index_popup_click',
//	通知中心
	Notice_index: '/index.php/api/guess_v2/Notice_index',
//	通知点击
	Notice_click: '/index.php/api/guess_v2/Notice_click',
//	未读通知数目
	Get_notice_unread: '/index.php/api/guess_v2/Get_notice_unread',
}


//更新的方法
//强制更新的方法
var update = function() {
	//09.17修改,防止报错
	if(util._typeof(wx.getUpdateManager) != 'object') {
		return
	}
	
	//发布新版本有些用户还是老版的，提示一下更新就可以立马变新版
	const updateManager = wx.getUpdateManager()
	// 检测版本更新
	updateManager.onUpdateReady(function () {
		wx.showModal({
			title: '更新提示',
			content: '新版本已经准备好，是否重启应用？',
			success: function (res) {
				if (res.confirm) {
					// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
					updateManager.applyUpdate()
				}
			}
		})
	});
	updateManager.onCheckForUpdate(function (res) {
		// 请求完新版本信息的回调
		if (res.hasUpdate == false){
				console.log("已更新到最新版")
			}
	});
	updateManager.onUpdateFailed(function () {
		// 新的版本下载失败
	});
}

//08.31蒙面歌神,发送参数
var songGod = function(obj) {
	var that = this
	var options = that.data.optionsFrome || {}
	var query = options.query
	//加上新的参数
	if(query.mask_uid) {
		obj.mask_uid = query.mask_uid
	}
	
	
	log('songGod传递的参数', options)
	//10.10新增，如果是好友对战进入的，传source=p2p
	var type = query.type
	if(type == 'battle_pk') {
		//加上新的参数
		obj.source = 'p2p'
	}
	
	return obj
}


	
	//////////////////////////////////////////////
//var navigateToMiniProgram : function( subData ){
//		var that = this;
////		/		console.log("准备("准备进入小程序",序",subData.appid,sub,id,subData.path,sub,th,subData.data)
////)
////		/		console.log( su( g( subData.e.target.dataset )
//	 )
//		try{
//			//腾讯统计
//						that.mta.Event.stat( su( t( subData.e.target.dataset.record ,{} ,{});
//		}catch(e){}
//		
//		if( !( !subData.appid ){  ){ ){ console.log('没有('没有appid'); return false }
//		
//		
//		try{
//						subData.data = O =  = Object.assign( su( n( subData.extraData , t ,  , that.LOGMSG );
// );
//		}catch(e){}
//		try{
//						subData.data = O =  = Object.assign( su( n( subData.data , t ,  , that.LOGMSG );
// );
//		}catch(e){}
//		
////		/		console.log(sub(og(subData.data)
//		)
//		
//		//旧版本兼容方法 
//		if( f( wx.navigateToMinoMiniProgram ){
//			try{
//				wx.navigateToMinoMiniProgram({
//					appId			: 	: subData.appid ,
//	 ,
//					path			: 	: subData.path ? s ?  ? subData.path : ' : 'pages/index/index',
//					extraData		: 	: subData.data ? s ?  ? subData.data : { : {foo: 'bar'},
//					envVersion		: 	: that.LOGMSG.version ? t ?  ? that.LOGMSG.version : ' : 'release',
//					success(res) {  { console.log('跳转('跳转小程序') }
//				})
//			}catch(e){}
//		}else{}
//	}


//09.14新增异常情况处理
var dealUnusual = function(res, that) {
	var c = res.c
//	log('----------', res, that)
	if(c != 0) {
		if(c == 4) {
			log('需要重新去登录')
			//09.14新增,处理需要登录的情况
			//需要重新登录,直接打开登录的按钮
			that.setData({
				initial_show: true
			})
		} else {
			//其他报错,直接弹出来
			wx.showToast({
				title: res.m,
				icon: 'none',
				duration: 2000
			})
			console.error(res)
		}
//		return false
	}
//	return true
}

//-------------------
//09.18新增跳转的测试数据
var configData = [
{
                    "id":"10000",    
                    "name":"上海熹微网络科技有限公司",
                    "description":"上海熹微网络科技有限公司\n021-68097651  沪ICP备16025177号-9\n021-68097651  沪ICP备16025177号-9",
                    "image":"https://static.zuiqiangyingyu.cn/admin/1808/0824img_home_card3.png",
                    "jump_type": 0,
//                  "跳转类型：0无跳转、1外部小程序、2URL链接、3入闯关模式、4排位赛主页、5蒙面歌神主页、6歌单闯关主页、7任务中心主页"
                    "appid":"wx95e1fd309fd2d844",
                    "path":"pages/index/index",
                    "url":"https://91haoka.com/webapp/dingxin/in/liubang.html?source=caigedaren"                    
      },
		{
                    "id":"10001",    
                    "name":"上海熹微网络科技有限公司",
                    "description":"上海熹微网络科技有限公司\n021-68097651  沪ICP备16025177号-9\n021-68097651  沪ICP备16025177号-9",
                    "image":"https://static.zuiqiangyingyu.cn/admin/1808/0824img_home_card3.png",
                    "jump_type": 1,
//                  "跳转类型：0无跳转、1外部小程序、2URL链接、3入闯关模式、4排位赛主页、5蒙面歌神主页、6歌单闯关主页、7任务中心主页"
                    "appid":"wx95e1fd309fd2d844",
                    "path":"pages/index/index",
                    "url":""                    
     },
      {
                    "id":"10002",    
                    "name":"上海熹微网络科技有限公司",
                    "description":"上海熹微网络科技有限公司\n021-68097651  沪ICP备16025177号-9\n021-68097651  沪ICP备16025177号-9",
                    "image":"https://static.zuiqiangyingyu.cn/admin/1808/0824img_home_card3.png",
                    "jump_type": 2,
//                  "跳转类型：0无跳转、1外部小程序、2URL链接、3入闯关模式、4排位赛主页、5蒙面歌神主页、6歌单闯关主页、7任务中心主页"
                    "appid":"wx95e1fd309fd2d844",
                    "path":"pages/index/index",
                    "url":"https://91haoka.com/webapp/dingxin/in/liubang.html?source=caigedaren"                    
      },
      {
                    "id":"10003",    
                    "name":"上海熹微网络科技有限公司",
                    "description":"上海熹微网络科技有限公司\n021-68097651  沪ICP备16025177号-9\n021-68097651  沪ICP备16025177号-9",
                    "image":"https://static.zuiqiangyingyu.cn/admin/1808/0824img_home_card3.png",
                    "jump_type": 4,
//                  "跳转类型：0无跳转、1外部小程序、2URL链接、3入闯关模式、4排位赛主页、5蒙面歌神主页、6歌单闯关主页、7任务中心主页"
                    "appid":"wx95e1fd309fd2d844",
                    "path":"pages/index/index",
                    "url":""                    
      },
]

//		jump_type "跳转类型：0无跳转、1外部小程序、2URL链接、3入闯关模式、4排位赛主页、5蒙面歌神主页、6歌单闯关主页、7任务中心主页"
//var gotoUrls = {
//	3: 'song',
//	4: 'match_index',
//	5: 'god_index',
//	6: 'song_index',
//	7: 'gift_center',
//}
var gotoUrls = {
	3: {
		path: 'song',
		describe: '闯关模式',
	},
	4: {
		path: 'match_index',
		describe: '排位赛',
	},
	5: {
		path: 'god_index',
		describe: '蒙面歌神',
	},
	6: {
		path: 'song_index',
		describe: '歌单闯关',
	},
	7: {
		path: 'gift_center',
		describe: '任务中心',
	},
}



///////////////////////////////////
///////////////////////////////////
import { ajax } from './wxRequest.js'   //引入ajax请求模块

//版本控制(BMS后台的数据)
var getVerControl = function () {
  var that = this;
  var appName = that.data.logmsg.appName;
	var common = apiAll.common;
	var version = that.data.logmsg.bms_ed;
  log(`版本控制号: ${version}`);
  return new Promise((resolve, reject) => {
    //发送ajax请求
    var result = {
      url: common.CONFIG_INFO, //请求的地址
      data: {
        app_name: appName,
        version: version,
      },
      contentType: "urlencoded"
    };
   
    //	log(`版本控制-数据: ${JSON.stringify(result)} `)
    ajax(result).then(function (res) {
      log(`版本控制-返回: ${JSON.stringify(res)}`);
      if (res.code == "0") {
      	var sData = res.data || {};
      	that.data.allControl = sData
      	resolve(sData)
      } else {
        console.error(res);
        reject(res)
      }
    });
  });
};

//版本控制（ip屏蔽）
var getIpControl = function (resolve) {
  var that = this;
  var appName = that.data.logmsg.appName;
  var common = apiAll.common;
  return new Promise((resolve, reject) => {
  //发送ajax请求
  var result = {
    url: common.IS_ENABLE, //请求的地址
    data: {
      app_name: appName
    },
    contentType: "urlencoded"
  };
 	 //	log(`ip控制-数据: ${JSON.stringify(result)} `)
	  ajax(result).then(function (res) {
	    if (res.code == "0") {
	      //		log(`ip控制-返回: ${JSON.stringify(res)}`)
	      //      0是广深的IP，1是其他地区的IP
	      //		判断是0，就不显示，1的话，才显示出来
	      //这里只获取ip屏蔽的
	      	var sData = res.data || {};
			that.data.ipControl = sData.is_enable || 0;
			resolve(sData)
	    } else {
	      console.error(res);
	      reject(res)
	    }
	  });
  })
};
//11.15新增，获取所有bms参数
var bmsControl = function(fun) {
	var that = this;
	//11.15新增，同时屏蔽
	var p1 = that.getVerControl()
    var p2 = that.getIpControl()
	Promise.all([p1, p2]).then(function (results) {
	    //then方法不会被执行
	    console.log('bms后台控制返回ALL', results); 
	    that.isShowControl(fun)
	}).catch(function (e){
	    //catch方法将会被执行，输出结果为：2
	    console.log(2);
	});
}
//判断是否显示
var isShowControl = function (fun) {
  	var that = this;
  	var allControl = that.data.allControl //获取的控制参数
	var show_ad = allControl.show_ad || 0
	var show_share = allControl.show_share || 0
	var show_center = allControl.show_center || 0
	var show_tiaoguo = allControl.show_tiaoguo || 0
	var show_bottom = allControl.show_bottom || 0
	
	that.setControlAd(show_ad)
	that.setControlShare(show_share)
	that.setControlCenter(show_center)
	that.showTiaoguo(show_tiaoguo)
	that.setControlBottom(show_bottom)
	
	if(typeof fun == 'function') {
 		fun()
 	}
};
//单个的显示(是否显示广告)
var setControlAd = function(show_ad) {
	var that = this;
	//获取ipControl的值
	var ipControl = that.data.ipControl //ip屏蔽参数
	
//	{"show_ad":"ip","show_share":"ip","show_center":"ip", "show_center":"ip"}使用这2个去控制，可取的值all,no,ip3个值
//1.show_ad：是否显示广告。（all都显示广告，no都不显示广告，ip开启ip屏蔽）
//2.show_share:是否显示分享看答案。（all都显示看答案，no都显示求助好友，ip开启IP屏蔽）
//3.show_center：是否显示福利中心。（all都显示首页和闯关页面的福利中心，no都不显示，ip开启IP屏蔽）
//4.show_tiaoguo：是否显示跳过功能。安卓才会出现，ios的不会出现（all都显示跳过按钮，no都不显示，ip开启IP屏蔽）

	if(show_ad == 'all') {
		//都显示出来广告
		that.data.show_ad = 1
	} else if(show_ad == 'no') {
		//都不显示出来广告
		that.data.show_ad = 0
	} else if(show_ad == 'ip') {
		//使用ip屏蔽
		if(ipControl == 0) {
			//说明是广深地区
			that.data.show_ad = 0
		} else {
			//说明不是广深地区
			that.data.show_ad = 1
		}
	}
	log('是否显示广告', that.data.show_ad)
}
//单个的显示(是否显示分享)
var setControlShare = function(show_share) {
	var that = this;
	//获取ipControl的值
	var ipControl = that.data.ipControl //ip屏蔽参数
	if(show_share == 'all') {
		//都显示看答案
		that.data.show_share = 0
	} else if(show_share == 'no') {
		//都显示求助好友
		that.data.show_share = 1
	} else if(show_share == 'ip') {
		//使用ip屏蔽
		if(ipControl == 0) {
			//说明是广深地区
			that.data.show_share = 1
		} else {
			//说明不是广深地区
			that.data.show_share = 0
		}
	}
	log('是否显示分享内容', that.data.show_share)
}

//单个的显示(是否显示福利中心)
var setControlCenter = function(show_center) {
	var that = this;
	//获取show_center的值
	var ipControl = that.data.ipControl //ip屏蔽参数
	if(show_center == 'all') {
		//都显示
		that.data.show_center = 1
	} else if(show_center == 'no') {
		//都不显示
		that.data.show_center = 0
	} else if(show_center == 'ip') {
		//使用ip屏蔽
		if(ipControl == 0) {
			//说明是广深地区，不显示
			that.data.show_center = 0
		} else {
			//说明不是广深地区，显示出来
			that.data.show_center = 1
		}
	}
	log('是否显示福利中心', that.data.show_center)
}

//单个的显示(是否显示跳过功能)
var showTiaoguo = function(show_tiaoguo) {
	var that = this;
	//获取show_center的值
	var ipControl = that.data.ipControl //ip屏蔽参数
	if(show_tiaoguo == 'all') {
		//都显示
		that.data.show_tiaoguo = 1
	} else if(show_tiaoguo == 'no') {
		//都不显示
		that.data.show_tiaoguo = 0
	} else if(show_tiaoguo == 'ip') {
//		//使用ip屏蔽
		if(ipControl == 0) {
			//说明是广深地区，不显示
			that.data.show_tiaoguo = 0
		} else {
			//说明不是广深地区，显示出来
			that.data.show_tiaoguo = 1
		}
	}
	log('是否显示跳过功能', that.data.show_tiaoguo)
}


//单个的显示(是否显示底部导流)
var setControlBottom = function(show_bottom) {
	var that = this;
	//获取ipControl的值
	var ipControl = that.data.ipControl //ip屏蔽参数

	if(show_bottom == 'all') {
		//都显示出来广告
		that.data.show_bottom = 1
	} else if(show_bottom == 'no') {
		//都不显示出来广告
		that.data.show_bottom = 0
	} else if(show_bottom == 'ip') {
		//使用ip屏蔽
		if(ipControl == 0) {
			//说明是广深地区
			that.data.show_bottom = 0
		} else {
			//说明不是广深地区
			that.data.show_bottom = 1
		}
	}
	log('是否显示底部导流', that.data.show_bottom)
}

//var allControl = {
//	'show_share': {
//		all: 0,
//		no: 1,
//		ipControl: 
//	}
//}


//10.23新增一个统计的方法
function commonMtaNew(id, name, appid) {
	var that = this
	//如果3个中有一个没有，直接返回
	if(!id) {
		log('统计的参数错误,没有id', id)
		return
	}
	if(!name) {
		log('统计的参数错误,没有name', name)
		return
	}
	if(!appid) {
		log('统计的参数错误,没有appid', appid)
		return
	}
	
	//如果没有事件的value，直接返回，防止腾讯统计出现错误
	var stringJson ='{"'+ name +'": ""}';  //通过JSON.parse，把字符串转成一个对象
	var result = JSON.parse(stringJson);
	result[name]= appid
	log(`腾讯统计事件id: ${id}+事件参数的key: ${JSON.stringify(result)}`)
	that.mta.Event.stat(id, result)
}

 //11.07判断是否有授权的信息，在回调里面去使用
var getLoginData = function(page, fun) {
		var that = this
		wx.getSetting({
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
	}

//11.26新增——处理用户头像为空的情况
var dealHead = function(user) {
	var that = this
	log('设置头像信息', user)
	
	var avatar = user.avatar
	//如果没有，就去设置一个默认头像
	if(!avatar) {
		avatar = that.data.defaultAvatar  //这个是默认的头像值
		user.avatar = avatar  //然后去设置头像
	}
	
	//如果这个值没有，就去设置（兼容性处理）
	if(user.avatarUrl) {
		user.avatarUrl = avatar
	}
	return user
}


module.exports = {	
	//所有的地址信息
	apiAll,
	update,
	songGod,
//	funnelAll,
	dealUnusual,
	//09.18新增跳转的测试数据
	configData,
	gotoUrls,
	
	
	//09.20新增版本控制
	getVerControl,
	//ip控制
	getIpControl,
	setControlAd,
	setControlShare,
	setControlCenter,
	showTiaoguo,
	setControlBottom,
	//11.15新增获取所有屏蔽内容
	bmsControl,
	isShowControl,
	
	//10.23新增统计的方法
	commonMtaNew,
	
	  //11.07判断是否有授权的信息，在回调里面去使用
	getLoginData,
	//新增，处理旧用户的数据
	dealHead,
};