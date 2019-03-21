var util = require("./util.js") 
var log = console.log.bind(console)

const characters ='的一是了我不人在他有这个上们来到时大地为子中你说生国年着就那和要她出也得里后自以会家可下而过天去能对小多然于心学幺之都好看起发当没成只如事把还用第样道想作种开美总从无情己面最女但现前些所同日手又行意动方期它头经长儿回位分爱老因很给名法间斯知世什两次使身者被高已亲其进此话常与活正感见明问力理尔点文几定本公特做外孩相西果走将月十实向声车全信重三机工物气每并别真打太新比才便夫再书部水像眼等体却加电主界门利海受听表德少克代员许稜先口由死安写性马光白或住难望教命花结乐色更拉东神记处让母父应直字场平报友关放至张认接告入笑内英军候民岁往何度山觉路带万男边风解叫任金快原吃妈变通师立象数四失满战远格士音轻目条呢病始达深完今提求清王化空业思切怎非找片罗钱吗语元喜曾离飞科言干流欢约各即指合反题必该论交终林请医晚制球决传画保读运及则房早院量苦火布品近坐产答星精视五连司巴奇管类未朋且婚台夜青北队久乎越观落尽形影红爸百令周吧识步希亚术留市半热送兴造谈容极随演收首根讲整式取照办强石古华拿计您装似足双妻尼转诉米称丽客南领节衣站黑刻统断福城故历惊脸选包紧争另建维绝树系伤示愿持千史谁准联妇纪基买志静阿诗独复痛消社算义竟确酒需单治卡幸兰念举仅钟怕共毛句息功官待究跟穿室易游程号居考突皮哪费倒价图具刚脑永歌响商礼细专黄块脚味灵改据般破引食仍存众注笔甚某沉血备习校默务土微娘须试怀料调广苏显赛查密议底列富梦错座参八除跑亮假印设线温虽掉京初养香停际致阳纸李纳验助激够严证帝饭忘趣支春集丈木研班普导顿睡展跳获艺六波察群皇段急庭创区奥器谢弟店否害草排背止组州朝封睛板角况曲馆育忙质河续哥呼若推境遇雨标姐充围案伦护冷警贝着雪索剧啊船险烟依斗值帮汉慢佛肯闻唱沙局伯族低玩资屋击速顾泪洲团圣旁堂兵七露园牛哭旅街劳型烈姑陈莫鱼异抱宝权鲁简态级票怪寻杀律胜份汽右洋范床舞秘午登楼贵吸责例追较职属渐左录丝牙党继托赶章智冲叶胡吉卖坚喝肉遗救修松临藏担戏善卫药悲敢靠伊村戴词森耳差短祖云规窗散迷油旧适乡架恩投弹铁博雷府压超负勒杂醒洗采毫嘴毕九冰既状乱景席珍童顶派素脱农疑练野按犯拍征坏骨余承置彩灯巨琴免环姆暗换技翻束增忍餐洛塞缺忆判欧层付阵批岛项狗休懂武革良恶恋委拥娜妙探呀营退摇弄桌熟诺宣银势奖宫忽套康供优课鸟喊降夏困刘罪亡鞋健模败伴守挥鲜财孤枪禁恐伙杰迹妹遍盖副坦牌江顺秋萨菜划授归浪听凡预奶雄升编典袋莱含盛济蒙棋端腿招释介烧误';
//返回一个随机数组（包含正确答案）
var returnWords = function(text) {
	//选项区的长度
	var chooseLen = 8
	
	//需要输入正确答案
//	var text = '天方夜谭'
	var textLen = text.length
	//// 初始化选择区
	const characterList = util.arr_random(characters, chooseLen, true)
	.map((v, k) => ({
	    text: v,
	    id: k,
	    state: 0
	}))
	// 获取答案索引
	let answerIndex;
	if (textLen > 1) {
	  answerIndex = util.arr_random(characterList.length, textLen, true);
	} else {
	  answerIndex = [0];
	}
	// 将答案赋予给选择区
	answerIndex.forEach((v, k) => {
	  characterList[v].text = text[k];
	});
	
	//19.2.21,需要返回的是一个对象
	var result = []
	for(var i = 0; i < chooseLen; i++) {
		var choose = characterList[i].text
		result.push(choose)
	}
	return result
}

//19.2.15新增，设置用户本地数据(获取用户数据)
//import content from './utils/content.js';
var content = require("./content.js")

//2.22新增缓存内容
var wcache = require("./wcache.js") 

let prom;
//设置userInfo的值
var aboutUserInfo = {
	get: function() {
		var app = getApp()
		var self = this
		//获取用户值
		var userInfo = wcache.get('userInfo')
		if(!userInfo) {
			userInfo = {
				powerValue: 16,
				balance: 0,
			}
		}
		//19.2.22新增，这里需要转成json
		if(typeof userInfo == 'string') {
			userInfo = JSON.parse(userInfo)
		}
		app.data.userInfo = userInfo
		return userInfo
	},
	//改变用户的值,并保存在本地
	change: function(type, vlaue) {
		var self = this
		var userInfo = self.get()
		
		vlaue = vlaue || 0
		vlaue = Number(vlaue) 
		log(9999, typeof vlaue)
		//如果是余额，取后2位数
		if(type == 'balance') {
			//
//			vlaue = (Math.round(vlaue * 100) / 100)
			vlaue = vlaue.toFixed(2)
		}
		
		userInfo[type] = vlaue
		//19.2.22新增，这里需要转成string存在本地
		userInfo = JSON.stringify(userInfo)
		
		wcache.put('userInfo', userInfo)
	}
}


export default ((api, data) => {
	let app = getApp()
  console.log('请求', api, data);

  switch (api) {
  	/**
     *获取配置相关
     *
    */
    case 'GETCONFIG':
    	//获取用户值
		var userInfo = aboutUserInfo.get()
		prom = userInfo
    break;
    /**
     *获取能量值（相关）
     *
    */
    case 'POWER_API':
		var type = data.type  //3个类型，2是增加add，3是减少能量值reduce
		var value = Number(data.value) 
		var userInfo = aboutUserInfo.get()
		var powerValue = userInfo.powerValue || 0	
		if(type == 'add') {
			powerValue += value
		} else {
			powerValue -= value
		}
		//设置成0
		if(powerValue < 0) {
			powerValue = 0
		}
		aboutUserInfo.change('powerValue', powerValue)
		//最后的返回值
		prom = aboutUserInfo.get()
      break;
//  清空能量值（相关）
	case 'CLEAR_POWER_API':
		var balance = app.data.userInfo.balance
		//把用户的余额，加上原来的能量值
		var userInfo = aboutUserInfo.get()
		var powerValue = userInfo.powerValue || 0
		powerValue = Number(powerValue)
		powerValue += balance
		//并保存在本地
		aboutUserInfo.change('powerValue', powerValue)
		aboutUserInfo.change('balance', 0)
		aboutUserInfo.change('isClearBalance', 1)
		//最后的返回值
		prom = aboutUserInfo.get()
      break;
    /**
     *获取余额（相关）
     *
    */
    case 'BALANCE_API':
		var type = data.type  //3个类型，2是增加add，3是减少能量值reduce
		var value = Number(data.value) 
		var userInfo = aboutUserInfo.get()
		var balance = userInfo.balance || 0	
		balance = Number(balance) 
		if(type == 'add') {
			balance += value
		} else {
			balance -= value
		}
		//设置成0
		if(balance < 0) {
			balance = 0
		}
		aboutUserInfo.change('balance', balance)
		log('balance', balance)
		//最后的返回值
		prom = aboutUserInfo.get()
      break;
    
    /**
     *查看答案相关
     *
    */
    case 'LOOK_ANSWER':
		var userInfo = aboutUserInfo.get()
		var powerValue = userInfo.powerValue || 0
		powerValue = Number(powerValue)
		var result = 'fail'
		var deductNum = content.levels.deductNum
		if(powerValue >= deductNum) {
			//扣除音符
			result = 'succeed'
			aboutUserInfo.change('powerValue', powerValue - deductNum)
		}
		prom = result
      break;
    /**
     *获取题目
     */
    case 'guess':
    	//2.根据id来了截取题目(截取长度)
		var passNum = data.passNum
		//4.新增判断用户的等级和星星等等
		var userData = content.judge.judgeStar(passNum)
		
		if(passNum > content.levels.timuLen) {
    		prom = {
    			isPass: 1,
    			userData,
    		}
   		} else { 	
		
		//1.先获取所有的题目
		var allContent = content.content
		
		var copyArray = allContent[passNum - 1]
		var nowTimu = JSON.parse(JSON.stringify(copyArray))
		//2.转换成需要的格式
//		nowTimu.words = nowTimu.answer.split('')  //转成对象
		var answer = nowTimu.answer
		nowTimu.name = answer
		nowTimu.words = returnWords(answer)
//		nowTimu.question = '../../covers/' +nowTimu.question //增加地址
		nowTimu.question = 'https://static.zuiqiangyingyu.cn/wb_webview/baiduchengyu_covers/' +nowTimu.question //增加地址
		nowTimu.num_answer = answer.length //增加地址
		
		//3.设置后，直接返回
		//原来的数据结构，直接替换题目就可以了
		var result = {
			"list":[
	            {
//	                "id":"2689",
//	                "pass":78,
//	                "file":"https://static.zuiqiangyingyu.cn/guess/ff594da37ee37ee728b8ecab04b9dceb.mp3",
//	                "file2":"https://static.zuiqiangyingyu.cn/guess/7fa0dbe40dbc4031796ea85b97888018.mp3",
//	                "answer":"痒",
//	                "num_answer":"1",
//	                "artist":"黄龄",
//	                "origin":"",
//	                "img":"",
//	                "prompt":"",
//	                "words":[
//	                    "回",
//	                    "的",
//	                    "吃",
//	                    "痒",
//	                    "待",
//	                    "来",
//	                    "挂",
//	                    "情",
//	                    "国",
//	                    "症"
//	                ],
	            }
	        ],
//	        {
//	        	showStar,
//	        	level,
//	        	levelName,
//	        }
	        userData,
	        "user":{
	            "uid": 586343,
	            "pass_next": passNum,  //用户当前的题目数量
	            "score": "235",
	            "prompt_num": 0,
	            "total_pass": 5242,
	            "level": 1,
	            "star": 1,
	        },
		}
		result.list[0] = nowTimu
		//19.2.21新增，这里需深复制一份，不然会有影响
		var copyArray1 = JSON.parse(JSON.stringify(result))
		prom =copyArray1
	}
      break;

    

    default:
      throw new Error('无此api');
 }
  	
	//返回一个promise对象
	return	new Promise(function (resolve, reject) {
        resolve({
        	data:  {
			    "c":"0",
			    "m":"",
			    "d": prom,
			},
        })
    });
});