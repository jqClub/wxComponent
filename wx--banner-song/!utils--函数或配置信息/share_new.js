var log = console.log.bind(console)

//07.12修改，把分享的内容都提出来
var index = [
	{
		title: '这些抖音神曲你听过吗，超过10首算我输！',
		image: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_04/shae_bg_17.jpg'
	},
	{
		title: '哥练的胸肌，你还想不想靠，爱豆的新歌听过了吗',
		image: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_05/shae_bg_0531_3.jpg'
	},
//	{
//		title: '【@我】女版偶像练习生来了，谁的歌才是你的菜',
//		image: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_05/shae_bg_0531_4.jpg'
//	},
]
var challenge_index = [
	{
		title: '超燃超爆的猜歌游戏，不服来战',
		image: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_05/shae_bg_0531_5.jpg'
	},
	{
		title: '这些抖音神曲你听过吗，超过10首算我输！',
		image: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_04/shae_bg_17.jpg'
	},
	{
		title: '哥练的胸肌，你还想不想靠，爱豆的新歌听过了吗',
		image: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_05/shae_bg_0531_3.jpg'
	},
//	{
//		title: '【@我】女版偶像练习生来了，谁的歌才是你的菜',
//		image: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_05/shae_bg_0531_4.jpg'
//	},
]

var season_index = [
	{
		title: '[@我]，3千万人都在玩的音乐游戏，点开即玩|',
		image: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_05/shae_bg_0531_1.jpg'
	},
	{
		title: '根本停不下来',
		image: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_05/shae_bg_0531_2.jpg'
	},
]

//闯关模式，结果页分享语
var challenge_end_help = [
	{
		title: '@所有人 我被感动了，猜猜这是哪首歌',
		image: '',
	},
]


//所有的分享语
var shareAllWord = function() {
	//分享的位置：首页index、闯关首页challenge_index、闯关分享challenge_help、
	//排位赛首页season_index、排位赛结束分享season_end、排行榜top_all，daily_share邀请有礼
	var result = {
		index: index,  //给的默认图片
		challenge_index: challenge_index,
		challenge_help: challenge_index,
		season_index: season_index,
		season_end: season_index,
		top_all: index,
		//07.18新增分享位置（邀请有礼）
		daily_share: index, 
		//08.17新增分享结束页
		challenge_end_help: challenge_end_help,
		
		//08.29新增分享位置蒙面歌神的
//		猜歌战场主页
		combat_index: index, 
//		猜歌战场第一名
		combat_index_win: index,
//		猜歌战场被淘汰
		combat_index_lose: index, 
		
		//09.20新增---蒙面歌神分享 combat_share
		combat_share: index,
	}
//	log(`分享的result: ${JSON.stringify(result)}`)
	return result
}

//07.12修改分享语
var shareTitleImg = function(app, pageType, battle_pk_Type) {
		//pageType是页面的类型， battle_pk_Type 页面里其他的类型
//		var that = this
		var that = app   //这里是app
		var list = [] //原来的列表
		
		//07.12新增，设置分享语
//		var shareAllWord = that.data.shareAllWord
		//11.1修改这里需要深复制一份
		var word = JSON.parse(JSON.stringify(that.data.shareAllWord))
		var shareAllWord = word
		
		var result = {}
		log(`分享的pageType: ${pageType}`)
		if(pageType) {
			//如果有pageType，就取。没有的话，就取首页的内容
			if(shareAllWord[pageType]) {
				list = shareAllWord[pageType]
			} else {
				list = shareAllWord['index']
			}
		}
		result = that.GetArrTarge(list)
		return result
	}



//06.01新增，分享成功后的回调
var shareSuccess =  function(let_res) {
	console.log('分享成功的回调', let_res)
	if(let_res.data.c == '0') {
		//07.02修改，去掉提示信息
//		wx.showToast({
////			title: '音符奖励+'+let_res.data.d.score,  //现在返回的是总的，不能拿这个数据
//			title: `音符+10`,
//			icon: 'success',
//			duration: 2000
//		});
	}else{
		if(let_res.data.m) {
			wx.showToast(
			{
				title: let_res.data.m,
				icon: 'none',
				duration: 2000
			})
		}
	}
}

//-------------------------------------
//07.10修改，把分享的内容都提出来
//首页分享titles:	
//var index_let_titles = [{
//		title: '这些抖音神曲你听过吗，超过10首算我输！',
//		imageUrl: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_04/shae_bg_17.jpg'
//	},
//	{
//		title: '哥练的胸肌，你还想不想靠，爱豆的新歌听过了吗',
//		//			imageUrl: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_04/shae_bg_14.jpg'
//		imageUrl: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_05/shae_bg_0531_3.jpg'
//	},
//	{
//		title: '【@我】女版偶像练习生来了，谁的歌才是你的菜',
//		//			imageUrl: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_04/shae_bg_15.jpg'
//		imageUrl: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_05/shae_bg_0531_4.jpg'
//	},
//]
////闯关分享titles:
//var song_let_titles = [{
//		title: '超燃超爆的猜歌游戏，不服来战',
//		//			imageUrl: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_04/shae_bg_13.jpg'
//		imageUrl: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_05/shae_bg_0531_5.jpg'
//	},
//	{
//		title: '这些抖音神曲你听过吗，超过10首算我输！',
//		imageUrl: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_04/shae_bg_17.jpg'
//	},
//	{
//		title: '哥练的胸肌，你还想不想靠，爱豆的新歌听过了吗',
//		//			imageUrl: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_04/shae_bg_14.jpg'
//		imageUrl: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_05/shae_bg_0531_3.jpg'
//	},
//	{
//		title: '【@我】女版偶像练习生来了，谁的歌才是你的菜',
//		//			imageUrl: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_04/shae_bg_15.jpg'
//		imageUrl: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_05/shae_bg_0531_4.jpg'
//	},
//]
////擂台赛titles://这个已经去掉了
//var challenge_let_titles = [{
//		title: '这些歌超好听，猜对还送腾讯视频会员！',
//		imageUrl: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_04/share_songpiao.jpg'
//	},
//	{
//		title: '这些歌你一定听过，猜对送爱奇艺会员！',
//		imageUrl: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_04/share_songpiao.jpg'
//	},
//	{
//		title: '猜歌赢优酷会员！',
//		imageUrl: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_04/share_songpiao.jpg'
//	},
//]
////排位赛titles:
//var match_let_titles = [
//	'[@我]，3千万人都在玩的音乐游戏，点开即玩|',
//	'根本停不下来',
//]
//var match_let_Imgs= [
//	//			'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_04/shae_bg_10.jpg',
//	//			'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_04/shae_bg_11.jpg',
//	//			'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_04/shae_bg_12.jpg',
//	//			'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_04/shae_bg_13.jpg',	
//	'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_05/shae_bg_0531_1.jpg',
//	'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_05/shae_bg_0531_2.jpg',
//	'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_04/shae_bg_12.jpg',
//	'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_04/shae_bg_13.jpg',
//]
//所有的分享语(原来的)
//var shareAllWord = function() {
//	var result = {
//		index_let_titles: index_let_titles,
//		song_let_titles: song_let_titles,
//		challenge_let_titles: challenge_let_titles,
//		match_let_titles: match_let_titles,
//		match_let_Imgs: match_let_Imgs,
//	}
////	log(`分享的result: ${JSON.stringify(result)}`)
//	return result
//}

//var shareTitleImg= function(page, type, battle_pk_Type) {
//		//battle_pk_Type 页面的类型
////		var that = this
//		var that = page
////		var log = that.log()
//		var list = [] //原来的列表
//		var result = {}
//		
//		//07.12新增，设置分享语
//		var shareAllWord = that.data.shareAllWord
//		
//		log(`分享的type: ${type}`)
////		log(`分享的shareAllWord: ${JSON.stringify(shareAllWord)}`)
//		if(type == 'index') {  //index直接改这里的就好
////			list = index_let_titles
//			list = shareAllWord.index_let_titles
//			result = that.GetArrTarge(list)
//			switch(battle_pk_Type) {
//				//好友对战
//				case 'battle_pk':
//					result.title = that.data.userInfo.nickName + '向你发猜歌挑战，谁输谁发红包！';
//					break;
//				default:
//					break;
//			}
//		} else if(type == 'song') {
//			//'song_index' ：闯关首页 
//			//'song'  闯关游戏
//			//"collection"  我的歌单
////			list = song_let_titles
//			list = shareAllWord.song_let_titles
//			result = that.GetArrTarge(list)
//		} else if(type == "challenge") {   //这个模式已经替换成马甲号的小程序
//			//'challenge_index' 擂台赛 和 'challenge_game'擂台游戏页面
////			list = challenge_let_titles
//			list = shareAllWord.challenge_let_titles
//			result = that.GetArrTarge(list)
//		} else if(type == "match") {
//			//'match' 排位赛页面
////			result.title = that.GetArrTarge(match_let_titles)
////			result.imageUrl = that.GetArrTarge(match_let_Imgs)
//			result.title = that.GetArrTarge(shareAllWord.match_let_titles)
//			result.imageUrl = that.GetArrTarge(shareAllWord.match_let_Imgs)
//		} else if(type == "matching_pk") {
//			//"matching_pk"  排位赛PK页面
//			result.title = '【@' + that.data.userInfo.nickName + '】邀你玩超燃超爆的音乐猜歌游戏，一起battle！'
//			result.imageUrl = 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_04/shae_bg_05.png'
//		} else if(type == "rank") {
//			//"matching_pk"  排位赛PK页面
//			result.title = that.GetArrTarge(['超燃超爆的猜歌游戏，看看你排第几', '你是猜歌小渣渣还是中华小曲库？'])
//			result.imageUrl = 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_04/shae_bg_08.jpg'
//		} else if(type == "battle_pk") {
//			//"matching_pk"  排位赛PK页面
//			var let_title = '猜歌达人PK，不服来战！';
//			var let_imageUrl = '';
//			switch(battle_pk_Type) {
//				case 'invitation':
//					let_title = '【@' + that.data.userInfo.nickName + '】邀你玩超燃超爆的音乐猜歌游戏，一起battle！';
//					let_imageUrl = 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_03/shae_bg_02.jpg';
//					break;
//				case 'battle_pk':
//					let_title = '【@' + that.data.userInfo.nickName + '】邀你玩超燃超爆的音乐猜歌游戏，一起battle！';
//					let_imageUrl = 'https://static.zuiqiangyingyu.cn/wechatApp/banma_song/src/public/images_03/shae_bg_02.jpg';
//					break;
//				default:
//					break;
//			}
//			result.title = let_title
//			result.imageUrl = let_imageUrl
//		} else if(type == "activity_04") {
//			//'activity_04' 活动页面: 活动页面是用来做活动跳转的页面,只在做运营活动的时候才会出现的。可以不用管
//			if(that.data.activity_config) {
//				result.title = that.data.activity_config.share.activity.share_title
//				result.imageUrl = that.data.activity_config.share.activity.share_img
//			}
//		}
////		log(`result: ${JSON.stringify(result)}`)
//		return result
//	}

		

module.exports = {
  shareTitleImg: shareTitleImg,
  shareAllWord: shareAllWord, //07.12新增分享语
  shareSuccess: shareSuccess, //06.01新增，分享成功后的回调
}