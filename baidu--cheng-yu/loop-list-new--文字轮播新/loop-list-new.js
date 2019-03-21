/**
 * wd-loop-ad
 * @desc 广告(小程序跳转) 循环显示
 * @需求 1、icon按BMS后台设置的权重排序进行展现
 *       2、用户点击过icon后，icon位自动更换为下一个用户未点击过的icon
 *       3、如所有icon都已点击过，即重新按排序出现
 *       4、用户如点击过一个icon，退出小程序再次进入，icon位也会自动更换为下一个
 * @param {array} [adList] - 从BMS得到的广告列表
 * @param {string} [type] -  需要循环的广告的type
 * @param {string} [flag] - 需要循环的广告的flag
 *
 * @example
 * "usingComponents": {
 *  "wd-loop-ad": "../../components/wd-loop-ad/wd-loop-ad",
 * }
 * 已删除<wd-loop-ad ad-list="{{bmsAdList}}" bind:click="跳转小程序" bind:show="统计小程序显示"></wd-loop-ad>
 *  <wd-loop-ad  ad-list="{{bmsAdIndexaIcon}}" loopControl="{{loopControl}}" flag="index_icon" ></wd-loop-ad>
 * @author: 张晓彬
 * @version: 1.0.1  2018.08.21
 * 			1.0.2  2018.12.14 新接入的bms2广告，没有type，不用管这个字段
 * 
 * 
 */
var log = console.log.bind(console)
//var commonAds = require("../../utils/commonAds.js")  //接入BMS广告后台
//var wcache = require("../../utils/wcache.js") //引入缓存的机制

//获取应用实例
var app = getApp()

//var STORAGE_KEY_ADLIST = 'loop-ad.currentAdList'
//var STORAGE_KEY_INDEX = 'loop-ad.index'


var page = undefined;
var doommList = [];
var danmu_Timeout;
var danmu_num = 0;
var doomm_danmu_Timeout = 0;
class Doomm {
    constructor(text, top, time) {
        this.text = text;
        this.top = top;
        this.time = time;
        let that = this;
        log(22222, that, text, top, time)
        doomm_danmu_Timeout = setTimeout(function() {
            doommList.splice(doommList.indexOf(that), 1); //动画完成，从列表中移除这项
            log(44444, doommList)
            page.setData({
                doommData: doommList
            })
        }, this.time * 1000) //定时器动画完成后执行。
    }
}

Component({
	properties: {
		Winners_List: [],
//		looptype: '',
	},
  data: {
//  background: [
//  	1, 2, 3, 4
//  ],
//  vertical: true,  //滑动方向是否为纵向
//  autoplay: true,  //是否自动切换
//  circular: true,  //是否采用衔接滑动
//  interval: 3000,  //自动切换时间间隔
//  duration: 500,  //动画时长
	Winners_List: [],  //中奖者列表（获取对应的列表）
    doommData: [],  //后面的列表数据（可不改）
  },
created: function() {
	var that = this
	page = this
	
	that.test_radio_box()
},
  methods: {
     //滚动播报
    radio_box: function() {
        var that = this,
            time = 3;

//      //取消定时器
        clearTimeout(danmu_Timeout);

        //没有则退出
        //      if(!app.data.activity_config.reward_list){return}
        //      var radio_list = app.data.activity_config.reward_list ;
        //这里是设置获取到的列表数据，先判断是否为空。不为空，再进行下面的操作（注意，这里的数据名字需要你修改）
        if(!that.data.Winners_List){return}   
        var radio_list = that.data.Winners_List

        doommList.push(new Doomm(radio_list[danmu_num], Math.ceil(Math.random() * 86), time));

        that.setData({
                doommData: doommList
        })
        log(11111111, that.data.doommData, danmu_num, time)
        danmu_num++;
        if(danmu_num == radio_list.length) {
            danmu_num = 0;
        }
        danmu_Timeout = setTimeout(function() {
            that.radio_box()
        }, time * 1000);
    },
    setDataList: function(arr) {
        var that = this
        page = this
        //请求接口并设置到data数据里面（注意：这里需要你去请求接口）
        //getApi(function(res) {
            //回调里面去设置数据，并调用接口
            that.setData({
                Winners_List: arr
            })
            log(11111, that.data.Winners_List)
            //调用radio_box方法
//          that.radio_box()

//			that.test_radio_box()
			//设置动画效果
            that.showDiv()
    },
    
    test_radio_box: function() {
    	var that = this
    	var list = that.data.Winners_List || [1, 2, 3, 4]
    	var len = list.length
    	var index = 0
    	that.setData({
				scrollTop: index * 150,
			})
    	setInterval(function() {
    		index++
    		if(index == len) {
    			index = 0
    		}
//  		that.setData({
//  			doommData: list.slice(index, index+1)
//  		})
			that.setData({
				scrollTop: index * 150,
			})
    		log(111111, that.data.scrollTop)
    	}, 3000)
    },
    
     showDiv: function() {
        var that = this
        //      top: {{styleHwds.top + 'px'}}; opacity: {{styleHwds.opacity}}
        var str = 'styleHwds.opacity';
        var str1 = 'styleHwds.top';
        var i = 0
        var toplast = 30 //距离顶部的高度
        var list = that.data.Winners_List
        var len = list.length

        function startMove() {
            that.setData({
                [str]: 1
            })
            var t = setInterval(function() {
            	log(99999999)
                var top = that.data.styleHwds.top
                if(top == toplast) {
                    clearInterval(t)
                    setTimeout(function() {
                        that.setData({
                            [str]: 0
                        })
                    }, 500)
                    return
                }
                var speed = (toplast - top) / 10;
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                that.setData({
                    [str1]: top + speed,
                })
            }, 30);
        }
        var cphr = function() {
            that.setData({
                [str]: 0,
                [str1]: 150,
                winnersNow: i % len,
            })
            startMove()
        }
        var show = function() {
            cphr()
            var timer = setInterval(function() {
                i++
                cphr()
            }, 2000)
            that.setData({
                sgame_match_timeout: timer,
            })
        }
        //      show()
        if(len != 0) {
            show()
        }
    }
    
  }
})
