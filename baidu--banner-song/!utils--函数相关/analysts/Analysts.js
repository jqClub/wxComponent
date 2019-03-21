const platformList = {
    1:{
        code : 'weixin',
        name : '微信平台',
        pid:1
    },
    2:{
        code : 'taobao',
        name : '淘金币',
        pid:2
    },
    3:{
        code : 'qq',
        name : 'QQ平台',
        pid:3
    },
    4:{
        code : 'baidu',
        name : '百度小程序',
        pid: 4
    }
};

export default class Analysts {

    constructor(pid){
        if ( !platformList.hasOwnProperty(pid)){
            throw new Error( '未支持渠道' );
        }
        this.pid = pid;
        this.platform = platformList[this.pid];
        this.baseHeader= {
            'Accept': 'application/json, */*',
           // 'Content-Type': 'multipart/form-data'
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }

    doStart() {
        console.log('初始化');
    }

    statEvent(ventname, param){
        console.log('事件统计');
    }

    loginLog(param = {is_new_user: false}){
        console.log('登录日志',param);
    }

    logger(log){

    }


}
