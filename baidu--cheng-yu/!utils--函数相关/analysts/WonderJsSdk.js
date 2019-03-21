import {apiUrl, ApiRequst} from './Api'
import Analysts from "./Analysts";

/**
 * 对应不同平台的工具
 */
class PlatformUtil {

    constructor(pid) {

        this.pid = pid;


        try{

            if (this.pid === 1 ){

                if( (typeof wx ) !== "undefined"){
                    const res = wx.getSystemInfoSync();
                    if (res.benchmarkLevel !== undefined){
                        //仅安卓可用
                        this.wechatType = 1;
                        console.log("当前是微信小游戏")
                    }else{

                        if (wx.hasOwnProperty('canIUse')) {
                            this.wechatType = 2;
                            console.log("当前是微信小程序")
                        }else{
                            this.wechatType = 1;
                            console.log("当前是微信小游戏")
                        }

                    }
                }else{
                    console.warn('wonder sdk',"当前渠道不是微信渠道！")

                }

            }
        }catch(e){
            console.warn('wonder sdk',"平台判断错误",e)
        }
    }

    getPageName(){

        var url = '';
        switch (this.pid) {
            case 1:
                try {
                    if (this.wechatType === 2) {
                        const pages = getCurrentPages(); //获取加载的页面
                        const currentPage = pages[pages.length - 1]; //获取当前页面的对象
                        url = currentPage.route; //当前页面url
                    } else {
                        url = cc.director.getScene().name
                    }
                }catch(error){
                    console.warn("wonder sdk",error)
                }

                break;
            case 2:
                try {
                    url = cc.director.getScene().name;
                } catch (error) {
                    console.warn("wonder sdk",error)
                }
                break
        }

        return url;

    }

}

export default class WonderJsSdk extends Analysts {

    constructor(pid, app_name, open_id = '', isDebug) {
        super(pid);
        if (!app_name) {
            console.error('wonder sdk','统计SDK初始化失败，缺少参数app_name');
            return;
        }
        if (!open_id) {
            open_id = 'onLogin';
            console.warn('wonder sdk','统计SDK初始化,用户未登录');
        }
        this.app_name = app_name;
        this.open_id = open_id;
        this.hasInit = false;
        var baseUrl = isDebug ? 'https://t3game.zuiqiangyingyu.net' : 'https://game.zuiqiangyingyu.net';
        this.apiRequest = new ApiRequst(baseUrl, pid);
        this.platformUtil = new PlatformUtil(pid);
        this.ads = [];
        this.shoreList = [];
    }

    init(formAppName = null,share = {},path = null) {
        if (!this.hasInit) {
            this.doStart(formAppName,share,path);
            console.log("WonderSDK初始化成功")
            this.hasInit = true;
        }
    }

    getvesion() {
        return "0.0.3"
    }

    callApi(apiUrl, method, data, callback = (res) => {
        console.log(res)
    }) {
        try {
            this.apiRequest.callApi(apiUrl, method, data,
                this.baseHeader, callback
            )
        }catch (e) {
            callback({
                code: 500,
                data: {},
                msg: '服务器请求失败'
            })
            console.error('wonder sdk',e)
        }
    }

    /**
     * 启动事件
     * @param formAppName
     * @param share
     */
    doStart(formAppName = null,share = {},path) {

        var param ={
            "source":formAppName,    //广告导流来源，无则null
            "path": path,
            "share_enter": share
        };
        let reqParam = {
            event: 'start_up',
            param: JSON.stringify(param)
        };
        this.statRequest(reqParam);
    }

    /**
     * 初始化获取BMS后台配置的广告数据
     * @param callback
     */
    getAds(callback = (res) => {
        console.log(res)
    }) {
        var that = this;

        try {
            that.callApi(apiUrl.gameAdsV2, 'POST', {app_name: this.app_name}, (res) => {

                if(res.code !== undefined && parseInt(res.code) === 0){
                    that.ads = res.data.list;
                }


                if (callback && typeof callback === 'function') {
                    callback(that.ads);
                }

            })
        }catch (e) {
            if (callback && typeof callback === 'function') {
                callback(that.ads);
            }
            console.log(e)
        }
    }

    //获取产品共用的悬浮窗广告位
    getSuspendAds(callback = () => {
    }, flag = 'sdk_suspend_ads') {
        let suspendAds = [];
        var that = this;

        if (that.ads.length === 0) {
            that.getAds(function (list) {
                that.ads.forEach((value, key) => {
                    if (value.flag === flag) {
                        suspendAds.push(value)
                    }
                });
                if (callback && typeof callback === 'function') {
                    callback(suspendAds);
                }
            })
        } else {
            that.ads.forEach((value, key) => {
                if (value.flag === flag) {
                    suspendAds.push(value)
                }
            });
            if (callback && typeof callback === 'function') {
                callback(suspendAds);
            }
        }


    }

    /**
     * 广告点击事件
     * @param param
     * @param callback
     */
    statAdClick(param = {}, callback) {

        if (typeof param !== 'object') {

            console.error('wonder sdk','param类型错误，要是对象');
            return;

        } else if (param.ad_id === undefined) {

            if(param.flag !== undefined && param.id !== undefined){
                param.ad_id = param.id
            }else {
                console.error('wonder sdk','param缺少ad_id');
                return;
            }


        }
        let reqParam = {
            event: 'ad',
            param: JSON.stringify({
                action:'hit',
                name: param.name,
                gender: param.gender,
                ad_id: param.ad_id,
                weight: param.weight
            })
        };

        this.statRequest(reqParam)
        // this.callApi(apiUrl.adShit, 'POST', {
        //
        //     app_name: this.app_name,
        //     open_id: this.open_id,
        //     platform_name: this.platform.code,
        //     name: param.name,
        //     gender: param.gender,
        //     ad_id: param.ad_id,
        //     weight: param.weight
        //
        // }, callback)
    }

    share(share = null){
        let reqParam = {
            event: 'share',
            param: JSON.stringify(share)
        };
        this.statRequest(reqParam)
    }
    statAdShow(param, callback) {

        try {
            if (typeof param !== 'object') {
                console.error('wonder sdk','param类型错误，要是对象');
                return;
            } else if (param.ad_id === undefined) {

                if(param.flag !== undefined && param.id !== undefined){
                    param.ad_id = param.id
                }else {
                    console.error('wonder sdk','param缺少ad_id');
                    return;
                }

            }

            let reqParam = {
                event: 'ad',
                param: JSON.stringify({
                    action: 'show',
                    name: param.name,
                    gender: param.gender,
                    ad_id: param.ad_id,
                    weight: param.weight
                })
            }

            this.statRequest(reqParam, callback)

            // this.callApi(apiUrl.adsShow, 'POST', {
            //     app_name: this.app_name,
            //     open_id: this.open_id,
            //     platform_name: this.platform.code,
            //     gender: param.gender,
            //     name: param.name,
            //     ad_id: param.ad_id,
            //     weight: param.weight
            // }, callback)

        } catch (e) {
            console.error(e)
        }
    }

    /**
     * 页面展示
     * @param page
     */
    pageShow(page = null) {
        try {
            var that = this;
            //页面开始时间
            this.start_time = Date.parse(new Date());
            const current_page = (page === null) ? that.platformUtil.getPageName() : page;
            let reqParam = {
                event: 'show',
                param: JSON.stringify({
                    page: current_page
                })
            };
            this.statRequest(reqParam)
        } catch (e) {
            console.error(e)
        }

    }

    /**
     * 页面隐藏
     * @param page
     */
    pageHidden(page = null) {
        try {
            var that = this;
            this.end_time = Date.parse(new Date());
            const stay_durtion = this.end_time - this.start_time;
            const current_page = (page === null) ? that.platformUtil.getPageName() : page;
            let reqParam = {
                event: 'hidden',
                param: JSON.stringify({
                    page: current_page,
                    durtion: stay_durtion / 1000
                })
            };
            that.statRequest(reqParam)

        } catch (e) {
            console.error(e)
        }

    }

    /**
     * 统计数据上报接口
     * @param data
     * @param callBack
     */
    statRequest(data, callBack) {
        this.callApi(apiUrl.statUrl, 'POST', Object.assign(data, this.commonparam()), callBack)
    }

    /**
     * 设置用户登录信息登录
     * @param info
     */
    setLogin(info = {open_id:''}){
        this.open_id = info.open_id;
    }
    /**
     * 共用上报数据
     * @returns {{app_name: *, open_id: *, platform_name: *}}
     */
    commonparam() {
        return {
            'app_name': this.app_name,
            'open_id': this.open_id,
            'platform_name': this.platform.code
        }
    }

    /**
     * 上报事件
     * @param eventname
     * @param param
     */
    statevent(eventname, param) {

        try {
            if (!eventname) {
                console.error('wonder sdk','事件名称不能为空');
                return;
            }

            let reqParam;

            if (arguments.length > 1) {
                if (typeof param !== 'object') {
                    console.error('wonder sdk','param类型错误，要是对象');
                    return;
                }
                reqParam = {
                    event: eventname,
                    param: JSON.stringify(param)
                };

            } else {
                reqParam = {
                    event: eventname,
                };
            }
            this.statRequest(reqParam)
        } catch (e) {
            console.error(e)
        }
    }

    /**
     * 登录日志
     * @param param
     *   Boolean is_new_user 是否是新用户
     */
    loginLog(param = {is_new_user: false,is_auth:false}) {
        this.statevent('login',
            {
                'is_new':(param.is_new_user === undefined ? false:param.is_new_user ),
                "is_auth": (param.is_auth === undefined ? false:param.is_auth )
            });
    }

    /**
     * 获取分享列表
     * @param callBack
     */
    getShoreList(callBack) {
        try {
            this.callApi(apiUrl.shoreList, 'GET', this.commonparam(), (res) => {
                if (res.code !== undefined && parseInt(res.code) === 0) {
                    if (callBack && typeof callBack === 'function') {
                        callBack(res.data.list)
                    }
                }
            });
        } catch (e) {
            if (callBack && typeof callBack === 'function') {
                callBack([])
            }
            console.log(e)
        }
    }

    /**
     * 获取指定分享广告位
     * @param position
     * @param callBack
     */
    shoreInfo(position, callBack) {

        var showInfo = [];
        var that = this;
        try {
            if (!position) {
                console.error('wonder sdk','position不能为空');
                return
            }
            if (that.shoreList.length > 0) {
                that.shoreList.forEach((v, index) => {
                    if (parseInt(v.position) === position) {
                        showInfo.push(v);
                    }
                });
                if (callBack && typeof callBack === 'function') {
                    callBack(showInfo);
                }
                return
            }
            //获取指定分享广告位
            that.getShoreList((res) => {
                that.shoreList = res;
                that.shoreList.forEach((v, index) => {
                    if (parseInt(v.position) === position) {
                        showInfo.push(v);
                    }
                });

                if (callBack && typeof callBack === 'function') {
                    callBack(showInfo);
                }

            })
        } catch (e) {
            callBack(showInfo);
            console.error('wonder sdk',e)
        }
    }
}


