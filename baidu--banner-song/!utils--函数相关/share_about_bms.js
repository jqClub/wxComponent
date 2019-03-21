var log = console.log.bind(console)
var utils  = require("./util.js")
var wxRequest = require("./wxRequest.js")  //引入ajax请求模块
import { ajax } from './wxRequest.js'   //引入ajax请求模块

//获取应用实例
var app = getApp()

//var appName = 'baiducaigedaren'
var appName = app.data.logmsg.appName

//获取分享信息
//游戏分享信息的所有接口
//var shareApi = app.apiAll.share_words
var shareApi = app.data.API.share_words

//获取分享信息
var getComment = function() {
	//发送ajax请求
	var result = {
	  url: shareApi.shareList,  //请求的地址
	  data: {
			app_name: appName
		}, 
		contentType: "urlencoded",
	}
//	log(`share_about获取分享信息-发送数据: ${JSON.stringify(result)} `)
	ajax(result).then(function(res) {
//		log(`share_about获取分享信息-接口返回: ${JSON.stringify(res)}`)
		dealShare(res)
	})
}
//处理返回的数据
var dealShare = function(res) {
	//如果返回的是成功
	if(res.code == '0') {
		//获取广告的列表
		var wordList = res.data.list || []
		//处理这些返回的数据
		dealList(wordList)
	}
}

var dealList = function(wordList) {
	var len = wordList.length
	if(len == 0) {
		return
	}
	var result = {
		'help': [],  //求助按钮（8）
		'addMoney': [],  //分享得金币（4）
		'challenge_end': [],  //成功按钮，普通分享（3）
//		'mySongList': [],  //我的歌单，普通分享（3）
		'rankList': [],  //分享成绩（6）
	}
	//获取所有key的值
	var place = Object.keys(result)
	for (let i = 0; i < len; i ++) {
		var a = wordList[i]
		var position = a.position
		if(position == 8) {
			result.help.push(a)
		} else if(position == 4) {
			result.addMoney.push(a)
		} else if(position == 3) {
			result.challenge_end.push(a)
		} else if(position == 6) {
			result.rankList.push(a)
		}
//		if(position == 1) {
//			result.answerInvite.push(a)
//		} else if (position == 99) {
//			result.shareRight.push(a)
//		} else if (position == 4) {
//			//09.11新增修改
//			result.relive_share.push(a)
//		}
	}
	log('所有的分享信息', result)
	setShareNew(result)
	return result
}
//设置分享语的列表
var setShareNew = function(result) {
//	var shareNew = app.data.shareNew
//	for(var key in result){
//		var value = result[key]
//		var len = value.length
//		//如果不为空，就去设置对象
//		if(len != 0) {
//			shareNew[key] = value
//		}
//	}
	//设置app.data里面的分享语
//	app.data.shareNew = shareNew || {}
	app.data.shareNew = result || {}
}

//位置： 1 => '发起挑战', 
//2 => '群分享续命', 
//3 => '普通分享', 
//4 => '分享得金币', 
//5 => '胜利炫耀', 
//6 => '分享成绩', 
//7 => '查看群排行', 
//8 => '求助', 
//99 => '其它',

//对应的位置
//answerInvite: shareNew,  1
//shareRight: shareNew,  99

////获取用户的open_id
//var getOpenId = function() {
////var that = this;
//var loginData = app.data.userInfo || {};
//var open_id = loginData.openid
//return open_id;
//};

//去请求数据
var shareWord = function(type, sData, fun) {
	if(!type) {
		return
	}
	
	var common_ads = sData || {}
	//用户的信息
//	var userInfo = app.data.user_king
//	var loginData = app.data.loginData || {}
//	var open_id = loginData.openid
	
	//用户的open_id
//	var open_id = getOpenId()
	//用户的信息
//	var userInfo = app.getWxData()
	var userInfo = app.data.userInfo || {}
	var open_id = userInfo.openid
//	log('发送广告的位置', open_id)
	if(!common_ads.id) {return}
	if(!open_id) {return}
	
	var data = {
	  "app_name": appName,
	  "open_id": open_id,  //微信的openid
	  "name": userInfo.nickname,   //微信用户的信息
	  "gender": userInfo.gender, //微信用户的信息
	  position: common_ads.position || '',  //这个在点击的时候，不用发送请求
	  "share_id": common_ads.id,
	  "share_title": common_ads.title,
	}
	
	//发送ajax请求
	var result = {
		method: 'POST',
		url:  shareApi[type],  //请求的地址
		data: data, //请求的参数
		contentType: "urlencoded",
	}
	
	//09.17新增，统计分享
//	aboutTsjiChannle.dealShare(type, common_ads)

//	log(`share_about统计后台分享-发送数据: ${JSON.stringify(result)}`)
	ajax(result).then(function(res) {
//		log(`share_about统计后台分享-接口返回: ${JSON.stringify(res)}`)
		if(typeof fun =='function') {
			fun()
		}
	})
}

//share分享出去的信息
var shareAjax = function(sData) {
//	sData分享出去的信息，包含id等信息
	shareWord('showWord', sData)
}
//点击分享的请求
var clickShare = function(sData, fun) {
	//12.12修改，因为是在登录后，再去请求
	shareWord('clickWord', sData, fun)
	
//	//防止拿不到用户信息(延迟一点去发送，每次只发送一次请求)
//	setTimeout(function() {
//		shareWord('clickWord', sData, fun)
//	}, 1000)
}



//获取分享的内容，并且去请求后端的接口数据
var getShare = function(shareType, path) {
	  //处理埋点
//	  //默认的分享类型
//	  var shareType = "shareRight";
//	  //判断是不是右上角的分享内容
//	  var targetNew = e.target || {};
//	  if (targetNew.dataset) {
//	    //新增统计埋点
//	    //		var mta = e.target.dataset.mta
//	    //		aboutTsji.submitMta(mta)
//	
//	    var dataset = targetNew.dataset || {};
//	    //这里因为没有限制，所以需要先判断下
//	    if (dataset.shareword) {
//	      //设置的分享类型
//	      var shareword = dataset.shareword;
//	      //			log(1111111, shareword)
//	      shareType = shareword;
//	    }
//	  }
//	  log(shareType);
	  //获取分享的信息
	  var result = app.shareTitleImg(shareType);
	
	  //分享对象中加上地址信息
	  path = path || "/pages/index/index";
	  //原来的代码
	  //	if(result.id) {
	  //		path += `?shareid=${result.id}&sharetitle=${result.title}`
	  //	}
	  //09.11新增修改
	  var urlObj = {};
	  if (result.id) {
	    urlObj = {
	      shareid: result.id,
//	      11.22修改，先去掉这个统计，再去处理
//	      sharetitle: result.title
	    };
	  }
	  //09.11新增，去处理分享的内容
//	  urlObj = send_stat.shareGetFuho(that, e, urlObj) || {};
	
	  var pathLast = utils.joinObj(urlObj);
	  
//	  if(path.indexOf('?')) {
    if(path.indexOf('?') != -1) {
	  	result.path = path + `&${pathLast}`;
	  } else {
	  	result.path = path + `?${pathLast}`;
	  }
	  
	  log("分享的内容", shareType, result); 
	  //发送统计数据（广告后台的）
	  shareAjax(result);
	  return result;
};






////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//11.07修改，增加音符
//分享加机会的处理（分享的入口）
var addChances = function(page, fun) {
  //remain_share_total分享的上限(每天5次)
  var share_times = app.data.share_times
  log("分享剩余的次数", share_times);

  if (share_times) {
    //延迟去发送请求
    //1.发送请求
      shareGetYnfu(page, fun)
//  setTimeout(function() {
//    //1.发送请求
//    shareGetYnfu(page, fun)
//  }, 1000);
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

	//情况1
	if(score) {
		app.showToastNew("分享成功，得"+ app.data.addYnfu +"音符");
		
//	  	//用户总的音符数量
//		app.data.userInfo.score = score

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
//11.15新增，用户分享看答案的功能
//分享加机会的处理（分享的入口）
var addLookChances = function(page, fun) {
  //remain_share_total分享的上限(每天5次)
  var share_look_times = app.data.share_look_times
  log("分享看答案剩余的次数", share_look_times);
  
  if (share_look_times) {
  	//    //1.发送请求(11.12直接发送，因为是在onshow里面去请求)
      shareGetAnswer(page, fun)
  } else {
  	if(typeof fun.fail == 'function') {
		fun.fail()
	}
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
				//重新去登陆
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
	var share_times = res.d.share_times;
	var score = res.d.score
	app.data.share_look_times = share_times
	
	if(share_times) {
		if(typeof fun.success == 'function') {
			fun.success()
		}
	} else {
		if(typeof fun.fail == 'function') {
			fun.fail()
		}
	}
  	log("分享看答案剩余的次数", share_times, app.data.share_look_times);
};

module.exports = {
	getComment, //获取分享信息
	shareAjax, //分享的时候，发送请求
	clickShare,//点击分享内容，发送请求
	
	getShare,//获取分享内容
	
	addChances: addChances,  //分享增加音符的接口
	
	addLookChances: addLookChances, //11.15新增，分享看答案的功能
}