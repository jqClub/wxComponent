export const apiUrl = {
    gameAdsV2: '/common/game/v2/ads',
    adShit: '/statistics/ad/hit',
    adsShow: '/statistics/ad/show',
    loginLog: '/statistics/login_log',
    statUrl: '/statistics/user_behavior_log',
    shoreList: '/common/game/share_list'
};

export class ApiRequst {

    /**
     * 构造函数
     * @param baseUrl
     * @param pid
     */
    constructor(baseUrl, pid) {
        this.baseUrl = baseUrl;
        this.pid = pid;
        this.adapterApi = this.adapterCallApi()
    }
    /**
     * 请求方式
     * @param api
     * @param method
     * @param data
     * @param header
     * @param callback
     */
    callApi(api,method, data,header, callback = (data) => {
    }) {

        let url = this.baseUrl + api;

        try{
            this.adapterApi(url,method, data,header, callback);
        }catch(e){   //尝试以http原生请求来处理

            if(typeof XMLHttpRequest !== "undefined"){
                this.xmlHttpRequest(url,method, data,header, callback)
            }
            console.warn('wonder sdk','兼容平台请求：',e)

        }


    }
    //适配请求
    adapterCallApi(){

      var  that = this;
      var adapterCall = {
          1:(url,method, data,header, callback = (data) => {  //微信
          })=>{
              wx.request({
                  method: method,
                  url: url,
                  data: data,
                  header: header,
                  success(res) {
                      if (callback && typeof callback === 'function') {
                          callback(res.data);
                      }
                  },
                  error(error) {
                      console.error('wonder sdk', error)
                  }
              })
          },
          2:(url,method, data,header, callback = (data) => {  //淘金币
          })=>{
              that.xmlHttpRequest(url,method, data,header, callback)
          },
          3:(url,method, data,header, callback = (data) => {   //QQ
          })=>{
              that.xmlHttpRequest(url,method, data,header, callback)
          },
          4:(url,method, data,header, callback = (data) => {   //百度小程序
          })=>{
              swan.request({
                  url: url,
                  method: method,
                  dataType: 'json',
                  data: data,
                  header: header,
                  success: function (res) {
                      if (callback && typeof callback === 'function') {
                          callback(res.data);
                      }
                  },
                  fail: function (err) {
                      console.error('wonder sdk', error)
                  }
              });
          },
      };

      if (adapterCall[that.pid] !== undefined){
        return adapterCall[that.pid];
      }else {
          console.warn("wonder sdk","未适配请求，使用原生请求");
          return (url,method, data,header, callback = (data) => {
          })=>{
              that.xmlHttpRequest(url,method, data,header, callback)
          }
      }

    }

    /**
     * 原生请求
     * @param url
     * @param method
     * @param data
     * @param header
     * @param callback
     */
    xmlHttpRequest(url,method, data,header, callback = (data) => {
    }){
        var that = this
        let xhr = new XMLHttpRequest();
        //1.发起请求
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4){
                if(xhr.status >= 200 && xhr.status < 400){
                    let res = xhr.responseText;
                    //处理方法
                    if (callback && typeof callback === 'function') {
                        callback(JSON.parse(res));
                    }
                }else{
                    let res = xhr.responseText;
                    //处理方法
                    console.log("请求失败",res)
                }
            }

        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");//缺少这句，后台无法获取参数
        var formData = that.parseParams(data);
        xhr.send(formData);
    }

    parseParams(data = {}) {     //转成url参数
        try {
            var tempArr = [];
            for (var i in data) {
                var key = encodeURIComponent(i);
                var value = encodeURIComponent(data[i]);
                tempArr.push(key + '=' + value);
            }
            return tempArr.join('&');
        } catch (err) {
            return '';
        }
    }



}


