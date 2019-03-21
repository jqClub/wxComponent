### 1、拷贝目录下的js文件到工程目中



### 2、SDK初始化
```bash

 import WonderJsSdk from './WonderJsSdk'

 var wondersdk = new WonderJsSdk(pid,appname,open_id,isDebug);  
 ##参数:
   pid – {必须} [int] 平台标识 1:微信平台 2: 淘金币,3:QQ平台，4：百度小程序。
   appname – {必须} [String] 小程序或小游戏的appname,唯一标识应该和BMS后台产品管理中所配置的名称一致。
   open_id – {必须} [String] 微信平台或者淘宝平台，用户未登陆时可以传空字符串
   isDebug – {可选} [Boolean] 默认不填为生产环境，true为测试环境
   
  wondersdk.init(formAppName = null,share = {},path = null);  #用户打开小程序后调用，init函数只需执行一次，执行多次可能会造成数据统计异常
 
  ##参数:
  param – {非必须} [对象]
       formAppName:广告导流来源，无则null {非必须}
       path：页面路径，无则null {非必须}
       share:分享入口信息，common/game/share_list接口单个源数据，自启动则不填 {非必须}
          share实例:{
                    "id": 0,  //分享id
                    "position": 1, //分享位置
                    "title": "标题", //分享标题
                    "weight": 1,    //分享权重
                    "image": "",    //分享图片
                    "flag": "",     //分享标识
                    "shareTasker" :""  //分享实例附加参数，无可以不填，渠道推广标记，用于统计推广渠道分享得到的新用户
                  }
```


### 2、登录信息初始化
```bash

 wondersdk.setLogin(param={open_id:''});  #用户未登录时初始化后可通过这个参数设置登录信息

 ##参数:
   open_id – {必须} [String] 微信平台或者淘宝平台
```

### 3、页面统计
###### 每个小程序页面都需要添加,小游戏则以场景做为区分，在每个场景的进入和退出，添加相应的代码
###### 后端BMS可以查看到每个页面或者场景，用户的停留时间
```bash

wondersdk.pageShow(page = null) #页面或场景显示的时候调用,page路径默认为自动获取，也可填写覆盖
wondersdk.pageHidden(page = null) #页面或场景隐藏的时候调用,page路径默认为自动获取，也可填写覆盖

```

### 4、事件统计
```bash

wondersdk.statevent(eventname,param)

 ##参数:
   eventname – {必须} [String] 事件标识
   param – {可选} [Object] 以键值对存放的对象，用于自定义统计参数
```






### 5、BMS广告接入 [接口文档](http://rap2.taobao.org/repository/editor?id=8959&itf=343063 "获取分享信息接口文档").

```bash


 wondersdk.getAds(callback); #获取BMS后台配置的广告位置
 wondersdk.getSuspendAds(callback); #获取侧拉悬浮窗位置广告

 wondersdk.statAdClick(param); #广告点击调用
 wondersdk.statAdShow(param); # 广告展示调用
 ##参数:

   callback – {必须} [函数] 广告接口回调函数，SDK不处理回调数据，调用者自行处理广告位置的展示逻辑

   param – {必须} [对象]
           name:用户昵称 {可选}
           gender:用户性别 {可选}
           id:广告id {必选}
           weight:广告权重 {可选}

```
### 6、获取分享信息 [接口文档](http://rap2.taobao.org/repository/editor?id=8959&itf=70807 "分享信息接口文档").
```bash

   wondersdk.getShoreList((res) => {   #获取所有分享信息列表
      console.log(res)
    });
```
```bash
   wondersdk.shoreInfo(position,(res) => {   获取对应位置的分享信息列表
      console.log(res)
    });
    
 ##参数:
    position：分享位置
```


### 7、登录记录

```bash

 wondersdk.loginLog(param = { is_new_user: true, is_auth: false }); #登录日志

 ##参数:

   param – {非必须} [对象]
           is_new_user:是否是新用户，false：否，true：是 {必选}
           is_auth:是否是自动授权，false：否，true：是 {必选}

```
### 8、分享事件
```bash

 wondersdk.share(param = null); #分享记录

 ##参数:

   param – {必须} [对象] 对应common/game/share_list接口分享实例
       {
           "id": 101,      //分享id
           "position": 1,  //分享位置，具体数值参考获取分享信息接口
           "flag":"test",  //分享标识
           "title":"标题",   //分享文案
       }
```
