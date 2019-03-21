////////////////////////////////////////////////////////////////////////////////
//011.14新增腾讯统计数据
////////////////////////////////////////////////////////////////////////////////
//获取应用实例
var app = getApp()
var log = console.log.bind(console)

//需统计的所有名字
var mtas = {
	//	事件参数的value，每个都包含新用户、老用户、总用户。
	//新用户定义：当天猜歌达人新用户
	//名称举例：
	//1）展示引导开始-新
	//2）展示引导开始-老
	//3）展示引导开始-总
	////////////////////////////////////////////////////////////////////////////////
	chuangguan_mySong: '闯关_我的歌单',
	chuangguan_map: '闯关_关卡地图',
	chuangguan_sign: '闯关_每日签到',
	chuangguan_rank: '闯关_排行榜',
	chuangguan_play: '闯关_音乐开始',
	chuangguan_pause: '闯关_音乐暂停',
	chuangguan_hint: '闯关_提示',
	chuangguan_share: '闯关_分享看答案',
	chuangguan_answer: '闯关_答题区',
	chuangguan_reset: '闯关_清空',
	chuangguan_chooseArea: '闯关_选项区',
////////////////////////////////////////////////////////////////////////////////
	wodegedan_deal: '歌单_删除',
	wodegedan_share: '歌单_分享',
	wodegedan_play: '歌单_播放',
	wodegedan_pause: '歌单_暂停',
////////////////////////////////////////////////////////////////////////////////
	guankaditu_level: '关卡地图_任一关卡',
	guankaditu_start: '关卡地图_开始挑战',
////////////////////////////////////////////////////////////////////////////////
	paihangbang_share: '排行榜_炫耀战绩',
}
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
//腾讯统计的入口09119修改，直接调用方法就可以了
var statisticsAmendAll = {
		//提交腾讯统计（总的入口，直接调用submitMta方法就可以了）
		submitMta: function(name) {
			var self = this
			//如果没有，不去请求腾讯统计
			if(!name) {
				return
			}
			var bannerMta = mtas[name]
			//如果没有事件的value，直接返回，防止腾讯统计出现错误
			if(!bannerMta) {
				log('没有腾讯统计的值1')
				return
			}
			self.addIsUser(bannerMta)
		},
		//加上新旧用户信息
		addIsUser: function(bannerMta) {
			var self = this
			var is_new = app.data.is_new
			
			//1.如果没有，说明还没有登陆过，不去统计了。因为马上也会要登陆
			if(!is_new) {
				log('-腾讯统计-说明还没请求过登陆的接口-')
				return 
			}
			
			//2.发送总的用户请求(这里需要复制一份)
			var allBannerMta = bannerMta + '_all'
			log('--腾讯统计的值2--', allBannerMta)
			app.wondersdk.statevent(allBannerMta)
			
			//3.判断发送新旧用户的请求
			log('腾讯统计-是否是新用户', is_new)
			if(is_new == 'new') {
				//说明当天猜歌达人新用户
				var newBannerMta = bannerMta + '_new'
				log('--腾讯统计的值3--', newBannerMta)
				app.wondersdk.statevent(newBannerMta)
			}
		},
	}


///////////////////////////////////////////////////
///////////////////////////////////////////////////
//腾讯统计的入口09119修改，统计漏斗
var statisticsFunnel = {
	//新的通用的发送漏斗请求
	submitMtaNew: function(name, value, fun) {
		var self = this
		//如果没有，不去请求腾讯统计
		if(!name) {
			return
		}
		//把键值转成对象的形式
		var stringJson ='{"'+ value +'": ""}';
		var result = JSON.parse(stringJson); //通过JSON.parse，把字符串转成一个对象
		result[value]= true

		var id = name
		log(`腾讯统计事件id: ${id}+事件参数: ${JSON.stringify(result)}`)
		app.mta.Event.stat(id, result)
		
		//10.24新增回调函数
		if(typeof fun == 'function') {
			fun({
				name, 
				value,
			})
		}
	},
}


////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
//10.25 运营新增统计的需求
//這里是可以复用的函数
var sendData = function(source, value) {
	log('漏斗-腾讯统计', source, value)
	var is_new = app.data.is_new
	//1.如果没有，说明还没有登陆过，不去统计了。因为马上也会要登陆
	if(!is_new) {
		log('-漏斗腾讯统计-说明还没请求过登陆的接口-', is_new)
		return 
	}
	//3.判断发送新旧用户的请求
	log('是否是新用户', is_new)
	if(is_new != 'new') {
		log('-漏斗腾讯统计-说明不是当天猜歌达人新用户-', is_new)
		//说明不是当天猜歌达人新用户
		return 
	}
	
	//11.15新增一个进入第一关时的，不能清空的问题
	if(value == 'lv1') {
		sendFunnel(source, value)
		return
	}
	
////這里是处理，有没有发送过前一个lv
////用来处理，没有发送lv3的时候，不去发送lv。即前一步没有的时候，不发送下一步的请求
	//当前已经发送的漏斗
	var hasSendFunnel = app.data.hasSendFunnel[source] || 'lv0'	
	//新增一个函数，去判断是否有发送过前一个lv
	if(!hasSendLv(source, value, hasSendFunnel)) {
		return
	}

	sendFunnel(source, value)
}

var sendFunnel = function(source, value) {
	statisticsFunnel.submitMtaNew(source, value, function(obj) {
		//這里新的回调函数,用来存储已经发过的lv
		app.data.hasSendFunnel = app.data.hasSendFunnel || {}
		var key = obj.name
		var value = obj.value
		var str = `hasSendFunnel[${key}]`;
		app.data.hasSendFunnel[key] = value
//		log('漏斗腾讯统计', app.data.hasSendFunnel)
	})
}


//新增一个函数，去判断是否有发送过前一个lv
var hasSendLv = function(source, value, hasSendFunnel) {
	var result = true
	
//	這里是处理，有没有发送过前一个lv
//	用来处理，没有发送lv3的时候，不去发送lv。即前一步没有的时候，不发送下一步的请求
//	log('统计hasSendFunnel', app.data.hasSendFunnel)
//	var hasSendFunnel = app.data.hasSendFunnel[source] || 'lv0'	
	var num = hasSendFunnel.slice(2)
	num = Number(num) + 1
	var nextNum = 'lv' + num
	//说明前面没有发送前一个lv等级，可以继续发送了
	if(nextNum != value) {
		result = false
	}
//	log('统计result', result)
	return result
}

////////////////////////////////////////////////////////
//10.25运营鳗鱼新增，自10月26日上线新版后的新增用户闯关模式的数据（仅新增用户）
//1.进入首页,发送lv1
//2.点击选项区,发送lv2
//3.开始回答第2关,发送lv3
//4.开始回答第3关,发送lv4
//5.开始回答第5关,发送lv5
//6.开始回答第10关,发送lv6
//7.开始回答第20关,发送lv7
//8.开始回答第30关,发送lv8
//9.开始回答第50关,发送lv9
//10.开始回答第100关,发送lv10
//名字用'xinzengyonghuch'

//发送的示例
//statisticsFunnel.firstEnter('xinzengyonghuch', 'lv1')
//10.25鳗鱼新增 新用户，开始闯关就发送(显示就发送，不用通过)
var songNumMan = function(num) {
	if(!num) {
		//如果没有值，直接return 
		return
	}
	var result = {
//		'1': 'lv2',
		'2': 'lv3',
		'3': 'lv4',
		'5': 'lv5',
		'10': 'lv6',
		'20': 'lv7',
		'30': 'lv8',
		'50': 'lv9',
		'100': 'lv10',
	}
	var value = result[num] 
	channleFunnelTsjiMan(value)
}
//发送漏斗的请求
var channleFunnelTsjiMan = function(value) {
//	log('漏斗1', value)
	if(!value) {
		//如果没有值，直接return 
		return
	}
	var source = 'woyaocaigeming'
	//统一去发送
	sendData(source, value)
}


module.exports = {
	statisticsAmendAll,
	statisticsFunnel,
	
	//10.25运营鳗鱼新增，自10月26日上线新版后的新增用户，开始玩闯关模式的数据（仅新增用户）
	channleFunnelTsjiMan,
	songNumMan,
}
