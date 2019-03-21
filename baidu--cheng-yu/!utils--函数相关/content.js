//所有题目数据
import {content} from './data';

var util = require("./util.js") 
var log = console.log.bind(console)
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//let starNumber = 4 //多少颗星星
let starNumber = 1 //多少颗星星
let gateNumber = 9 //每颗星星的关卡数
let timuNum = 10 //每关卡的数量
let eachgate = gateNumber * timuNum //每颗星星增加的题目数量 90
let eachPass = starNumber * gateNumber * timuNum //每等级总的题目数量360
//let names = ['书童', '秀才', '举人'] //所有的等级
var names = ['书童', '秀才', '举人', '探花', '榜眼', '状元', '学士', '太傅', '太师', '圣贤'] //所有的等级
let len = names.length  //等级的长度
let maxTimu = len * eachPass  //所有等级最大的题目
//关于用户的等级（用于切换等级弹窗）---//返回等级相关
var levels = {
	starNumber,  //多少颗星星
	gateNumber, //每颗星星的关卡数
	timuNum, //每关卡的数量
	eachgate, //每颗星星增加的题目数量 90
	eachPass, //每等级总的题目数量
	names,  //所有的等级
	len,  //等级的长度
	maxTimu, //最大的题目数
	
	timuLen: content.length, //题库的最长长度
	
	deductNum: 8, //每次扣除的能量值
	//提现金额相关
	withdraw: {
		max: 28,  //超过的上限， 超过直接，就转能量值
		min: 26, //超过的下限
		last: 30, // 达到提现的金额数量
	},
}


log('-总的题目长度-', content.length)

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//utils生成从minNum到maxNum的随机数（取的是整数，所以需要取小数点的时候，乘以10。再在结果除以10）
function randomNum(minNum, maxNum, decimalPlaces){
	//decimalPlaces是返回小数点后几位数
	if(decimalPlaces) {
		minNum = minNum * 10 * decimalPlaces
		maxNum = maxNum * 10 * decimalPlaces
	}
	let result = parseInt(Math.random()*(maxNum-minNum+1)+minNum,10)
	//如果是小数点，需要相除
	if(decimalPlaces) {
		result = result / (10 * decimalPlaces).toFixed(decimalPlaces)
	}
    return result
}


//19.2.22新增，把值都放到app.data.userInfo里面
//获得能量值的范围
//var getEnergyRange = function(energy) {
var getEnergyRange = function(energy) {
	let app = getApp()
	if(energy) {
		//根据app里的值来判断
		energy = app.data.userInfo.powerValue
	}
	
	let result = {
		multiple: 1.5, //用户的倍数
		energyNum: 7, //能量值
	}
	//根据用户现用的能量值
//	var energy = 
	if(energy < 8) {
		result.multiple = randomNum(1.5, 5, 1)
		result.energyNum = randomNum(7, 8)
	} else if(8 <= energy && energy  <= 16) {
		result.multiple = randomNum(5.5, 7.0, 1)
		result.energyNum = randomNum(5, 6)
	} else if(17 <= energy && energy <= 24) {
		result.multiple = randomNum(7.5, 9.5, 1)
		result.energyNum = randomNum(4, 5)
	} else {
		result.multiple = 10
		result.energyNum = randomNum(2, 4)
	}
	
	log('getEnergyRange', result)
	//返回的能量值
	return result
}

//获得红包范围：
var getRedRange = function(red) {
	var app = getApp()
	if(red) {
		//根据app里的值来判断
		red = app.data.userInfo.balance || 0
	}
	
	let result = randomNum(0.1, 0.2, 1)
	//根据用户现用的余额
	red = red || 0
	red = Number(red)
	
	if(red <= 5) {
		result = randomNum(1.5, 2.0, 1)
	} else if(6 <= red && red <= 10) {
		result = randomNum(0.5, 1.5, 1)
	} else if(11 <= red && red <= 15) {
		result = randomNum(1.0, 2.0, 1)
	} else if(16 <= red && red <= 20) {
		result = randomNum(0.4, 0.8, 1)
	} else if(21 <= red && red <= 25) {
		result = randomNum(0.2, 0.4, 1)
	}
	
	log('getRedRange', result, red)
	//返回的红包值
	return result
}

//红包/礼包出现的情况：逢6尾数的关卡出现
var appearRedGift = function(passTimu) {
	var that = this
	var result = false
//		var passTimu = that.data.subject.pass || 0
	passTimu = Number(passTimu)
	//1-100 (逢6尾数)
	//101-500 (十位数为双数, 个位数为6)
	//501- (十位数逢4和8, 个位数为6)
	if(passTimu <= 100) {
		passTimu = '' + passTimu
		if(passTimu.slice(-1) == 6) {
			result = true
		}
	} else if(passTimu < 500) {
		passTimu = '' + passTimu
		if(passTimu.slice(-1) == 6 && Number(passTimu.slice(-2, -1)) %2 == 0) {
			result = true
		}
	} else {
		passTimu = '' + passTimu
		var tiuus = ['4', '8']
		var tiuu = tiuus.indexOf(passTimu.slice(-2, -1))
		if(passTimu.slice(-1) == 6 && tiuu > -1) {
			result = true
		}
	}
	log('是否在指定题目，出现红包/礼包 ', result)
	return result
}

//宝箱弹窗出现的情况：逢3尾数的关卡出现
var appearBox = function(passTimu) {
	let result = false
//		var passTimu = that.data.subject.pass || 0
	passTimu = Number(passTimu)
	//1-100 (逢3尾数, 13题后出现)
	if(passTimu < 13) {
		return false
	}
	//101—— (十位数为双数, 个位数为6)
	if(passTimu <= 100) {
		passTimu = '' + passTimu
		if(passTimu.slice(-1) == 3) {
			result = true
		}
	} else {
		passTimu = '' + passTimu
		if(passTimu.slice(-1) == 3 && Number(passTimu.slice(-2, -1)) %2 == 0) {
			result = true
		}
	}
	log('是否在指定题目,出现宝箱', result)
	return result
}

//判断是升级或通关
var upgradeOrPass = function(passTimu) {
//	0是显示正常的模式,1是升级了,2是通关了
	let result = 'common'
	passTimu = Number(passTimu)
	//如果是回答了全部题目(就直接显示通关)
	if(passTimu > levels.timuLen) {
		//说明回答了全部的题目
		result = 'player'
		return result
	}
	//如果是10的倍数，说明解锁了
	if(passTimu % timuNum==0) {
		//10关就解锁了
		result = 'unlock'
	}
	log('upgradeOrPass', result)
	return result
}

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
////根据用户的信息,来返回当前的的等级和星星数量
//var setData = function(passNum) {
//	passNum = Number(passNum)
//}
var judge = {
	//判断星星的显示
	  judgeStar: function(num) {
	  	var self = this
	  	num = Number(num)
	  	var eachPass = levels.eachPass //360道题目
	  	var eachgate = levels.eachgate //90道题目一颗星星 
	  	//获取用户的等级
	  	var userLevel = self.judgeLevel(num)
	  	var level = userLevel.level - 1
	  	//1.先减去360的倍数
//	  	2.是90的几倍,就是几颗星星数
		var differ = num - (eachPass * level) 
		var showStar = parseInt(differ / eachgate) || 0
		//特殊处理如果是整除的，需要减去1。因为是在上一个区间内
		if(differ % eachgate == 0) {
			showStar -= 1
		}
		
		//3.返回最后的结果：加上用户的星星
//	  	//这里的等级比实际的第一级，所以直接加上就好了
		showStar += 1
		userLevel.showStar = showStar
		
		//19.2.22新增，统一放到这个里面去(当前的是多少关（在10的多少倍里）)
		var judgeCheckpoints = self.judgeCheckpoints(num)
		userLevel.divide = judgeCheckpoints
		
		log('--userJudge--', userLevel)
		return userLevel  	
	  },
	  //判断用户的等级
	  judgeLevel: function(num) {
	  	var self = this
	  	num = Number(num)
	  	var eachPass = levels.eachPass //360道题目 	
		//	丢弃小数部分,保留整数部分 （默认给的是0）
		var level = 0
		//这里的等级需要超过360才可以生等级
		if(num >= eachPass) {
			level = parseInt(num / eachPass)
			//如果是整除的，需要减去1。因为是在上一个区间内
			if(num % eachPass == 0) {
				level -= 1
			}
		}
		//获取用户等级名字
	  	var levelName = levels.names[level]
	  	if(level >= levels.len) {
	  		return
	  	}
//	  	//这里的等级比实际的第一级，所以直接加上就好了
	  	level += 1
	  	//设置用户的等级
	  	let result = {
	  		level: level,  
	  		levelName,
	  	}
	  	return result
	  },
	  //判断用户在第几关(10的倍数)
	  judgeCheckpoints : function(num) {
	  	var self = this
	  	num = Number(num)
	  	//判断是10的几倍，然后再哪个区间内
	  	//获取用户的等级
	  	var userLevel = self.judgeLevel(num)
	  	var level = userLevel.level - 1
	  	
	  	//1.先减去360的倍数，
	  	var subtract = num - (level * levels.eachPass)
//	  	2.然后除以10，看是10的几倍
	  	var divide = parseInt(subtract / levels.timuNum)
	  	//如果是整除的，需要减去1。因为是在上一个区间内
		if(subtract % levels.timuNum == 0) {
			divide -= 1
		}
		divide += 1
	  	log('divide', divide)
	  	return divide
	  }
}



/////////////////////////////////////////////
//设置顶部轮播的效果
let namestr =
  '小范,任t,双重人格,张三金,孤独成瘾,老肥铁锤,柳柳柳,如虎添轶,大大,红姐,卢大包,羽妈妈,孙亚哲,悠然若雪,不曾停留,清柠,丽,无所谓,边明英,快乐,言叶之庭,董金萍,梅,甜蜜蜜,常青树,樱花星宇,南柚,峰阳熏鸡架,刘勇,莹光闪烁,先生,事事如意,英子,暖阳,蓝天,茶里加芋圆,善,锁菲娅,冉冉,平安是福,小能能,老妈,广廿尺,封不觉,忘忧草,奶糖,鄂叶明天,葳蕤,大灵儿,曼曼,浅夏幽莲,张涛,微笑,天狼星,梦岑,白菜^杨倩,永远幸福,茹茹^O^,温小萜,淡如水,漫珠沙华,北辰呀,夏天的美景,美丽人生,洋,我爱我家,田,微笑面对,从蓉,红玫瑰,哈,西槿亦,开心就是福,萍水相逢,樱影*残雪,遇述琼花,胡先生,年轻魄魄子,红红,阿坤,王宁,美好生活,主爱长存,真的很烦,未来星,电气焊,阿郑,背包客,星辰为盟,加油,咫尺へ天涯,崔昊辰,套路一波,熊,皓皓,半生流离ぶ,张玉,记昨日书,小清新,付老丝,心已凉,百年孤独,宁宁,郑招丰,姚苒,如果、当时,半夏知秋,阿狸爸爸,听你说我,别致,緈諨ぁ约锭,小高……,嗯哼,朱承贵,可  乐,杀了你哦,夏敬波,抛物线,彭于晏,晓～,明天会更好,西瓜,芳,胖虎,秋风扫落叶,王振華,耕耘幸福,吴柯,宝,陈磊,安河桥北,藏,枫林听雨,郭德浩,紫月乖宝,晔,熱河,自由悍将,山河之书,欣大壮壮,烟火,啊哟喂,泪痕,团团圆圆,平凡,泡发了,少女与猫,明天会更好,金宁,老王,扣扣,老徐,慧,天道酬勤,简单幸福,时玉佳,刻骨銘心,那時年少,丿可乐,幸福一生,恩子,大雄,想,蛋宝小黑马,張國榮,小宇宙,五生人,湁栺緊釦,不孬,天真有邪,桃花旭再,燕子,平安是福,栀夏°,小忽悠,开心一笑,娜娜哒娜,嘟嘟,天晴,甜蜜蜜,张劲松,敏,卡布奇洛,郝旭元,陈丽莎,知足常乐,陌上,杨志杰,建英,与狼共舞,我思故我信,家有儿女,荣儿,栀子花香,梦琪紫蝶,凉凉,初音未来,松CWS,念旧,春天来了,于时香,蓝天,半神之弓,小龙猫,多多,淘气鬼,陈利刚,小Su,丹桂飘香,徐秋悦爸爸,独自承担,上善若水,流光星辰,朱艺蓉,璃陌汐鄢,幸福一家,悦,涵涵,卢碧,莎莎,自由飞翔,琪琳,烟花巷陌ベ,梦奇,郭卫宗,厌浥,琉璃～彩晶,满天星,张英琦,小宝贝,宋九明,梦幻,书韵,久艳,燕子,谢丽琼,点点,邓仕兵,九爷,沂橙爱,人生忐忑路,姒叶,狼,惜缘,海马庄园,拥抱951,阳,周志新,桂叶,可可,快乐,芊芊笑,北玄,李纯勋,冷风_,有人才有路,贾依晴,艳子,尘埃落定,珍妮,阿汤,未来的我,似是故人来,感谢经历,刘国生,暁苼吥䴭,痞猫,刘世珍,野蛮,彤彤,衍钺,阳光,浅夏安然,咳咳咳,王小花,银杏叶,回忆总想哭,张渣渣i,林俊杰_,鐵_驪,小太阳,长发已及腰,于占江,訶ZIYI,王子麟,莫欺少年穷,帅气小哥,小乐哥,小格,刘鹏钰,夕阳红,幸福人生,天宝哥,战者不败,我,铿锵玫瑰,邓丽云,回眸一笑,小强,爱上幸福,北叹,春天有爱,上善若氺,张子哲,苦笑,刘信科,小櫻,小妹,周梦渝,清,艳,橘迪,阳光普照,幼儿园老大,奇缘,冰淇淋,婵,摆渡人,郑晓宁,刘静怡,秋之蓝,暮.ins,简,条形马,赵蜓婷,咸鱼佩吉,空忆,执念,简单的幸福,盈利,江玲,卩峰哥灬,峰峰峰哈,老美人,嗯哼,狐说狐有狸,男人范er,大刚,小仙女,美食店,刘域家长,白玉花,浦城豪爵,乐乐奶,陈红丽,幸运妈,朱小飞,许治菊,仙人掌,新,蒋国昱,我的梦想,踏雪寻梅,赵爱萍,相忘不相忆,星空,碧,微笑,你冷吗,平安,太后娘娘,丹尼尔,海纳百川,第二梦,煙デ菋℡,心如止水,老赵,王梓溢,海洋,兰兰,刘哲,袁桂芝,易宇涵,曹,愫暮°,明明,杨氏农家乐,若若,茉莉,初一晨,李紫妍,平凡人生,重生,孙茂霞,流逝的岁月,时光走忧伤,星球王子,幸福一家人,梦之蓝,陈芷晴,檬主,小魔女~,成哥,陈萍,幸运草树丽,天籁童声,端桂琴,依依,惜别的海岸,哀家累了,周家小少爷,卢丽端,挑战自我,心相印,梦想,喜洋洋,心太累,李杨,小猪爸爸,含羞草,孜孜,大江,空城旧念,小先生,秀,小叮当,紫蔷薇,知足常乐,谢浩杰,芳芳,郁金香,嘻哈天王,罗桂香,杨俊康,柚子,斌,咸鱼翻身,好好学习,月光同赏,李敏,猪猪,简简单单,天天,瑶瑶妈,筱筱雨,晓宝,人生如梦,泉水,清新绿檬,杨洋,小草,忠心友义,曦之故里,欣茹紫水,家淇,陈怡伊,星辰,萱,念尘,十年之约,李俊林,刘志霞,美好的时光,善意的谎言,水滴石穿,灵儿,财哥,碧华,泰鑫,翁雪虹,初见如你,朱登峰,小瓶盖,秀丽江山,平安是福,柯西柯西,许梁,疯丫头,清风徐来,北斗星,芳,睿晗玲珑,小郑,妍妍,群群,滋滋有味,罗二姐,珍,崔鑫渊,那一个我,影子,孙嘉宁,惠质兰心,唐唐,凡人,慧,南岛孤城,张波,莎莎,晨花之羽,追光者,爱的天使,幸福一生,段军,张,丽丽,如如,南北,嘤嘤怪,苑苑';

let namestr1 = [
	'玩了成语后，出口都能成章',
	'成语大师如何练成，玩下去就知道了！',
	'想在好友圈出彩，多玩几关就知道了！',
	'好友：就这水平也想超过我？',
	'来吧，快来打败我，好友已超越你了！',
	'你的好友已经山顶等着你！',
	'加油骚年，超越你的好友吧！',
	'好厉害哦！',
	'位列第一，指日可待！',
	'满腹才华的就是你！',
	'准备好解锁新的等级了吗？'
]
var setLoopList = function(type) {
//	var result = util.GetArrTarge(namestr1)
	var result = namestr1
//	var result = util.getRandomArrayElements(namestr1, 10)	
	if(type == 1) {
		var namestrArr = namestr.split(',')
		var arr = [] 
		for(var i = 0; i < namestrArr.length; i++) {
			var a = {
				name: namestrArr[i],
				money: util.randomNumDecimal(10, 100, 2),
			}
			arr.push(a)
		}
		
//		result = util.getRandomArrayElements(arr, 50)
		result = util.getRandomArrayElements(arr, 10)
//		result = util.getRandomArrayElements(arr, 5)
	}
	
	log('-轮播内容-', result)
	return result
}

////测试函数
//var __main = function() {
////	judge.judgeStar(91)
////	upgradeOrPass(180)
////	judge.judgeCheckpoints(1)
////	judge.judgeCheckpoints(10)
////	judge.judgeCheckpoints(11)
////	judge.judgeCheckpoints(20)
////	judge.judgeCheckpoints(21)
////	judge.judgeCheckpoints(30)
////	judge.judgeCheckpoints(90)
////	judge.judgeCheckpoints(91)
////	judge.judgeCheckpoints(100)
////	judge.judgeCheckpoints(110)
////	judge.judgeCheckpoints(111)
////	judge.judgeCheckpoints(360)
////	judge.judgeCheckpoints(361)	
//	setLoopList(1)
//}
//__main()

module.exports = {
  content: content, 
  levels,  //关于用户的等级（用于切换等级弹窗）
  
  getEnergyRange, //获得能量值的范围
  getRedRange,//获得红包范围：
  appearRedGift, ////红包/礼包出现的情况：逢6尾数的关卡出现
  appearBox,//宝箱弹窗出现的情况：逢3尾数的关卡出现
  
  judge, //用户星星，等级判断函数
  upgradeOrPass,
  setLoopList,
}

