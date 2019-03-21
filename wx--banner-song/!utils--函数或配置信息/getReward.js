//邀请有礼的请求
var log = console.log.bind(console)


var sendAjax = require("./sendAjax.js")  //引入ajax请求模块


//正式 api || 测试t1api
const OPSTYLE = 'api';
var log = console.log.bind(console)
//获取应用实例
var app = getApp()

var logN = app.logN()

var data_01 = {},
	delete_input_list = [],
	tips_Timeout,
	is_Additional = 0,
	uesr_erro_num = 0,
	group_info,
	danmu_Timeout,
	danmu_num = 0,
	page;

var listener;
var rain_num=0;

var backgroundAudioManager;
var innerAudioContext;
var is_qiuzhutishi_time;
//index.js
//获取应用实例
var app = getApp()

var aboutVer = require("./ver_control.js")  //版本控制相关

//06.29新增，引入重新登录后的失败信息
var aboutLogin = require("./aboutLogin.js");
var get_grant_fail = aboutLogin.get_grant_fail

var share_about = require("./share_about.js")  //07.11新增引入分享请求

var staticImg1808 = 'https://static.zuiqiangyingyu.cn/admin/1808/'

var getRewardObj = {
	////////////////////////////////////////////////////
	/////解锁歌单
		//06.11新增解锁歌单（如果是点击的分享的链接过来的，需要发接口在后台，去增加音符数量）
//	unlockSongs: function() {
//		var that = this		
//		if(that.data.options.type == 'unlock_songs') {	
//			var uid2 =  that.data.options.uid2
//			//如果是当前用户打开，不去请求接口
//			if(uid2 == app.data.userInfo.user_id) {return}
//			var reward_id =  that.data.options.reward_id	
//			var series_id =  that.data.options.series_id
//			var date = that.data.options.dateTime 
//			var djqm = {
//				uid2: uid2,
//				reward_id:　reward_id,
//				date: date,
//				series_id: series_id
//			}
//			that.UNLOCK_SHARE_CLICK(djqm, function(res) {
//				if(res.data.c == '0') {
//				}else{
//					wx.showToast({ title: res.data.m,icon: 'none',duration: 2000})	
//				}
//			})
//		}
//	},

	////////////////////////////////////////////////////
	/////接口 
	//获取音符等
	INDEXDL: function() {
		var that = this;
		var let_data = {
			token			: app.data.userInfo.token,
			user_id			: app.data.userInfo.user_id,
			wechat_type		: 'wechat_song'
		};
		console.log('INDEXDL let_data' , let_data  )
		wx.request({
			url: app.data.API.INDEXDL,
			data: let_data,
			header: {'content-type': 'application/json'},
			success: function(res) {
				console.log('INDEXDL 进入', res)
				if(res.data.c == '0') {
					var resData = res.data.d
					//07.09处理报警群里的bug
					try{
						let pass_next = resData.user.pass_next
						that.setData({
							indexdl					:	res.data.d,
	//						score: resData.user.score,
							pass:  pass_next - 1,
							money: resData.user.score,
						})
						
						//08.30新增，修改关卡数量（在函数里面，会减去1）
						sendAjax.setUserInfo({
							pass_next: pass_next,
						})
					} catch(err){
						console.log(err.message)
						app.showModalNew(err.message)
					}
					logN('that.data.indexdl', that.data.indexdl)
					var ver = resData.business_switch.pay.ver
					app.data.ver = ver
//					版本控制
					aboutVer.isVer(ver)
					logN('app.data.ver', app.data.ver)
					app.data.user_index =	res.data.d ;
//					log(`app.data.user_index: ${app.data.user_index}`)
				} else if(res.data.c == '4') {
						//09.14修改重新去登录
						that.setData({
							initial_show: true
						})
//					that.get_grant_again(function(){});
				}
			},
		})
	},
	//歌单专题配置接口
	SERIES_CONFIG:function() {
		var that = this;
		var let_data = {
			token			: app.data.userInfo.token,
			wechat_type		: 'wechat_song'
		};
		console.log('SERIES_CONFIG let_data' , let_data  )
		wx.request({
			url: app.data.API.SERIES_CONFIG,
			data: let_data,
			header: {'content-type': 'application/json'},
			success: function(res) {
				console.log('SERIES_CONFIG 进入', res)
				if(res.data.c == '0') {
					var resData = res.data.d
					logN('resData', resData)
					that.setData({
						songs: resData
					})
				} else if(res.data.c == '4') {
					//10.19新增,判断下，如果有的话，才去调用那个方法
					if(typeof that.get_grant_again == 'function') {
						that.get_grant_again(function(){});
					}
//					that.get_grant_again(function(){});
				}
			},
		})
	},
	
	//05.29新增--获取歌单的数据
	UNLOCK_SHARE_REWARD: function(let_data, callback) {
		var that = this;
		var series_id = Number(let_data.series_id)
		var reward_id = Number(let_data.reward_id)
		 var data = {
	            token: that.data.userInfo.token,
	            action: let_data.action || '',
	            reward_id: reward_id || '',
	            series_id: series_id,
	       }
//		 data = app.assignObject(data, let_data)
    	log(`请求分享-领取歌单的参数:${JSON.stringify(data)}`)
        app.appRequest({
            urls: app.data.API.UNLOCK_SHARE_REWARD,
            data: data,
            success: function(res) {
            	log(`请求分享-领取歌单返回的数据:${JSON.stringify(res)}`)
            	if(res.data.c == '0') {
            		that.setShareLyqu(res.data.d.list)
            		//更新音符的数量
					if(res.data.d.user.score) {
						var score = res.data.d.user.score
						//设置用户的音符数量
					    that.setData({
					      money: score || 0
					    })
					    app.data.money = score || 0
					}		
	           	} else {
	           		if(res.data.m) {
	           			wx.showToast({
		                    title: res.data.m,
		                    icon: 'none',
		                    duration: 1000
		                })
	           		}
	           		console.error(res)
	            }
                if( typeof(callback)=="function" ){callback(res)}
            },
        })
	},
	//05.29新增--点击分享链接接口
	UNLOCK_SHARE_CLICK: function(cjuu, callback) {
		var that = this;
//      var let_data = {
//              token: that.data.userInfo.token,
//              uid2: cjuu.uid2,
//              reward_id: cjuu.reward_id,
//              date: cjuu.date,
//              series_id: cjuu.series_id,
//          }
		cjuu.token = that.data.userInfo.token
		var let_data = cjuu
    	log(`请求点击分享链接接口的参数:${JSON.stringify(let_data)}`)
        app.appRequest({
            urls: app.data.API.UNLOCK_SHARE_CLICK,
            data: let_data,
            success: function(res) {
                log(`点击分享链接接口-返回的数据:${JSON.stringify(res)}`)
                if( typeof(callback)=="function" ){callback(res)}
            },
        })
	},
	//解锁歌单专题
	UNLOCK_SERIES: function(cjuu, callback) {
		var that = this;
		cjuu.token = that.data.userInfo.token
		var let_data = cjuu
    	log(`解锁歌单专题接口的参数:${JSON.stringify(let_data)}`)
        app.appRequest({
            urls: app.data.API.UNLOCK_SERIES,
            data: let_data,
            success: function(res) {
                log(`解锁歌单专题-返回的数据:${JSON.stringify(res)}`)
                if( typeof(callback)=="function" ){callback(res)}
            },
        })
	},
	
	//08.29新增 歌单分享接口
	SERIESSHARE: function(cjuu, callback) {
		var that = this;
		cjuu.token = that.data.userInfo.token
		var let_data = cjuu
    	log(`解锁歌单专题接口的参数:${JSON.stringify(let_data)}`)
        app.appRequest({
            urls: app.data.API.SERIESSHARE,
            data: let_data,
            success: function(res) {
                log(`歌单分享接口-返回的数据:${JSON.stringify(res)}`)
                if( typeof(callback)=="function" ){callback(res)}
            },
        })
	},

	//////////////////////////////////////////////////////
	//////操作 
	//06.08新增
	clickNow: function(e) {
		var that = this
		var type = e.target.dataset.type;
		logN('type', type)
		that.clickEvent(type)
	},
	//事件
	clickEvent: function(type) {
		var that = this
		var events = {
			//显示音符
			'showYnfu': function() {
				if(app.data.isVer) {
					//显示提示
					that.setgame_state(5)
				}
			},
			'close': function() {
				//关闭弹窗
				that.setgame_state(0)
			},
		}
		return events[type]()
	},
	//进入歌单
	enterSong: function(e) {
		var that = this
//		這里需要分开处理
		var pageName = that.data.pageName
		//如果是首页，取所有的列表，如果是list，去songlist里面的数据
		if(pageName == 'song_index') {
			var songsAll = that.data.songsAll || []
		} else if(pageName == 'song_list') {
			var songsAll = that.data.songList || []
		}
		
		var index = e.target.dataset.index
		var songtpe = e.target.dataset.songtpe
		//判断是否可以进入
//		var songList = that.data.songList || []
//		var songsAll = that.data.songsAll || []
		//如果是lists,需要加上banner的长度
		if(songtpe == 'lists') {
			//因为这里是所有的列表数据
			var bannerLength = that.data.bannerLength || 0
			index = index + bannerLength
		}
		
		var song = songsAll[index]
		log(11111, songsAll, index, songtpe, song)
		var status = song.status
		var seriesId = song.id
		//未拥有,显示展开的数据
		if(status == 0) {
			//如果没有解锁就直接显示弹窗	
			that.setData({
				song: song,
			})
			that.openShop(song)	
		} else {
			var openData= `?seriesId=${seriesId}`
			app.bindViewTap_three('song',openData)
		}
		
		//09.06发送腾讯请求
		if(that.statisticsNew) {
//			that.statisticsNew.songIndexDeal(e, seriesId)
			if(pageName == 'song_index') {
					//09.06发送腾讯请求
				that.statisticsNew.songIndexDeal(e, seriesId)
				
				//09.07发送腾讯漏斗请求
				that.funnel.dealSongIndex()
			} else if(pageName == 'song_list') {
				//09.06发送腾讯请求
				that.statisticsNew.songListDeal(e, seriesId)
			}
		}
	},
	/////////////////////////////////////////
	//开始游戏
//	click_ready: function(){
//		var that = this;
//		that.setData({
//			'options.type': '',
//			is_ready:0,
//		})
//		that.INDEXDL();
//		setTimeout(function(){that.setData({is_delete:true,})},1000)
//	},
	//////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////
	//打开弹窗
	openShop: function(song) {
		var that = this	
		var result = {
			series_id: song.id,
		}
		//获取歌单的数据
		that.UNLOCK_SHARE_REWARD(result, function(res) {})
	},
	closeShop: function(e) {
		var that = this
		if(e.target.dataset.url) {
			var url = e.target.dataset.url
			that.setgame_state(url)
		} else {
			that.setgame_state(0)
			//更新歌单数据
			that.getFirst()
		}
	},
	//设置领取的参数
	setShareLyqu: function(list) {
		let that = this
		let shareLists = list
		for(let i=0; i<shareLists.length; i++) {
			let a = shareLists[i]
			let setShare   //只在for循环里面有用
			if(i == 5 ) {
				//最后一个显示
				setShare = 3
			} else {
//				点击分享链接的用户ID， 为0说明没有人点击
				if(a.uid2 == 0) {
					setShare = 0					
				} else {
					//是否领取奖励, 0未领取 1已领取
					if(a.status == 0) {				
						setShare = 1
					} else if(a.status == 1) {
						setShare = 2
					}
				}
			}	
			a.setShare = setShare
		}
		log(`shareLists: ${JSON.stringify(shareLists)}`)
		that.setData({
	      shareLists: shareLists,
	    })
		//setShare: 0-没有人点击过， 1有人点击过，未领取， 2有人点击过，已领取，3最后一个大奖
		that.setgame_state(6)
	},
	//邀请有礼的按钮
	inviteGifts: function(e) {
		var that = this
		//06.20新增处理报警群里的问题
		try{
			var index = e.target.dataset.index;
			//获取点击的是那个按钮
			var shareLists = that.data.shareLists
			var setShare = shareLists[index].setShare
			var djqm = shareLists[index]
			
			if(djqm.status == 1) {
				wx.showToast({
				  title: '您已领取奖励',
				  icon: 'none',
				  duration: 2000
				})
				return
			}
	
			if(setShare == 0) {
				log('0-没有人点击过')
			} else if(setShare == 1) {
				log('1有人点击过，未领取')
				that.ggDdata(djqm)			
			} else if(setShare == 2) {
				log('2有人点击过，已领取')
			} else if(setShare == 3) {
				if(djqm.share_click) {
					that.setData({
						setShare: setShare,
					})
					log('可以点击3最后一个大奖')
					that.lastUpdate(djqm)
				} else {
					wx.showToast({
					  title: '请邀请5个不同好友，进入游戏后再领取',
					  icon: 'none',
					  duration: 2000
					})
				}
			}
		} catch(err){
			app.showModalNew(err.message)
		}
	},
	//最后一个的显示,领取歌单的显示
	lastShow: function() {
		var that = this
		that.setgame_state(4)
		//更新歌单数据
		that.getFirst()
	},
	//点击最后一个
	lastUpdate: function(djqm) {
		var that = this
		var let_data = {
            series_id: that.data.song.id,
      }
		that.UNLOCK_SERIES(let_data, function(res) {
			if(res.data.c == '0' ) {
				//如果是最后一个
				that.lastShow()
				
				//设置获得歌单的信息
				that.setData({
					getSongs: res.data.d,
				})
			}
		})
	},
//	更新用户数据
	ggDdata: function(djqm) {
		var that = this
		var let_data = {
            action: 'take',
            reward_id: djqm.id,
            series_id: that.data.song.id,
      	}
		log(`let_data: ${JSON.stringify(let_data)}`)
		that.UNLOCK_SHARE_REWARD(let_data, function(res) {
			if(res.data.c == '0' ) {
				//如果是最后一个
				if(that.data.setShare==3) {
					that.lastShow()
				} else {					
					wx.showToast({
					  title: `音符+${djqm.score}`,
					  icon: 'none',
					  duration: 1000
					})
					//更新状态
					that.INDEXDL()
				}		
			}
		})
	},
}




module.exports = getRewardObj