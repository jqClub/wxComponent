////////////////////////////////////////////////////////////////////////////////
//09.06更新腾讯统计数据
////////////////////////////////////////////////////////////////////////////////
//获取应用实例
var app = getApp()
var log = console.log.bind(console)
var util = require("./util.js");

//需统计的所有名字
var mtas = {
	//	事件参数的value，每个都包含新用户、老用户、总用户。
	//新用户定义：当天猜歌达人新用户
	//名称举例：
	//1）展示引导开始-新
	//2）展示引导开始-老
	//3）展示引导开始-总
////////////////////////////////////////////////////////////////////////////////
//	09.06新手引导01（11.12新增，关闭新手引导功能）
//	xinshouyindao_guideShow: '展示引导开始',
//	xinshouyindao_guideStart: '【开始闯关】',
//	xinshouyindao_guideListen: '听歌【继续】',
//	xinshouyindao_guidePause: '暂停【继续】',
//	xinshouyindao_guideBreakUp: '歌名【继续】',
//	xinshouyindao_guideHint: '提示【开始】',
//	带上点击的文字。例如：单字【文字】告
//	xinshouyindao_guideCharacter: '单字【文字】',
//	xinshouyindao_guideComplete: '完成【谢谢】',
//	xinshouyindao_guideSkip: '【跳过】',
//	xinshouyindao_guideSkipAgree: '跳过【同意】',
////////////////////////////////////////////////////////////////////////////////
	//	09.06首页02
	shouye_indexShow: '展示首页',
	shouye_addNotes: '【增加音符】',
	shouye_rank: '【排行榜】',
	shouye_map: '【关卡地图】',
	shouye_collect: '【我的收藏】',
//	shouye_dayily: '【每日签到】', // 09.18修改首页，所以去掉這个统计
	shouye_taskCenter: '【通知中心】',
	shouye_welfareCenter: '【每天领音符】',
	
	shouye_battlePk: '【好友对战】',// 10.18新增好友对战按钮
	
	shouye_invitePerson: '【邀请有礼】',
	shouye_start: '【开始闯关】',
	shouye_gramophone: '【留声机】',
	//	带上APPID，例如“点击【icon1】andasjdasdas”
	shouye_icon1: '【icon1】',
	//	带上APPID，例如“点击【icon1】andasjdasdas”
	shouye_icon2: '【icon2】',
	shouye_match: '【排位赛】',
	shouye_god: '【蒙面歌神】',
	shouye_song: '【歌单闯关】',
	//	带上APPID，例如“点击【icon1】andasjdasdas”
	shouye_bottom1: '【bottom1】',
	//带上APPID，例如“点击【icon1】andasjdasdas”
	shouye_bottom2: '【bottom2】',
	//带上APPID，例如“点击【icon1】andasjdasdas”
	shouye_box: '【box】',
	shouye_Service: '【联系客服】',
	shouye_shareRigth: '【右上分享】',
////////////////////////////////////////////////////////////////////////////////
	//	09.06闯关03
	chuangguan_indexShow: '展示回答页',
	chuangguan_songAddNotes: '回答【＋音符】',
	chuangguan_songCollect: '回答【收藏】',
	chuangguan_songNoCollect: '回答【不收藏】',
	chuangguan_songHint: '回答【提示】',
	chuangguan_songAskHelp: '回答【求助】',
	chuangguan_songStartPlay: '回答【开播】',
	chuangguan_songPause: '回答【停播】',
	chuangguan_songEmpty: '回答【清空】',
	chuangguan_songPay: '支付【确认】',
	chuangguan_shareRigth: '回答【右上】',
	chuangguan_next: '结束【下一首】',
	chuangguan_ask: '结束【告诉感受',
	chuangguan_endShareRigth: '结束【右上】',
////////////////////////////////////////////////////////////////////////////////
	//	09.06排位赛04
	peiweisai_indexShow: '展示排位首页',
	peiweisai_seasonRewards: '首【赛季奖励',
	peiweisai_shareRigth: '首【右上分享',
	peiweisai_classic1: '首【音乐小白',
	peiweisai_classic2: '首【入门新手',
	peiweisai_classic3: '首【崭露头角',
	peiweisai_classic4: '首【闪耀新星',
	peiweisai_classic5: '首【锋芒毕露',
	peiweisai_classic6: '首【精通音律',
	peiweisai_classic7: '首【技冠群雄',
	peiweisai_classic8: '首【出神入化',
	peiweisai_classic9: '首【举世无双',
	peiweisai_classic10: '首【独步天下',
	peiweisai_classic11: '首【音乐大师',
	peiweisai_classic12: '首【荣耀至尊',
	//胜--败--平
	peiweisai_continueWin: '胜【继续挑战',
	peiweisai_shareWin: '胜【分享结果',
	peiweisai_retrospectWin: '胜【本局回顾',
	peiweisai_shareSongWin: '胜【分享歌单',
	peiweisai_continueLost: '败【继续挑战',
	peiweisai_shareLost: '败【分享结果',
	peiweisai_retrospectLost: '败【本局回顾',
	peiweisai_shareSongLost: '败【分享歌单',
	peiweisai_continueDogfall: '平【继续挑战',
	peiweisai_shareDogfall: '平【分享结果',
	peiweisai_retrospectDogfall: '平【本局回顾',
	peiweisai_shareSongDogfall: '平【分享歌单',

	peiweisai_endShareRigth: '结束【右上】',
////////////////////////////////////////////////////////////////////////////////
	//	09.06蒙面歌神05
	mengmiangeshen_indexShow: '展示首页',
	mengmiangeshen_indexPlayMethod: '首页【说明】',
	mengmiangeshen_indexRank: '首页【排名】',
	mengmiangeshen_indexPrize: '首页【奖品】',
	mengmiangeshen_indexStart: '首页【开始】',
	mengmiangeshen_indexInvite: '首页【邀请】',
	mengmiangeshen_shareRigth: '首页【右上分享',
	mengmiangeshen_showFirstPop: '第一名弹窗',
	mengmiangeshen_showeLiminated: '被淘汰弹窗',
	mengmiangeshen_firstPopShare: '第一名【分享】',
	mengmiangeshen_liminatedShare: '被淘汰【分享】',
	mengmiangeshen_endShare: '结束页【右上】',
////////////////////////////////////////////////////////////////////////////////
	//	09.06歌单闯关06
	gedanchuangguan_indexShow: '展示歌单首页',
	//	带上位置顺序，例如“首页【banner】1-serid”
	gedanchuangguan_indexBanner: '首【banner】',
	//	带上位置顺序，例如“首页【banner】1-serid”
	gedanchuangguan_indexlListIcon: '首【歌单icon】',
	gedanchuangguan_indexseLectionList: '首【精选歌单】',
	gedanchuangguan_shareRigth: '首【右上分享】',
	//	带上位置顺序，例如“首页【banner】1-serid”
	gedanchuangguan_listAllIcon: '歌【全部icon】',
	//	带上位置顺序，例如“首页【banner】1-serid”
	gedanchuangguan_listMyIcon: '歌【我的icon】',
	gedanchuangguan_listShare: '歌【右上分享】',
////////////////////////////////////////////////////////////////////////////////
	//	09.06分享统计07
	//	带上素材ID，例如“发出分享001”
	fenxiangtongji_sendShare: '发出分享',
	//	带上素材ID，例如“发出分享001”
	fenxiangtongji_clickShare: '点击分享图',
////////////////////////////////////////////////////////////////////////////////
  lingyinfu_show: '展示领音符首页',
  lingyinfu_signIn: '【签到领音符】',
  lingyinfu_score: '【限时福利】',
  lingyinfu_gift: '【专属福利】',


//09.19新增
	shouye_pop: '弹窗',
	tongzhi_index: '展示【通知中心】',
	tongzhi_clickTongzhi: '点击通知',
}


//腾讯统计的入口
var statisticsNew = function(that) {
	var pageName = that.data.pageName
	var result = {
		mtas: mtas,
		indexName: {
			'index': 'shouye',
			'song': 'chuangguan',
			'match_index': 'peiweisai',
			'god_index': 'mengmiangeshen',
			'song_index': 'gedanchuangguan',
		},
		//排位赛模式胜败的处理
		matchDeal: function(key) {
			var self = this
			var my_result = that.data.my_result
			var win_type = my_result.win_type
//			log(111111, my_result, win_type)
			if(win_type == 1) {
//				log('我胜利')
				key += 'Win'
			} else if(win_type == 2) {
//				log('对手胜利')
				key += 'Lost'
			} else if(win_type == 3) {
//				log('平局')
				key += 'Dogfall'
			}
//			log(1111111, win_type, key)
			self.submitMta(key)
//			return key
		},
		songAll: function(e, statistics, seriesId) {
			var self = this
			if(!statistics) {
				return
			}
			var index = e.target.dataset.index
			index = Number(index) + 1
			//发送请求
			self.submitMta(statistics, `${index}_${seriesId}`)
		},
		//	09.06歌单闯关的需要加上banner的顺序和serid
		songIndexDeal: function(e, seriesId) {
			var self = this
			if(!e) {
				return
			}
//			需要传入serid
//			3个一起拼接起来
			var statistics = e.target.dataset.statistics

			self.songAll(e, statistics, seriesId)
		},
		//	09.06歌单闯关的需要加上banner的顺序和serid
		songListDeal: function(e, seriesId) {
			var self = this
			if(!e) {
				return
			}
//			需要传入serid
//			3个一起拼接起来
			var statistics
			var billcurrent = that.data.billcurrent
			if(billcurrent == 0) {
				statistics = 'gedanchuangguan_listAllIcon'
			} if(billcurrent == 1) {
				statistics = 'gedanchuangguan_listMyIcon'
			}

			self.songAll(e, statistics, seriesId)
//			var index = e.target.dataset.index
//			index = Number(index) + 1
//			//发送请求
//			self.submitMta(statistics, `${index}_${seriesId}`)
		},
		//公用的处理方法
		indexCommon: function(type) {
			var self = this
			//首页的展示
			var pageName = that.data.pageName
			//获取相应的数据
			var indexName = self.indexName[pageName]
//			log(1111111, indexName, type)
			if(type && indexName) {
				//发送展示首页的统计数据
				var value = `${indexName}_${type}`
//				log(value)
				setTimeout(function() {
					//发送请求
					self.submitMta(value)
				}, 1000)

			}
		},
		shareEnd: function(parameter) {
			var self = this
			var e = parameter

			//有些页面，需要加上這个
			//判断是否是右上角的分享按钮
			try{var shareFrom = e.from;}catch(e){}
			try{var shareFrom = e[0].from;}catch(e){}
			//处理song_list获取不到数据的问题
			try{var shareFrom = e[0][0].from;}catch(e){}
			log('33333shareEnd', shareFrom)
			//右上角的分享按钮
			if(shareFrom == 'menu') {
//				var pageName = that.data.pageName
				//特别处理
				if(pageName == 'matching_pk') {
					if(that.data.isSucceed) {
						//发送请求
						self.submitMta('peiweisai_endShareRigth')
					}
					return
				} else if(pageName == 'song_list' ) {
					//发送请求
					self.submitMta('gedanchuangguan_listShare')
					return
				}
//				log(11111111111111, that.data.isSucceed)
//				不用特别处理
				if(that.data.isSucceed) {
					//发送请求(直接发送请求)
					self.indexCommon('endShareRigth')
				} else {
//					log(11111111111111)
					//发送请求(直接发送请求)
					self.indexCommon('shareRigth')
				}
			}
		},
		dealGodShareCommon: function(e) {
			var self = this

			//有些页面，需要加上這个
			//判断是否是右上角的分享按钮
			try{var shareFrom = e.from;}catch(e){}
			try{var shareFrom = e[0].from;}catch(e){}
			//处理song_list获取不到数据的问题
			try{var shareFrom = e[0][0].from;}catch(e){}
			log('33333shareEnd',e,  shareFrom)
			var shareName
			if(!that.data.isSucceed) {
				return
			}
			//右上角的分享按钮
			if(shareFrom == 'menu') {
				shareName = 'mengmiangeshen_endShare'
			} else {
				var isMyAnswerCorrect = that.data.godGame.isMyAnswerCorrect
				//成功
				if(isMyAnswerCorrect) {
					shareName = 'mengmiangeshen_firstPopShare'
				} else {
					shareName = 'mengmiangeshen_liminatedShare'
				}
			}
			self.submitMta(shareName)
		},
		shareCommon: function(e, otherType) {
			var self = this
			if(!e) {
				return
			}

			self.shareEnd(e)

			//分享的统计
			try{var statistics = e.target.dataset.statistics;}catch(e){}
			try{var statistics = e[0].target.dataset.statistics;}catch(e){}
			if(statistics) {
				if(pageName == 'matching_pk') {
					self.matchDeal(statistics)
					return
				}
				//发送请求(直接发送请求)
				self.submitMta(statistics)
			}
		},
		//点击发送腾讯请求
		clickRequest: function(e) {
			var self = this
			if(!e) {
				return
			}
			//新增统计埋点
			var mta = e.target.dataset.statistics
			var appid = e.target.dataset.appid
			
			//闯关的地方需要去处理
			var pageName = that.data.pageName
			if(pageName == 'matching_pk') {
				self.matchDeal(mta)
				return
			}

			if(appid) {
				self.submitMta(mta, appid)
			} else {
				self.submitMta(mta)
			}
		},
		//提交腾讯统计
		submitMta: function(name, appid) {
			var self = this
			//如果没有，不去请求腾讯统计
			if(!name) {
				return
			}
			var bannerMta = mtas[name]
			//如果没有事件的value，直接返回，防止腾讯统计出现错误
			if(!bannerMta) {
				return
			}

			var key = self.returnKey(name)
			//把键值转成对象的形式
			var stringJson ='{"'+ key +'": ""}';
			var result = JSON.parse(stringJson); //通过JSON.parse，把字符串转成一个对象
		//	//如果有appid的话，就加上appid
			if(appid) {
				bannerMta = bannerMta+appid  //这里需要appid
			}

			self.addIsUser(result,key,bannerMta)

//			//发送总的用户请求
			bannerMta+='_all'
			result[key]= bannerMta
			self.sendThree(result)
		},
		//切片处理,返会key的值
		returnKey: function(name) {
			var self = this

		//	因为传过来的是pass_invite格式,
		//	需要先切片,然后在取数组的第一个，就是key的值
			var nameArray = name.split('_')
			var key = nameArray[0]
			return key
		},
		//加上新旧用户信息
		addIsUser: function(result,key,bannerMta) {
			var self = this
			var is_new_user = app.data.is_new_user
			log('是否是新用户', is_new_user)
			if(is_new_user == 1) {
				//说明当天猜歌达人新用户
				bannerMta+='_new'
				result[key]= bannerMta
				self.sendThree(result)
			}
//			else {
//				bannerMta+='_old'
//			}
//			result[key]= bannerMta
//			self.sendThree(result)
		},
		sendThree: function(result) {
			var self = this
			var id = app.data.logmsg.wechat_type
			log(`腾讯统计事件id: ${id}+事件参数: ${JSON.stringify(result)}`)
			app.mta.Event.stat(id, result)
		},
//		09.07新手引导的处理
		dealNewUserGuide: function(game_state) {
			var self = this
			//11.12新增，关闭新手引导功能
			return 
					
//			if(!game_state) {
//				return
//			}
//			//前面的
//			var result = {
//				11: 'xinshouyindao_guideListen',
//				12: 'xinshouyindao_guidePause',
//				13: 'xinshouyindao_guideBreakUp',
//				14: 'xinshouyindao_guideHint',
//				100: 'xinshouyindao_guideComplete'
//			}
//			var value = result[game_state]
//			if(value) {
//				self.submitMta(value)
//			}
		},
		dealNewUserCharacter: function() {
			var self = this
			//11.12新增，关闭新手引导功能
//			var charactersNow =  that.data.charactersNow
//			if(charactersNow) {
//				self.submitMta('xinshouyindao_guideCharacter', charactersNow)
//			}
		},
	}
	that.statisticsNew = result
}
/////////////////////////////////////////////////
/////////////////////////////////////////////////
//切片处理,返会key的值
var returnKey= function(name) {
	var self = this
	var nameArray = name.split('_')
	var result = {
		name: nameArray[0],
		value: nameArray[1],
	}
	return result
}

var first = 0
var first1 = 0
var first2 = 0
var first3 = 0
var first4 = 0
//新增漏斗类型-------------------
var funnel = function(that) {
	var pageName = that.data.pageName
	var result = {
		returnKey,
		submitMtaNew: function(name, value) {
			var self = this
			//如果没有，不去请求腾讯统计
			if(!name) {
				return
			}
			//把键值转成对象的形式
			var stringJson ='{"'+ value +'": ""}';
			var result = JSON.parse(stringJson); //通过JSON.parse，把字符串转成一个对象
//			result[value]= 1
			result[value]= true

			var id = name
			log(`腾讯统计事件id: ${id}+事件参数: ${JSON.stringify(result)}`)
			app.mta.Event.stat(id, result)
		},
		firstEnter: function(type, leven) {
			var self = this
//			log('腾讯统计事件', app.data.funnelAll)
			//新手引导和其他的分开处理
			if(type == 'caigexinshouyin') {
				//11.12新增，关闭新手引导功能
				return 
				
//				//发送请求
//				self.submitMtaNew(type, leven)
//				return
			}


			//這里统一去判断(是否是新用户),判断不是首次使用，不去发送统计的数据
			var isNew = app.data.funnelAll[type]
//			log(9999, )
//			1是已经进入,0是未进入过
			if(isNew) {
				return
			}
			if(util._typeof(isNew) == 'undefined') {
				return
			}
			//发送请求
			self.submitMtaNew(type, leven)
		},
		send: function(mta) {
			var self = this
			if(!mta) {
				return
			}
			var result = self.returnKey(mta)

			self.firstEnter(result.name, result.value)
		},
		common: function(e) {
			var self = this
//			log(111111111111, e)
			if(!e || util._typeof(e) != 'object') {
				return
			}
			//新增统计埋点
			var mta = e.target.dataset.funnelname
//			log(1111, mta)
			self.send(mta)
		},
		dealIndex: function() {
			var self = this
			if(pageName == 'index') {
				that.funnel.send('caigepaiweisai_lv1')
				that.funnel.send('mengmiangeshenl_lv1')
				that.funnel.send('gedanchuangguan_lv1')
				//09.19新增
				that.funnel.send('tongzhizhongxin_lv1')
				that.funnel.send('lingyinfu_lv1')
			}

		},
//		09.07新手引导的处理
		dealCharacter: function() {
			var self = this
			//11.12新增，关闭新手引导功能
			return 
			
//			var charactersNow =  that.data.charactersNow
//			if(charactersNow && !first) {
//				//发送请求
//				self.send('caigexinshouyin_lv7')
//				//设置不再发送请求
//				first++
//			}
		},
		dealSongIndex: function() {
			var self = this
			if(!first1) {
				//发送请求
				self.send('gedanchuangguan_lv3')
				//设置不再发送请求
				first1++
			}
		},
		dealMatch: function() {
			var self = this
			if(!first2) {
				//发送请求
				self.send('caigepaiweisai_lv3')
				//设置不再发送请求
				first2++
			}
		},
		/*09.19新增，处理通知中心漏斗*/
		dealTaskCenter: function() {
			var self = this
			if(!first3) {
				//发送请求
				self.send('tongzhizhongxin_lv3')
				//设置不再发送请求
				first3++
			}
		},
		/*09.19新增，处理通知中心漏斗*/
		dealGiftCenter: function() {
			var self = this
			if(!first4) {
				//发送请求
				self.send('lingyinfu_lv3')
				//设置不再发送请求
				first4++
			}
		},
	}
	that.funnel = result
}

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
//腾讯统计的入口09119修改，直接调用方法就可以了
var statisticsAmend = {
		//提交腾讯统计
		submitMta: function(name, appid) {
			var self = this
			//如果没有，不去请求腾讯统计
			if(!name) {
				return
			}
			var bannerMta = mtas[name]
			//如果没有事件的value，直接返回，防止腾讯统计出现错误
			if(!bannerMta) {
				return
			}

			var key = self.returnKey(name)
			//把键值转成对象的形式
			var stringJson ='{"'+ key +'": ""}';
			var result = JSON.parse(stringJson); //通过JSON.parse，把字符串转成一个对象
		//	//如果有appid的话，就加上appid
			if(appid) {
				bannerMta = bannerMta+appid  //这里需要appid
			}

			self.addIsUser(result,key,bannerMta)

//			//发送总的用户请求
			bannerMta+='_all'
			result[key]= bannerMta
			self.sendThree(result)
		},
		//切片处理,返会key的值
		returnKey: function(name) {
			var self = this

		//	因为传过来的是pass_invite格式,
		//	需要先切片,然后在取数组的第一个，就是key的值
			var nameArray = name.split('_')
			var key = nameArray[0]
			return key
		},
		//加上新旧用户信息
		addIsUser: function(result,key,bannerMta) {
			var self = this
			var is_new_user = app.data.is_new_user
			log('是否是新用户', is_new_user)
			if(is_new_user == 1) {
				//说明当天猜歌达人新用户
				bannerMta+='_new'
				result[key]= bannerMta
				self.sendThree(result)
			}
//			else {
//				bannerMta+='_old'
//			}
//			result[key]= bannerMta
//			self.sendThree(result)
		},
		sendThree: function(result) {
			var self = this
			var id = app.data.logmsg.wechat_type
			log(`腾讯统计事件id: ${id}+事件参数: ${JSON.stringify(result)}`)
			app.mta.Event.stat(id, result)
		},
	}

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
//		result[value]= 1
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
//	firstEnter: function(type, leven) {
//		var self = this
////		log('腾讯统计事件', app.data.funnelAll)
//		//新手引导和其他的分开处理,因为是前端去判断的
//		if(type == 'caigexinshouyin') {
//			//发送请求
//			self.submitMtaNew(type, leven)
//			return
//		}
//
//		//這里统一去判断(是否是新用户),判断不是首次使用，不去发送统计的数据
//		var isNew = app.data.funnelAll[type]
//		if(isNew) {
//			return
//		}
//		if(util._typeof(isNew) == 'undefined') {
//			return
//		}
//		//发送请求
//		self.submitMtaNew(type, leven)
//	},
//	send: function(mta) {
//		var self = this
//		if(!mta) {
//			return
//		}
//		var result = returnKey(mta)
//
//		self.firstEnter(result.name, result.value)
//	},
//	common: function(e) {
//		var self = this
//		if(!e || util._typeof(e) != 'object') {
//			return
//		}
//		//新增统计埋点
//		var mta = e.target.dataset.funnelname
//		self.send(mta)
//	},
}


////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
//10.25 运营新增统计的需求
//這里是可以复用的函数
var sendData = function(source, value) {
	//	log('统计', source)
	var is_new_user = app.data.is_new_user
	log('统计是否是新用户', is_new_user)
	if(!source) {
		//如果没有渠道的来源， 直接return 
		return
	}
	if(!is_new_user) {
		//如果不是新用户， 直接return 
		return
	}

////這里是处理，有没有发送过前一个lv
////用来处理，没有发送lv3的时候，不去发送lv。即前一步没有的时候，不发送下一步的请求
////var hasSendFunnel = app.data.hasSendFunnel || 'lv0'
//	var hasSendFunnel = app.data.hasSendFunnel[source] || 'lv0'
//	var num = hasSendFunnel.slice(2)
//	num = Number(num) + 1
//	var nextNum = 'lv' + num
//	if(nextNum != value) {
//		return
//	}
	//当前已经发送的漏斗
	var hasSendFunnel = app.data.hasSendFunnel[source] || 'lv0'	
	//新增一个函数，去判断是否有发送过前一个lv
	if(!hasSendLv(source, value, hasSendFunnel)) {
		return
	}

	statisticsFunnel.submitMtaNew(source, value, function(obj) {
		//這里新的回调函数,用来存储已经发过的lv
		app.data.hasSendFunnel = app.data.hasSendFunnel || {}
		var key = obj.name
		var value = obj.value
		var str = `hasSendFunnel[${key}]`;
//		app.data.str = value
		app.data.hasSendFunnel[key] = value
//		log('统计123', app.data.hasSendFunnel)
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
//10.24运营新增,渠道来源的新用户,通过闯关关数的漏斗
//1.进入首页,发送lv1
//2.进入闯关首页,发送lv2
//3.通过第1关,发送lv3
//4.通过第3关,发送lv4
//5.通过第10关,发送lv5
//名字用渠道来源
//发送的示例
//statisticsFunnel.firstEnter('caigedarenchannle', 'lv1')
//当前通过的关卡数量,再发送不同的的漏斗请求
var songNum = function(num) {
	if(!num) {
		//如果没有值，直接return 
		return
	}
	var result = {
		'1': 'lv3',
		'3': 'lv4',
		'10': 'lv5',
	}
	var value = result[num] 
	channleFunnelTsji(value)
}
//发送漏斗的请求
var channleFunnelTsji = function(value) {
	if(!value) {
		//如果没有值，直接return 
		return
	}
	//10.25修改获取的渠道来源
	var returnDataNew = app.data.returnDataNew
	var source = returnDataNew.source
	//统一去发送
	sendData(source, value)
}

////////////////////////////////////////////////////////
//10.25运营鳗鱼新增，自10月26日上线新版后的新增用户闯关模式的数据（仅新增用户）
//1.进入首页,发送lv1
//2.开始回答第1关,发送lv2
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
		'1': 'lv2',
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
	if(!value) {
		//如果没有值，直接return 
		return
	}
	var source = 'xinzengyonghuch'
	//统一去发送
	sendData(source, value)
}



module.exports = {
//	clickRequest,
//	submitMta,
	statisticsNew,
	funnel,

	//09.19新增
	statisticsAmend,
	statisticsFunnel,
	
	//10.24新增,渠道来的新用户，通过闯关的漏斗统计
	channleFunnelTsji,
	songNum,
	
	//10.25运营鳗鱼新增，自10月26日上线新版后的新增用户，开始玩闯关模式的数据（仅新增用户）
	channleFunnelTsjiMan,
	songNumMan,
}
