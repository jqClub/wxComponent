var log = console.log.bind(console)

var isWx = require("./isWx.js");   //关于微信授权的获取
var wxRequest = require("./wxRequest.js");  //ajax请求数据
var util = require("./util.js");  //utils函数
var wcache = require("./wcache.js") //引入缓存的机制

var logNew = util.logNew

//07.23事件的参数key
var eventKey = {
	channle: 'channle',
}
//返回一个对象格式
var resultName = function(bannerMta, name) {
	if(!bannerMta && !name){
		return
	}
	var stringJson ='{"'+ name +'": ""}';  //通过JSON.parse，把字符串转成一个对象
	var result = JSON.parse(stringJson);
	result[name]= bannerMta
	return result
}

//08.16新增，渠道来源，新增Uv和Pv
var returnChannle = function(sData) {
//	var that = sData.page
	var that = this
	var options = that.data.optionsFrome
	//渠道来源的数据
	var result = {
		appId: '',
		extra: '',
		query: '',
	}
//	var eventValue = ''
	//传递过来的参数
//	var options = sData.options
	if(options.referrerInfo) {
		//当场景为由从另一个小程序或公众号或App打开时，返回此字段
		var referrerInfo = options.referrerInfo
		if(referrerInfo.appId) {
			var appId = referrerInfo.appId
			result.appId = appId
			//这里是key的值
//			eventValue += appId	
			
			if(referrerInfo.extraData) {
				var extraData = referrerInfo.extraData
				if(extraData.source) {
					var source = extraData.source
//					eventValue += `_${source}`
					result.extra = source
				}	
			}
			
			//07.24新增如果是落地参数，就使用下面的方法
			if(options.query) {
				var query = options.query
				if(query.source) {
					var sourceNew = query.source
//					eventValue += `_${sourceNew}`
					result.query = sourceNew
				}
			}
			
			
			//10.25新增，新设置一个渠道的来源(优先取带在链接后面的。或者取放在extra里面的参数)
			result.source = result.query || result.extra
		}
	}
//	log('渠道来源的数据', result)
	//返回一个对象
	return result
}

var channle = function() {
	var that = this
	//返回的是一个对象
	let returnResult = []
	//这里的是渠道的那些信息
//	var returnData = returnChannle(sData)
	var returnData = that.returnChannle()
	
	//10.25新增统计保存再app.data.里面)
	that.data.returnDataNew = returnData
	log('统计获取的对象', returnData)
	var eventValue = ''
	for(var key in returnData) {
		let a = returnData[key]
		if(a) {
			eventValue = eventValue + '_' + a
		}
	}
	
	
	//原来的统计数据
	//事件id标示
	var id = that.data.logmsg.mtaId
	if(eventValue) {
		var result = resultName(eventValue, eventKey.channle)
		if(result) {
			log(`渠道来源统计-事件id: ${id}+事件参数的key: ${JSON.stringify(result)}`)
			that.mta.Event.stat(id, result)
		}
	}

	//08.16新增，渠道统计
	that.sendMta(returnData)
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//08.16新增，渠道统计
//发送一些请求去腾讯统计那边
var sendMta = function(res) {
	var that = this
//	log('统计数据sendMta', res)
	var appid = res.appId
	if(appid) {
		//发送请求，所有进来的用户
		that.data.appidMta = appid
		
		//发送渠道来源的参数
		that.sendMtaData(res)
		//所有的用户
		that.mtaAll('intoPerson')
		
		//-------------------------------
		//11.26修改,如果是新用户再发，否则不用发送，不用去请求登录的接口
		if(that.data.is_new == 'new') {
			//			//发送统计到后台去,新用户的
			that.mtaAll('intoNewPerson')
		}
		return	
		//-------------------------------
		
//		//10.19新增，如果是新用户，就不去发送请求了
//		log('是否是新用户', that.data.is_new)
//		if(that.data.is_new == 'old') {
//			return 
//		} else if(that.data.is_new == 'new') {
//			//10.23修改，這里不用发，因为是统计的授权的新用户，而不是新用户的数量
//			//			//发送统计到后台去,新用户的
//			that.mtaAll('intoNewPerson')
//			return
//		} 
//		
//		//如果为空，说明还没有请求过
//		let wxLogin = isWx.wxLogin()
//		//发送请求去后台
//		wxLogin.then(function(res) {
////			log('code', res.code)
//			var code = res.code
//			//传code给后台，判断是否是新用户
//			that.idNewUsers(code)
//			//去登录
//		}).catch(function(res) {
//			
//		})
	}
}

//登录接口去判断是否是新用户
var idNewUsers = function(code) {
	var that = this
	var WECHAT_AUTH = that.data.WECHAT_AUTH
	var model = {
		url : WECHAT_AUTH,
		data: {
			code: code,
		},
	}
	let loginNew = wxRequest.ajaxNew(model)
	loginNew.then(function(res) {
		log('判断是否是新用户，请求登录接口', res)
		let c = res.c
		if(c == 0) {
			//请求成功,后台有返回数据
			let d = res.d || {}
			var is_new_user = d.user.is_new_user
			log('是否是新用户', is_new_user)
			
			//10.19新增保存是否是新用户
			that.saveNewUser.save(is_new_user)
			
			//如果是1，说明是新用户
			if(is_new_user) {
				//发送统计到后台去
				that.mtaAll('intoNewPerson')
			}
		} else {
			console.error(res)
		}
	}).catch(function(res) {
		console.error(res)
	})
}

//事件对应的value
var eventNew = {
	'intoPerson' : '总的用户',
	'intoNewPerson' : '进入的新用户',
	'intoNewAccredit' : '授权成功的新用户',
}
//发送渠道的参数统计
var sendMtaData = function(res) {
	//加入到app里面去
	var that = this
	res = res || {}
//	var result = {
//		appId: '',
//		extra: '',
//		query: '',
//	}
	var extra = res.extra
	var query = res.query
	if(extra) {
//		that.commonMta('extra_' + extra)
		that.commonMta(extra)
	}
	if(query) {
//		that.commonMta('query_' + query)
		that.commonMta(query)
	}
}
//所有的事件(总用户，新用户，授权用户)
var mtaAll = function(type) {
	//加入到app里面去
	var that = this
	
	
	var value = that.eventNew[type]
	that.commonMta(value)

	//10.23新增统计
	that.channelsNew(type)
}
//通用的发送统计
var commonMta = function(value) {
	//如果没有value，直接返回
	if(!value) {
		return
	}
	
	//加入到app里面去
	var that = this
	var id = that.data.logmsg.mtaChannle
	var appidMta = that.data.appidMta
	//如果没有appid，直接返回
	if(!appidMta) {
		return
	}

//	var value = that.eventNew[type]
	//拼接数据
	var result = resultName(value, appidMta)
//	log(id, value, appidMta, result)
	log(`渠道来源新增用户统计-事件id: ${id}+事件参数的key: ${JSON.stringify(result)}`)
	//设置数据
	that.mta.Event.stat(id, result)
}


//授权判断是否是新用户
var isAccreditNew = function(res, logMSG) {
	var that = this
	var data = res.data || {}
	let is_new_user = data.d.user.is_new_user
	
	//09.07新增数据
	that.saveNewUser.save(is_new_user)
	
	logMSG = logMSG || {}
	var iv = logMSG.iv
	if(!iv) {
		//如果没有，说明没有授权，直接返回
		return
	}

	log('授权的是否是新用户', is_new_user)
	that.data.is_new_user = is_new_user
	if(is_new_user) {
		//发送请求，这个是授权的
		that.mtaAll('intoNewAccredit')
	} else {
		//发送请求，這个是旧的授权用户
		that.mtaAll('intoOldAccredit')
	}
}


//09.07存在本地,然后每次进来都去拿取本地数据（這个是放在app.js里面的）
var saveNewUser = function() {
	var that = this
	var result = {
		save: function(data) {
			var self = this
			
			//11.19新增，再第二次登录的时候，不去判断新用户（说明已经设置过了，不去判断了）
			var is_new_user = that.data.is_new_user 
			if(that.data.is_new_user == 1) {
				//不去做判断
				return 
			}
			
			var nextDayTime = wcache.nextDayTime() //获取距离下一天的时间
			//说明是第二次了
			wcache.put('isNewUser', data, nextDayTime) //说明是第二次	
			
			//10.19新增保存是否是新用户
			self.saveNew(data)
		},
		get: function() {
			var self = this
			//获取本地数据,一天的缓存时间
			var is_new_user = wcache.get('isNewUser')
			that.data.is_new_user = is_new_user
			log('--获取新旧用户--', that.data.is_new_user)
					
			//10.19新增是否是新用户的判断
			self.getNew()
		},
		//10.19新增数据
		saveNew: function(isNew) {
			var self = this
//			isNew是0的话,不用去发送请求了
//			如果是1的话,需要发送新用户的请求
			//存新的名字，防止有影响
			if(isNew == 1) {
				//新用户，存本地
				wcache.put('isNew', 'new', wcache.nextDayTime()) 
			} else if(isNew == 0) {
				//旧用户，存本地,永久信息
				wcache.put('isNew', 'old') 
			}
		},
		getNew: function() {
			var self = this
			//获取本地数据,一天的缓存时间
			var is_new = wcache.get('isNew')
			that.data.is_new = is_new
			log('本地的新旧用户判断', that.data.is_new)
		},
	}
	that.saveNewUser = result
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
//10.23新增统计
//2.//id: channels
//后面都跟渠道的标志
//source: xxxxxx  //所有的用户
//newsource 新用户
//cpa 新授权用户
//oldcpa 旧授权用户
//事件对应的value
var channelsEvent = {
	'intoPerson' : 'source',
	'intoNewPerson' : 'newsource',
	'intoNewAccredit' : 'cpa',
	'intoOldAccredit' : 'oldcpa',
}
////传的第一个参数是前面的key的值(取上面4个值)，后面的是渠道来源的名字
var channelsNew = function(type) {
	var that = this
	var id = 'channels'
	
	if(!type) {
		return
	}

	var value = that.channelsEvent[type]
//	log('统计type', type, value)
	//10.25修改获取的渠道来源
	var returnDataNew = that.data.returnDataNew
	var source = returnDataNew.source
	
//	log('统计123', returnDataNew)
	that.commonMtaNew(id, value, source)
}

module.exports = {
	channle,
	sendMta,
	returnChannle,
	idNewUsers,
	eventNew,
	commonMta,
	mtaAll,
	sendMtaData,
	isAccreditNew,
	saveNewUser,
	//10.23新增统计数据
	channelsEvent,
	channelsNew,
}