/*

<my-rain id="rain" />;

this.rain = this.selectComponent('#rain');

// 'https://static.zuiqiangyingyu.cn/wechatApp/banma_DrawGuess/src/public/images/star.png'
// 'https://static.zuiqiangyingyu.cn/wechatApp/banma_DrawGuess/src/public/images/yinghua.png'
// 'https://static.zuiqiangyingyu.cn/wechatApp/banma_DrawGuess/src/public/images/money.png'
// 'https://static.zuiqiangyingyu.cn/wechatApp/banma_DrawGuess/src/public/images/jidan.png'
// 'https://static.zuiqiangyingyu.cn/wechatApp/banma_DrawGuess/src/public/images/christmas-gift.png'
this.rain.init(SRC); // 预生成元素
this.rain.init(SRC, 60); // 设置数量, 默认为30

this.rain.playRain(); //播放动画

 */

//import c from '../../utils/console';

//const app = getApp();
//const appData = app.data;
let comp;

//let id = 0; // 用做唯一的wx:key
class Item {
  constructor(img, delay) {
    this.img = img;
    this.delay = delay;

    this.time = Math.random() * 2 + 1;
    this.size = Math.random() * 30 + 15;
    this.left = Math.floor(Math.random() * 100);

//  this.id = id;
//  id += 1;
  }
}

var log = console.log.bind(console)

const compObj = {
  data: {
    list: [],
    isPlay: false, // 是否开始播放动画
  },
  properties: {},
  attached() {
    comp = this;
  },
  
	detached: function() {
		var that = this
		//组件移除时执行
		that.clearTimer()
	},
	clearTimer: function() {
		var that = this
		//19.3.14新增_清空原来的定时器,防止卡住
		that.aboutAd.clearInterTime('timerEnd')
	},
  methods: {
    init(img, num = 30) {
      const list = [];
      let delay = 0;
      for (let i = 0; i < num; i += 1) {
        switch (true) {
          case i < num * 0.5: {
            delay += 0.025;
            break;
          }
          case i < num * 0.7: {
            delay += 0.04;
            break;
          }
          case i < num * 0.85: {
            delay += 0.065;
            break;
          }
          case i < num: {
            delay += 0.08;
            break;
          }

          default: {
            break;
          }
        }

        const item = new Item(img, delay);
        list.push(item);
      }

      comp.setData({ list });
    },
    playRain() {
    	var that = this
    	//19.3.14新增_清空原来的定时器,防止卡住
    	that.clearTimer()
    	
      this.setData({
        isPlay: true, // 开始播放动画
      });

	// 12.12修改——调整播放的时间，到时间后清除缓存
      that.aboutAd.timerEnd = setTimeout(() => {
        this.setData({
          list: [],
          isPlay: false,
        });
      }, 3500);
//    }, 2500);
    },
    
    //19.3.14新增，清空定时器
	aboutAd : {
		clearInterTime: function(name) {
			var self = this
			if(self[name]) {
				clearTimeout(self[name])
				self[name] = null
			}
		},
		timerEnd: null,  //按钮上移的定时器
	},
  },
};

Component(compObj);
