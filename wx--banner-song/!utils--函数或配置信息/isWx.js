var log = console.log.bind(console)

var returnTitle = function(type) {
	if(type == 1) {
		log('得到所有的微信授权信息--微信调用接口失败了')
	} else if(type == 2) {
		log('得到所有的微信授权信息，但是用户没有授权')
	} else if(type == 3) {
		log('得到所有的微信授权信息，用户有授权，但是拿到用户授权信息--微信调用接口失败了')
	}
}
//得到所有的微信授权信息
var getSetting = function() {
    return new Promise(function(resolve, reject) {
        wx.getSetting({
             success: (res) => {
                 resolve(res)
              },
              fail: function() {
                reject('1')
              }
        })
    })
}
//是否有微信授权信息
var isGetWx = function(res) {
    var result = false
    if(res.authSetting) {
        if(res.authSetting['scope.userInfo']) {
          result = true
        }
    }
    return new Promise(function(resolve, reject) {
        if(result) {
            resolve()
        } else {
            reject('2')
        } 
    })
}
//是否有微信授权过
var getWxUbqr = function(callBack) {
    var getAll = getSetting()
    getAll.then(isGetWx).then(function() {
        callBack.success()
    }).catch(function(res) {
    	returnTitle(res)  //判断是什么错误
        callBack.fail(res)
    })
}

//获得微信授权的信息
var getUserInfo = function() {
    return new Promise(function(resolve, reject) {
        wx.login({
            success: function(res) {
                if(res.code) {
                    var code = res.code
                        //有授权的
                        wx.getUserInfo({
                            type:'login',
                            //07.12新增，显示简体中文
                            lang: 'zh_CN',  
                            success : function(res){
                                res.code = code //把code添加进去
                                resolve(res)
                            },
                            fail: function() {
                               reject('3')
                            }
                        })
                }
            }
        })
    })
}

//直接去登录
var wxLogin = function() {
	return new Promise(function(resolve, reject) {
        wx.login({
            success: function(res) {
                if(res.code) {
                    var code = res.code
                    resolve(res)
                } else {
                	console.log('调用接口wx.login() 获取临时登录凭证（code）失败')
                }
            },
            fail: function() {
            	console.log('调用接口wx.login()失败')
            },
        })
    })
}

//获得是否已经有微信授权过（函数）
var getWx = function(callBack) {
    var getAll = getSetting()
    getAll.then(isGetWx).then(getUserInfo).then(function(res) {
        callBack.success(res)
    }).catch(function(res) {
    	returnTitle(res)  //判断是什么错误
        callBack.fail(res)
    })
}

module.exports = {
//getAll: getAll,
  getWxUbqr: getWxUbqr,
  getUserInfo: getUserInfo,
  getWx:getWx,
  wxLogin,
}   