//获取应用实例
var app = getApp()

var api = function(domain, game_domain) {
	var apiAll = {
			//11.30修改，登录接口，新增参数swanid
//			SWANID_AUTH 						: domain + '/index.php/api/gs_baidu/SwanId_auth',
			
			//登录接口
//			WECHAT_AUTH 						: domain + '/index.php/api/gs_baidu/Wechat_auth',

			WECHAT_AUTH 						: domain + '/index.php/api/gs_baidu/SwanId_auth',
			//请求歌曲
			INDEXDL 							: domain + '/index.php/api/gs_baidu/Index',
			//分享奖励
			REWARD_SHARE 						: domain + '/index.php/api/gs_baidu/Share',
			//提交答案
			SAVE_RECORD 						: domain + '/index.php/api/gs_baidu/Sub',
			//获取提示
			DEDUCT_RECORD 						: domain + '/index.php/api/gs_baidu/Prompt',
			//全球排行
			TOP_ALL 							: domain + '/index.php/api/gs_baidu/top_all',
			//我的收藏夹歌单
			MY_FAVORITE 						: domain + '/index.php/api/gs_baidu/My_favorite',
			//收藏取消收藏歌曲
			FAVORITE 							: domain + '/index.php/api/gs_baidu/Favorite',

			//关卡地图
			LEVEL_MAP 							: domain + '/index.php/api/gs_baidu/Level_map',


			//每日登录奖励'token=39621943e60f157b9c22d8f970f4b6f5&wechat_type=wechat_song'  领取时 '&action=take'
			LOGIN_REWARD 						: domain + '/index.php/api/gs_baidu/misc/Login_reward',
			
			//08.29新增 用户配置
			USER_INFO							: domain + 	'/index.php/api/gs_baidu/User_info',
			
			//11.09新增-已签到的列表
			SIGN_LIST							: domain + 	'/index.php/api/gs_baidu/Sign_list',
			//11.09新增-签到
			SIGN								: domain + 	'/index.php/api/gs_baidu/Sign',
			
			
			//11.12新增 分享看答案的接口
		    SKIP						: domain +  '/index.php/api/gs_baidu/Skip',
		    
		    //19.2.15新增，获取宝箱奖励值
		    SUB_DRAW_REWARD						: domain +  '/index.php/api/gs_baidu/Sub_draw_reward',
			
			//11.15修改_BMS公用接口
			common : {
				//	获取配置（审核的时候屏蔽）
				CONFIG_INFO : game_domain + '/common/config/info',
				//	IP 屏蔽
				IS_ENABLE : game_domain + '/common/ip/is_enable',
			},
			//获取广告的接口
			game_ads: {
				//获取游戏广告的接口
				getAds: game_domain + '/common/game/ads',
				//展示广告位的接口
				showAd: game_domain + '/statistics/ad/show',
				//点击广告位的接口
				clickAd: game_domain + '/statistics/ad/hit',
			},
				//获取分享语的接口
			  share_words: {
			    //获取游戏分享的接口
			    shareList: game_domain + "/common/game/share_list",
			    //展示分享语的接口
			    showWord: game_domain + "/statistics/share/show",
			    //点击广告位的接口
			    clickWord: game_domain + "/statistics/login_log"
			  },
			  
			//19.1.9保存formid
			FORM_ID								: domain + '/index.php/api/common/Save_form_id',
	}
		return apiAll
}
module.exports = {
  api: api
}
