var log = console.log.bind(console)
var wcache = require("./wcache.js") //引入缓存的机制
var util = require("./util.js");

//获取应用实例
var app = getApp()
////////////////////////////
//所有的音频信息
var url = 'https://static.zuiqiangyingyu.cn/admin/1809/'
var musicAll = {
	match_index: url + 'match_index0912.mp3',
	match_lost: url + 'match_lost0912.mp3',
	match_match: url + 'match_match0912.mp3',
//	match_start: url + 'match_start0912.mp3',
	match_start: 'https://static.zuiqiangyingyu.cn/wechatApp/banma_DrawGuess/src/public/images_02/ready_go.mp3',
	match_win: url + 'match_win0912.mp3',
  	match_ping: url + 'match_ping0912.mp3',

  // 蒙面歌神
	god_index: url + 'god_index.mp3',
	god_match: url + 'god_match.mp3',
	god_count_down: '/audio/' + 'god_count_down.mp3',
	god_out_bird: '/audio/' + 'god_out_bird.mp3',
	god_out_boom: '/audio/' + 'god_out_boom.mp3',
	god_out_gun: '/audio/' + 'god_out_gun.mp3',
	god_lost: '/audio/' + 'god_lost.mp3',
	god_win: '/audio/' + 'god_win.mp3',

}
////////////////////////////
//1.在首页去获取音频信息
var getMusicFromIndex = function(data) {
	var bg_music = data.bg_music
	//设置首页的背景音乐
	app.data.bg_music = bg_music
	if(!app.data.canPlay) {
		return
	}
	playSound(bg_music, true)
}

//2.排位赛的音频
var playMusicMatch = function(style, loop) {
	//這里判断下，是否可以播放
	if(!setPlay(style)) {
		return
	}

	var urls = musicAll[style]
	if(!urls) {
		return
	}
	//播放音乐
	playSound(urls, loop)
}

////////////////////////////
var playSound = function(urls, loop) {
//app.stopAudio()
 app.playAudio({
 	urls,
 	loop,
 })
}

var stopSound = function() {
	app.stopAudio()
}

//////////////////////////////
//新增设置音频播放
var firstSet = function(that) {
	var canPlay = wcache.get('canplay')
	if(canPlay == 1) {
		app.data.canPlay = false
		that.setData({
			canPlay: false,
		})
	}

	log('是否可以播放首页音乐', app.data.canPlay)
}

//這里是设置音频文件
var setCanPlay = function(that) {
	var canPlay = app.data.canPlay
	//如果原来是暂停，那就开始播放
	if(!canPlay) {
		//播放音乐
		var bg_music = app.data.bg_music
		playSound(bg_music, true)

		wcache.put('canplay', 0)
	} else {
		//暂停音乐
//		app.innerAudioContext.pause()
		//09.18新增
		app.pauseSound()

		//停止音乐
		wcache.put('canplay', 1)
	}

	//这里去反转设置
	canPlay = !canPlay
	app.data.canPlay = canPlay
	that.setData({
		canPlay: canPlay,
	})
//	wcache.put('canplay', canPlay)
}

//下面的需要判断是否可以播放
var setPlay = function(type) {
	var canPlay = app.data.canPlay
	var result = true
	if(!canPlay) {
		//播放
		if(needToPlay.indexOf(type) > -1) {
			//不可以播放
			result = false
		}
	}
	return result
}
var needToPlay = [
  'match_index',
  'god_index'
]


module.exports = {
	getMusicFromIndex,
	playMusicMatch,
	playSound,
	stopSound,

	firstSet,
	setCanPlay,
}
