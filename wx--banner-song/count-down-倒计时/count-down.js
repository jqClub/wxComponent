/* 

<my-count-down class="count-down" myprop="{{countDown}}"></my-count-down>
<my-count-down class="count-down" myprop="{{countDown}}" radius="20"></my-count-down>

countDown: {
  time: 10, //总时间
},

that.setData({
  'countDown.type': 'start', //开始倒数
  'countDown.type': 'end', //结束倒数
  'countDown.type': 'paus', //暂停倒数
  'countDown.type': 'getTime', //获取时间
});

*/

//import c from '../../utils/console.js';

let ctx;
let time = 10;
let second = 0; //秒数
let secondId; //秒数定时器id
let arc = 0; //弧度

let app = getApp();
let appData = app.data;
let comp;

let compObj = {
  options: {
    multipleSlots: true,
  },
  externalClasses: ['myclass'],
  data: {},
  properties: {
    myprop: {
      type: Object,
      value: {
        type: '', //start:开始;end:结束;paus:暂停;continue:继续;getTime:获取时间;
        time: 10, //总时间
      },
      observer(newVal, oldVal, funName) {
        comp = this;
        switch (newVal.type) {
          // 开始倒数
          case 'start': {
          	second = time
            comp.start();
            break;
          }

          // 结束倒数
          case 'end': {
            comp.end();
            break;
          }

          // 暂停倒数
          case 'paus': {
            comp.paus();
            break;
          }

          // 继续倒数
          case 'continue': {
            comp.continue();
            break;
          }

          // 获取时间
          case 'getTime': {
            comp.getTime();
            break;
          }

          default: {
            ctx = wx.createCanvasContext('myCanvas', comp);

            second = time = newVal.time;
            comp.cvs(second);
            break;
          }
        }
      },
    },
    radius: {
      type: Number,
      value: 30,
      observer(newVal, oldVal, funName) {
        comp = this;
      },
    },
  },
  attached() {
    comp = this;
    comp.setData({
      userInfo: appData.userInfo,
    });
  },
  detached() {
    clearInterval(secondId);
  },
  methods: {
    cvs(msec) {
      let radius = comp.data.radius;

      ctx.setTextAlign('center');
      ctx.setTextBaseline('middle');
      ctx.setLineWidth(6);

      ctx.arc(radius, radius, radius - 3, 0, 2 * Math.PI);
      ctx.setStrokeStyle('#44ffab');
      ctx.stroke();

      ctx.beginPath();

      ctx.arc(
        radius,
        radius,
        radius - 3,
        1.5 * Math.PI,
        (3.5 - msec / time * 2) * Math.PI
      );
      ctx.setStrokeStyle('#645771');
      ctx.stroke();

//    if (second) {
//      ctx.setFillStyle('#44ffab');
//      ctx.setFontSize(30);
//      ctx.fillText(second, radius, radius);
//    } else {
//      ctx.setFillStyle('#44ffab');
//      ctx.setFontSize(16);
//      ctx.fillText('时间到', radius, radius);
//    }

      ctx.draw();
    },

    // 开始倒数
    start() {
      clearInterval(secondId); //先清除旧定时器

      secondId = setInterval(() => {
        if (arc < 50) {
          arc++;
        } else {
          arc = 0;
          second--;
        }

        comp.cvs(second - arc / 50);

        if (second <= 0) {
          comp.end();
        }
      }, 20);
    },

    // 结束倒数
    end() {
      clearInterval(secondId);
      arc = 0;
      second = 0;
      comp.cvs(0);

      comp.getTime();
    },

    // 暂停倒数
    paus() {
      clearInterval(secondId);
    },

    // 继续倒数
    continue() {
      comp.start();
    },

    // 获取时间
    getTime() {
      let data = comp.data;
      comp.triggerEvent(
        'myevent',
        {
          comp: 'timeout',
          consume: data.myprop.time - second,
        },
        {
          bubbles: true,
          composed: true,
        }
      );
    },
  },
};

Component(compObj);
