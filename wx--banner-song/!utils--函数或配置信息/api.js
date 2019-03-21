//获取应用实例
var app = getApp()

var api = function(domain) {
	var apiAll = {
			//请求歌曲
			INDEXDL 							: domain + '/index.php/api/guess_v2/Index',
			//分享奖励
			REWARD_SHARE 						: domain + '/index.php/api/guess_v2/Share',
			//提交答案
			SAVE_RECORD 						: domain + '/index.php/api/guess_v2/Sub',
			//获取提示
			DEDUCT_RECORD 						: domain + '/index.php/api/guess_v2/Prompt',
			//帮助人答题提交
			HELP_MSG 							: domain + '/index.php/api/guess_v2/Query_idiom_help_v1',
			//分享海报
			SAVE_GUESS_POSTER 					: domain + '/index.php/api/guess_v2/misc/Save_guess_poster',
			//客服消息
			KF_MSG 								: domain + '/index.php/api/guess_v2/misc/Kf_msg',
			//全球排行
			TOP_ALL 							: domain + '/index.php/api/guess_v2/top_all',
			//好友排行
			TOP_FRIEND 							: domain + '/index.php/api/guess_v2/top_friend',
			//请求小程序跳转信息
			RECOM_WEAPP 						: domain + '/index.php/api/guess_v2/misc/Recom_weapp',
			//下单 https://api.zuiqiangyingyu.net/index.php/api/guess_v2/pay/order?token=06369e318fb51ee1532494cf81371fb1&wechat_type=wechat_song&sid=123&pass=456
			ORDER 								: domain + '/index.php/api/guess_v2/pay/order',
			//查询支付 https://api.zuiqiangyingyu.net/index.php/api/guess_v2/pay/query?token=06369e318fb51ee1532494cf81371fb1&wechat_type=wechat_song&oid=
			QUERY 								: domain + '/index.php/api/guess_v2/pay/query',
			//我的收藏夹歌单
			MY_FAVORITE 						: domain + '/index.php/api/guess_v2/My_favorite',
			//收藏取消收藏歌曲
			FAVORITE 							: domain + '/index.php/api/guess_v2/Favorite',

			//关卡地图
			LEVEL_MAP 							: domain + '/index.php/api/guess_v2/misc/Level_map',


			//猜歌排位赛接口
			SEASON_MY 							: domain + '/index.php/api/guess_v2/season/My',
			//赛季奖励
			CLASSIC_CONFIG 						: domain + '/index.php/api/guess_v2/season/Classic_config',
			//查询赛季奖励
			MY_REWARD 							: domain + '/index.php/api/guess_v2/season/My_reward',
			//查询赛季好友榜
			TOP_SEASON_FRIEND 					: domain + '/index.php/api/guess_v2/season/Top_friend',
			//查询赛季世界榜
			TOP_SEASON_ALL 						: domain + '/index.php/api/guess_v2/season/Top_all',
			//领取赛季奖励
			GET_REWARD 							: domain + '/index.php/api/guess_v2/season/Get_reward',

//			//对战--好友榜
//			TOP_PK_FRIEND 						: domain + '/index.php/api/guess_v2/season/Top_friend',
//			//对战--世界榜
//			TOP_PK_ALL 							: domain + '/index.php/api/guess_v2/season/Top_all',


			//擂台赛好友排行榜
			TOP_ARENA_FRIEND 					: domain + '/index.php/api/guess_v2/arena/Top_friend',
			//擂台赛世界排行榜
			TOP_ARENA_ALL 						: domain + '/index.php/api/guess_v2/arena/Top_all',
			//音符兑换挑战次数
			GET_TICKET 							: domain + '/index.php/api/guess_v2/arena/Get_ticket',
			//分享接口
			ARENA_SHARE							: domain + '/index.php/api/guess_v2/arena/Share',
			//擂台赛配置接口
			ARENA_CONFIG						: domain + '/index.php/api/guess_v2/arena/Arena_config',







			//首页广告
			GET_AD 								: domain + '/index.php/api/guess_v2/Get_ad',


			//分享群，限定单日分享一次得一次奖励
			SHARE_GROUP 						: domain + '/index.php/api/guess_v2/Share_group',

			//每日登录奖励'token=39621943e60f157b9c22d8f970f4b6f5&wechat_type=wechat_song'  领取时 '&action=take'
			LOGIN_REWARD 						: domain + '/index.php/api/guess_v2/misc/Login_reward',


			//对战配置
			PK_CONFIG 							: domain + '/index.php/api/guess_v2/Pk_config',


			//查询当前活动：
			PUSH_ACTIVITY						: domain + '/index.php/api/guess_v2/misc/Push_activity',
			//猜歌活动抽奖
			ACTIVITY_CONFIG						: domain + '/index.php/api/guess_v2/activity/Config',
			//猜歌活动抽奖
			ACTIVITY_DRAW						: domain + '/index.php/api/guess_v2/activity/Draw',


			//游戏广告信息
			COMMON_ADS						    : 'https://game.zuiqiangyingyu.net/common/game/ads',



			//保存formid
			FORM_ID								: domain + '/index.php/api/guess_v2/misc/Save_form_id',

			//保存日志
			LOG									: domain + '/index.php/api/guess_v2/Log',

			//05.17新增接口
			//获取中奖者列表
			WINNERS								: domain + '/index.php/api/guess_v2/arena/Winners',

			//分享接口:分享群拿入场券、复活
			SHARE								: domain + '/index.php/api/guess_v2/arena/Share',

			//领奖接口: 领奖接口， 擂台赛挑战成功之后可领取视频网站的月卡
			ARENA_GET_REWARD					: domain + '/index.php/api/guess_v2/arena/Get_reward',

			//05.29新增每日分享红包接口
			DAILY_SHARE_REWARD                  : domain +  '/index.php/api/guess_v2/misc/Daily_share_reward',
			//点击分享链接接口
			DAILY_SHARE_CLICK                 	: domain +  '/index.php/api/guess_v2/misc/Daily_share_click',

//			//06.08新增1.2.38改版
//			//歌单专题配置接口
//			SERIES_CONFIG                	: domain +  '/index.php/api/guess_v2/series/Series_config',
////			拿题接口
//			SERIES_INDEX               		: domain +  '/index.php/api/guess_v2/series/Index',
////			答题接口
//			SERIES_SUB               		: domain +  '/index.php/api/guess_v2/series/Sub',
////			获取提示接口
//			SERIES_PROMPT             		: domain +  '/index.php/api/guess_v2/series/Prompt',
////			重玩接口
//			SERIES_REPLAY          			: domain +  '/index.php/api/guess_v2/series/Replay',
////			分享解锁歌单接口
//			UNLOCK_SHARE_REWARD         	: domain +  '/index.php/api/guess_v2/series/Unlock_share_reward',
////			点击分享链接接口
//			UNLOCK_SHARE_CLICK         		: domain +  '/index.php/api/guess_v2/series/Unlock_share_click',
////			解锁歌单专题
//			UNLOCK_SERIES       			: domain +  '/index.php/api/guess_v2/series/Unlock_series',
//06.08新增1.2.38改版
			//歌单专题配置接口
			SERIES_CONFIG                	: domain +  '/index.php/api/guess_v2/series/Series_config',
//			拿题接口
			SERIES_INDEX               		: domain +  '/index.php/api/guess_v2/series/v2/Index',
//			答题接口
			SERIES_SUB               		: domain +  '/index.php/api/guess_v2/series/v2/Sub',
//			获取提示接口
			SERIES_PROMPT             		: domain +  '/index.php/api/guess_v2/series/v2/Prompt',
//			重玩接口
			SERIES_REPLAY          			: domain +  '/index.php/api/guess_v2/series/v2/Replay',
//			分享解锁歌单接口
			UNLOCK_SHARE_REWARD         	: domain +  '/index.php/api/guess_v2/series/v2/Unlock_share_reward',
//			点击分享链接接口
			UNLOCK_SHARE_CLICK         		: domain +  '/index.php/api/guess_v2/series/v2/Unlock_share_click',
//			解锁歌单专题
			UNLOCK_SERIES       			: domain +  '/index.php/api/guess_v2/series/v2/Unlock_series',

			//08.29新增 歌单专题列表接口
		      SERIESSHARE						: domain +  '/index.php/api/guess_v2/series/v2/Share',
		
		
		      // 福利中心
		      GIFTCENTER_INDEX						: domain +  '/index.php/api/guess_v2/Gift_index',
		      GIFTCENTER_CLICK						: domain +  '/index.php/api/guess_v2/Gift_click',
		      GIFTCENTER_GET						: domain +  '/index.php/api/guess_v2/Gift_get',
		      
		      //11.12新增 分享看答案的接口
		      SKIP						: domain +  '/index.php/api/guess_v2/Skip',
		      
		     //登录接口
			WECHAT_AUTH 						: domain + '/index.php/api/guess_v2/Wechat_auth',

	}
		return apiAll
}
module.exports = {
  api: api
}
