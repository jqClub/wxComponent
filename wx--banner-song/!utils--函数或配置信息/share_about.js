//用来请求share语
//获取应用实例
var log = console.log.bind(console)
//获取应用实例
var app = getApp()
var wxRequest = require("./wxRequest.js")  //引入ajax请求模块
var utils = require("./util.js")  //引入工具文件

//09.06新增统计数据
var statistics0906 = require("./statistics0906.js")  //08.29通用的发送请求
var statisticsNew = statistics0906.statisticsNew

 //10.19引入缓存的机制
var wcache = require("./wcache.js")

var first = 0

//所有的请求地址
var urlAll = {
	getAll: '/index.php/api/guess_v2/Share_material',
	shareId: '/index.php/api/guess_v2/Share_stat',
	clickShare: '/index.php/api/guess_v2/Share_material_click',
}

//判断链接里面是否有？
var hasQuestion = function(url, mid) {
	var result = '?'
	//判断如果有？，就说明有其他参数了，需要换成&符号。否则直接是？
	if(url.indexOf('?') != -1) {
		result = '&'
	}
	//如果有mid，才加上，没有的话，不用加了
	if(mid) {
		url += `${result}mid=${mid}`
	}
	return url
}


//页面中关于分享的回调
var sharePage = function(sData, that) {
//		log(`sData: ${JSON.stringify(sData)}`)
		var app = sData.app
		var type = sData.type  //页面里的类型
		var pageType = sData.pageType  //需要请求的类型
//		06.20新增修改
		var returnShare = app.shareTitleImg(pageType, type)

//		log(`sData: ${JSON.stringify(sData)}`)
		//07.18新增，如果是邀请有礼，就使用新的邀请有礼的分享语
		if(type == 'invite_gifts') {
			returnShare = app.shareTitleImg('daily_share', type)
		}
		
		//07.11新增,发送请求---点击分享的按钮(我们之后不知道用户是否分享成功，所以用点击的吧)
		//returnShare.type是传递过来的参数
		if(returnShare.type && returnShare.id) {
			var mid = returnShare.id
			Share_material({
				urlType: 'shareId',
				data: {
					type: returnShare.type,
					mid: mid,
				},
				app: app,
			}, that)
			
			//发送统计请求
			statisticsNew(that)
			//发送显示首页的函数
			that.statisticsNew.submitMta('fenxiangtongji_sendShare', mid)
		}	
		
		var let_path = sData.let_path;
		let_path = hasQuestion(let_path, returnShare.id)
		returnShare.let_path = let_path  //加上地址信息
		log(`分享的内容: ${JSON.stringify(returnShare)}`)
		
		//08.29处理分享位置
		returnShare = dealShareInfo(returnShare)
		//10.19新增，直接返回一个空的对象，防止有报错的信息
		return returnShare || {}
//		return returnShare
}
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
//var returnReg = function(str) {
//	var reg = /(?:\()\w+(?:\))/g;
//	var res = str.match(reg); 
//	//返会的是一个数组
//	return res
//}
//公用函数
String.prototype.replaceAll = function (FindText, RepText) {
    var regExp = new RegExp(FindText, "g");
    var result = this.replace(regExp, RepText);
//  log(22222, FindText, result)
    return result
}
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////


//08.29处理分享位置
var dealShareInfo = function(returnShare) {
	//所有配置位置
	var shareInfo = app.data.shareInfo || {}
	var keys = Object.keys(shareInfo)
	var len = keys.length
	//09.12新增，在为0的时候，直接返回
	if(len == 0) {
		return
	}
	//分享的字符串
	var title = returnShare.title
//	var res = returnReg(title) || []
	//循环替换需要匹配的内容
	for(var i = 0; i < len; i++) {
		var a = keys[i]
		//这里拿到的是字符串，还需要在外面加上{}
		var b = `{${a}}`
		title = title.replaceAll(b, shareInfo[a])
	}
	returnShare.title = title
	return returnShare
	
//	for(var i = 0; i < res.length; i++) {
//		var a = res[i]
//		
//		var indexKey = keys.indexOf(title)
//		if(indexKey > -1) {
//			title.replaceAll()
//		}
//		log(1111, title, res, shareInfo)
//	}
}

//进入页面中，需要去请求的数据
var getShareAll = function(sData) {
	var that = sData.page  //设置page
	//请求所有的分享内容
	Share_material({
		urlType: 'getAll',
		app: sData.app,
		sData: sData,
	}, that)
}
//这个只在onload里面去判断，上面在onshow里面去判断
var shareFirst = function(sData) {
	var that = sData.page  //设置page
	var options = that.data.options
//	log(`options: ${JSON.stringify(options)}`)
	//判断options中是否带有mid的，有的话，就去请求接口
//	if(options.mid) {
//		Share_material({
//			urlType: 'clickShare',
//			data: {
//				mid: options.mid,
//			},
//			app: sData.app,
//		})
//	}
	//08.17修改，只发送一次请求（去掉了）
	if(options.mid) {
//		if(first == 0) {
//			//08.22新增
//			var otherGetNewClick = getNewClick() || {}
//			let ret = {
//				mid: options.mid,
//			}
//			ret = Object.assign(ret, otherGetNewClick)
//			log('点击分享的参数', ret)
//			Share_material({
//				urlType: 'clickShare',
//				data: ret,
//				app: sData.app,
//			}, that)
//			first++
//		}
//		09.07修改,这里是放在onload里，所有不会有影响
		var mid = options.mid
		var otherGetNewClick = getNewClick() || {}
		let ret = {
			mid: mid,
		}
		ret = Object.assign(ret, otherGetNewClick)
		log('点击分享的参数', ret)
		Share_material({
			urlType: 'clickShare',
			data: ret,
			app: sData.app,
		}, that)
		
		//09.07新增发送统计请求
		statisticsNew(that)
		//发送显示首页的函数
		that.statisticsNew.submitMta('fenxiangtongji_clickShare', mid)
	}
}


//所有的回调函数（在这里进行处理）
var callBack = function(sData, that) {
	var app = sData.app
	var result = {
		getAll: function(data) {
			//分享的位置：首页index、闯关首页challenge_index、闯关分享challenge_help、
			//排位赛首页season_index、排位赛结束分享season_end、排行榜top_all，daily_share邀请有礼
			var shareAllWord = app.data.shareAllWord
			//如果是有长度的，就去设置app.data.shareAllWord的值
			for(var k in data) {
				if(data[k].length) {
					app.data.shareAllWord[k] = data[k]
				}
			}
		},
		shareId: function(data) {
			
		},
		clickShare: function(data) {
		},
	}
	return result[sData.urlType](sData.data)
}

//请求分享的接口
var Share_material = function(sData, that) {
	//11.23备注：urlType和app必须，data和sData非必须
//	Share_material({
//需要发送的接口名字
//		urlType: 'shareId',   
//app对象
//		app: app,
////////////////
//需要传递过去的参数
//		data: {
//			type: returnShare.type,
//			mid: mid,
//		},
//页面中传过来的参数
//	sData: sData,
//	}, that)

	var app = sData.app
	if(!sData.urlType) {
		return 
	}
//	if(!app.data.user_king) {
//		return 
//	}
	if(!app.data.userInfo.token) {
		return 
	}
	var url = app.data.domain + urlAll[sData.urlType]
	var data = {
		//用户的token信息
		token: app.data.userInfo.token, 
		//小程序的类型
//		app: app.data.logmsg.wechat_type,  
		//07.12修改了标示,否则后台无法统计
		app: 'guess_song', 
	}
	//如果有，就合并2个数组
	if(sData.data) {
		data = utils.assignObject(data, sData.data)
	}
	//发送ajax请求
	var result = {
	  url: url,  //请求的地址
	  data: data, //请求的参数
	}
//	log(`分享请求${sData.urlType}: ${JSON.stringify(result)} `)
	wxRequest.ajaxNew(result).then(function(res) {
//		log(`分享请求返回${sData.urlType}: ${JSON.stringify(res)}`)	
//		if(res.c == '4') {
//			log('素材还没上传')
//			return 
//		}
		if(res.c == '0') {
			//11.23新增，再这里做个回调，去处理跳转信息,因为需要保证一定登录再跳转过去
			if(sData.sData) {
				var pageCall = sData.sData.pageCall
				if(typeof pageCall == 'function') {
					pageCall()
				}
			}
			
			callBack({
				urlType: sData.urlType,
//				data: res.d,
				data: res.d || [],
				app: app,
			}, that)
		} else if (res.c == '4') {
			if(that) {
				//09.14修改重新去登录
//				（10.24因为没有素材的时候，也是返回4，所以去掉這个判断）
//				10.26后台已经修改了，返回的是0
//				that.setData({
//					initial_show: true
//				})		
			}
		} else {
			//错误的提示
			log(`res.m: ${res.m}`)
		}
	})
}


//08.22点击的需要，传新的参数过去
var getNewClick = function() {
	var userInfo = app.data.userInfo || {}
	var first_login = userInfo.first_login || 0
	
	//是否有授权信息
//	var is_auth =  app.data.is_auth || 0
	//猜歌的一定需要授权才可以进去
	var is_auth =  1
	let result = {
		first_login,
		is_auth,
	}
	return result
}



////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//分享加机会的处理（分享的入口）
var addChances = function(page, fun) {
  //remain_share_total分享的上限(每天5次)
  var share_times = app.data.share_times
  log("分享剩余的次数", share_times);
  
  if (share_times) {
    //延迟去发送请求
    setTimeout(function() {
      //1.发送请求
      shareGetYnfu(page, fun)
    }, 1000);
  } else {
    setTimeout(function() {
      app.showToastNew("今日分享机会已达上限，休息一下明天再来~");
    }, 1000);
  }
};

//10.19新增,统一发送获取音符的逻辑（分享的请求）
var shareGetYnfu = function(page, fun) {
	var that = page
	var userInfo = app.data.userInfo || {}
	var token = userInfo.token
	if(!token) {
		return
	}
	//发送ajax请求
	var result = {
	  url: app.data.API.REWARD_SHARE,  //请求的地址
	  data: {
	  	token: token, 
	  }, //请求的参数
	}
	log(`分享加音符的--: ${JSON.stringify(result)} `)
	wxRequest.ajaxNew(result).then(function(res) {
		log(`分享加音符的返回数据--: ${JSON.stringify(res)}`)		
		if(res.c == '0') {
			//去处理剩余分享的次数
			addAnimation(page, res, fun)
		} else if (res.c == '4') {
			if(that) {
				//重新去登录
				that.setData({
					initial_show: true
				})		
			}
		} else {
			//错误的提示
			log(`res.m: ${res.m}`)
		}
	})
}

//這个是分享的回调信息
var addAnimation = function(that, res, fun) {
	//第一种情况：如果返回的，有share_times和score，说明分享成功了，加上了音符
	//第二种情况：如果只有返回share_times，说明分享达到上限了，本次分享没有加音符
	res = res || {}
	var share_times = res.d.share_times;
	var score = res.d.score
	app.data.share_times = share_times
	
	
	//存在本地数据
//	wcache.put('shareTimes', share_times, wcache.nextDayTime())
	
	//情况1
	if(score) {
		app.showToastNew("音符+10");
	  	//用户总的音符数量
		app.data.userInfo.score = score
		
		if(typeof fun == 'function') {
	  		fun(res)
	  	}
	} else {
		//情况2
		setTimeout(function() {
	      app.showToastNew("今日分享机会已达上限，休息一下明天再来~");
	    }, 1000);
	}
	
  	log("分享剩余的次数", share_times, app.data.share_times);
};



////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//11.12新增，用户分享看答案的功能
//分享加机会的处理（分享的入口）
var addLookChances = function(page, fun) {
  //remain_share_total分享的上限(每天5次)
  var skip_times = app.data.skip_times
  log("分享看答案剩余的次数", skip_times);
  
  if (skip_times) {
  	//    //1.发送请求(11.12直接发送，因为是在onshow里面去请求)
      shareGetAnswer(page, fun)
//  //延迟去发送请求
//  setTimeout(function() {
//    //1.发送请求
//    shareGetAnswer(page, fun)
//  }, 1000);
  } else {
  	if(typeof fun.fail == 'function') {
		fun.fail()
	}
//  setTimeout(function() {
//    app.showToastNew("今日分享机会已达上限，休息一下明天再来~");
//  }, 1000);
  }
};

//10.19新增,统一发送获取音符的逻辑（分享的请求）
var shareGetAnswer = function(page, fun) {
	var that = page
	var userInfo = app.data.userInfo || {}
	var token = userInfo.token
	if(!token) {
		return
	}
	//发送ajax请求
	var result = {
	  url: app.data.API.SKIP,  //请求的地址
	  data: {
	  	token: token, 
	  }, //请求的参数
	}
	log(`分享看答案的--: ${JSON.stringify(result)} `)
	wxRequest.ajaxNew(result).then(function(res) {
		log(`分享看答案的返回数据--: ${JSON.stringify(res)}`)		
		if(res.c == '0') {
			//去处理剩余分享的次数
			addLookAnimation(page, res, fun)
		} else if (res.c == '4') {
			if(that) {
				//重新去登录
				that.setData({
					initial_show: true
				})		
			}
		} else {
			//错误的提示
			log(`res.m: ${res.m}`)
		}
	})
}

//這个是分享的回调信息
var addLookAnimation = function(that, res, fun) {
	//第一种情况：如果返回的，有share_times和score，说明分享成功了，可以看答案
	//第二种情况：如果只有返回share_times，说明分享达到上限了，本次分享不可以看答案
	res = res || {}
//	var skip_times = res.d.skip_times;
//	var score = res.d.score
//	app.data.skip_times = skip_times
	
	//11.26修改，先去判断，再去设置新的值
	var skip_times = app.data.skip_times
	if(skip_times) {
		if(typeof fun.success == 'function') {
			fun.success()
		}
	} else {
		if(typeof fun.fail == 'function') {
			fun.fail()
		}
	}
	
	//11.26更新用户的剩余看答案次数
	var skip_times = res.d.skip_times;
	app.data.skip_times = skip_times
  	log("分享看答案剩余的次数", skip_times, app.data.skip_times);
};


module.exports = {
	 Share_material: Share_material, //请求分享语
	 sharePage: sharePage, //页面中关于分享的回调
	 shareFirst: shareFirst, //进入页面后，判断是否去请求
	 getShareAll: getShareAll, //进入页面，在onshow里面的判断
	 addChances: addChances,  //分享增加音符的接口
	 
	 addLookChances: addLookChances, //11.12新增，用户分享看答案的功能
}


//11.23备注:分享看答案和分享加音符的，次数需要分开，由请求接口后去返回次数，不要去请求user里的次数，user_info要新加一个skip_times-分享看答案的次数
//share_times--分享得音符的次数