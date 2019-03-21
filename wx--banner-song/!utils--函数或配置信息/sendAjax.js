var log = console.log.bind(console)
var util  = require("./util.js")
var wxRequest  = require("./wxRequest.js")

//获取应用实例
var app = getApp()

var logN = app.logN()
var apiAll = app.apiAll
//var series = apiAll.series

var testData = [
    {
        "id": 1001,
        "name": "TFBOYS",
        "remark": "测试-TFBOYS",
        "o": 1,
        "img": "https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/uploads/94e885707280a427c84a767db8b3087e.jpg",
        "own_users": "11.42万",
        "status": 2
    },
    {
        "id": 1002,
        "name": "抖音大全",
        "remark": "测试-抖音大全",
        "o": 2,
        "img": "https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/uploads/09600769923de4a789b1f976c602edce.jpg",
        "own_users": "13.45万",
        "status": 2
    },
    {
        "id": 1003,
        "name": "薛之谦精选",
        "remark": "测试-薛之谦精选",
        "o": 3,
        "img": "https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/uploads/09600769923de4a789b1f976c602edce.jpg",
        "own_users": "12.44万",
        "status": 2
    },
    {
        "id": 1004,
        "name": "华语流行",
        "remark": "测试-华语流行",
        "o": 4,
        "img": "https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/uploads/904528e23858ad62825044b7567131de.jpg",
        "own_users": "13.6万",
        "status": 0
    },
     {
        "id": 1003,
        "name": "薛之谦精选",
        "remark": "测试-薛之谦精选",
        "o": 3,
        "img": "https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/uploads/09600769923de4a789b1f976c602edce.jpg",
        "own_users": "12.44万",
        "status": 2
    },
//  {
//      "id": 1004,
//      "name": "华语流行",
//      "remark": "测试-华语流行",
//      "o": 4,
//      "img": "https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/uploads/904528e23858ad62825044b7567131de.jpg",
//      "own_users": "13.6万",
//      "status": 0
//  },
//   {
//      "id": 1003,
//      "name": "薛之谦精选",
//      "remark": "测试-薛之谦精选",
//      "o": 3,
//      "img": "https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/uploads/09600769923de4a789b1f976c602edce.jpg",
//      "own_users": "12.44万",
//      "status": 2
//  },
]


//09.14新增异常情况处理
var dealUnusual = function(res, that) {
	var c = res.c
//	log('----------', res, that)
	if(c != 0) {
		if(c == 4) {
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
		return false
	}
	return true
}


//在这里去设置所有的列表信息
var getAllList = function(that) {
	var list1 = allGet('seriesBanner')
	var list2 = allGet('seriesList')
	Promise.all([list1, list2]).then(function (results) {
		//09.14新增
		var dealUnusual1 = dealUnusual(results[0], that)
		var dealUnusual2 = dealUnusual(results[1], that)
		log('--song_index--在这里去设置所有的列表信息--', dealUnusual1, dealUnusual2, results)
		if(!dealUnusual1) {
			return
		}
		if(!dealUnusual2) {
			return
		}
		//这里得到全部的列表（banner和歌单list，并合并成一个数组）
		var return1 = results[0] || []
		var return2 = results[1] || []
		if(return1.c != 0 && return2.c != 0 ) {
			console.error(return1, return2)
			return
		}
	    var data1 = return1.d
	    //设置排序列表(不需要排序)
//	    var data2 = setSongList(return2.d)
		var data2 = return2.d

	    //设置所有的列表
	   	var lastArray = data1.concat(data2)
	   	that.setData({
	   		//设置banner数组
	   		bannerLists: data1,
	   		//设置所有的数组
	   		songList: data2,
	   		//设置所有的列表
	   		songsAll: lastArray,
	   		//这里是设置banner的长度
	   		bannerLength: data1.length,
	   	})
	}).catch(function(res) {
		log('---------------------------', res)
		console.error(res)
	})
}

//设置排序（歌单的需要设置排序）
//var setSongList = function(arr) {
//	arr = arr || []
//	var len = arr.length
//	if(len == 0) {
//		return
//	}
//	var result = {
//		0:[],
//		1:[],
//		2:[],
//	}
//	// "status": 0   //0未拥有，1已拥有，2限时免费
//	for(let i = 0; i < len; i++) {
//		var a = arr[i]
//		var status = a.status
//		result[status].push(a)
//	}
//
//	//返会最后的数组(排好顺序)
//	var resultLast = result[1] || []
//	var resultLast = resultLast.concat(result[2], result[0])
//	return resultLast
//}

//获取全部歌单和已拥有的歌单
var getSeriesList = function(that, own) {
	log(3333, own)
//	own	是否已拥有 1是0否
	var otherParameter = {}
	if(typeof own  == 'number') {
		otherParameter = {
			own: own,
		}
	}

//	返会所有的歌单
	var success = function(res) {
		var data = res.d
		logN(3333, data.length)
//		var data = data.concat(testData)
		//获得所有的歌单
// "status": 0   //0未拥有，1已拥有，2限时免费
		//设置所有的歌单
		that.setData({
			songList: data || []
		})
		log(22222, that.data.songList.length)
	}
	allGetNew('seriesList', that, {success}, otherParameter)
}


////////////////////////////////////////////////
////////////////////////////////////////////////
//08.29新增获取分享的配置
var getUserInfo = function(that, fun) {
//	返会所有的歌单
	var success = function(res) {
		var data = res.d.user || {}
			//08.31新增配置信息
			that.setData({
				classic: data.classic,
	    })
		log('-sendAjax-getUserInfo-请求返回', data)
	    app.data.userInfo.classic = data.classic
		//09.07新增,设置是否是首次
		firstData(data)
		if(typeof fun == 'function') {
			fun()
		}

		//注：分享语动态配置目前只支持猜歌达人
		//用户昵称: nickname
		//用户已成功闯关数: pass_next
		//用户排位赛等级: classic_name
		//用户排位赛当场分数: 暂不支持

		//用户战场当场击败的用户数: 暂不支持
		//用户擂台赛当场分数: 暂不支持（没有這个模式）
		setUserInfo(data)
		
		
		//11.23新增——这里去设置用户的分享次数和看答案的次数
		app.data.share_times = data.share_times
		app.data.skip_times = data.skip_times
	}
	allGetNew('USER_INFO', that, {success})
}
//09.07新增
var firstData = function(data) {
	var funnelAll = {
//		'caigexinshouyin': '1',
		'caigepaiweisai': data.first_in_season,
		'mengmiangeshenl': data.first_in_mask,
		'gedanchuangguan': data.first_in_series,
		//09.19新增
		'tongzhizhongxin': data.first_in_notice,
		'lingyinfu': data.first_in_gift,
	}
	app.data.funnelAll = funnelAll
	
	log('漏斗模式,是否是首次', app.data.funnelAll)
	//是否进入过排位赛首页： 'first_in_season'
//是否进入过蒙面歌神首页：'first_in_mask'
//是否进入过歌单首页：'first_in_series'
//		09.07新增，是否是首次进入---设置信息
}


//这里是所有的配置口
var shareInfoAll = {
	'nickname': '',
	'classic_name': '',
	'pass_next': '',
	'match_sorce': '',
}
//设置分享配置数据
var setUserInfo = function(obj) {
	//如果不是对象，就不去进行下面的操作
	if(util._typeof(obj) != 'object') {
		return
	}
	//找到所有的key
	var keys = Object.keys(shareInfoAll)
	//循环对象里的数据
	for(var key in obj) {
		if(keys.indexOf(key) > -1) {
			var value = obj[key]
			//如果是等级的话，就要去请求接口
			if(key == 'pass_next') {
				value = Number(value) - 1
			}
			shareInfoAll[key] = value
		}
	}
	app.data.shareInfo = shareInfoAll
	log('分享配置11111', shareInfoAll)
}

//song闯关提交答案之后，去更新数据
var changeSongPassNext = function(that, pass_next) {

	//原来的闯关模式
	setUserInfo({
		pass_next,
	})
	//		判断不同的参数和链接
//	var options = that.data.options
//	if(!options.seriesId) {
//		//原来的闯关模式
//		setUserInfo({
//			pass_next,
//		})
//	}
}

//type:请求的接口名字
//that:页面中名字，可以用来设置参数
//fun: 成功的请求（success）或错误的（fail）
//otherParameter： 拼接其他参数

//这个是返会一个promise
var allGet = function(type, otherParameter) {
	var token = app.data.userInfo.token
	if(!token) {
		return
	}

//	var url = app.data.logmsg.domain + series[type]
	//09.18新增修改
	var url = app.data.logmsg.domain + apiAll[type]

	var resultData = {
		token,
	}
	//合并参数
	if(otherParameter) {
		resultData = Object.assign(resultData, otherParameter)
	}
	var model = {
		url: url,
		data: resultData,
	}
	let loginNew = wxRequest.ajaxNew(model)
	return loginNew
}
//这里是通用的处理
var allGetNew = function(type, that, fun, otherParameter) {
	var loginNew = allGet(type, otherParameter)
	loginNew.then(function(res) {
		var c = res.c
		if(c != 0) {
			if(c == 4) {
				//11.22修改，不然首页会显示登录的弹窗
//			 	//如果不是0，直接返回了
//				that.setData({
//					initial_show: true
//				})
			} else {
				//其他报错,直接弹出来
				wx.showToast({
					title: res.m,
					icon: 'none',
					duration: 2000
				})
				console.error(res)
			}
			return
		}
		if(typeof fun.success == 'function') {
			fun.success(res)
		}
	}).catch(function(res) {
		console.error(res)
		if(typeof fun.fail == 'function') {
			fun.fail(res)
		}
	})
}

module.exports = {
//	getSeriesBanner,
	getSeriesList,
	getAllList,
	allGetNew,
	getUserInfo,
	setUserInfo,
	changeSongPassNext,
}
