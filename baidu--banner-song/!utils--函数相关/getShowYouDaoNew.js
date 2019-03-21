//	//这里是配置的列表
//	var controlAll= {
//		//显示广告的banner
//		show_ad: {
//			all: 1,
//			no: 0,
//			ip: {
//				0: 0,
//				1: 1,
//			}
//		},
//		//首页显示导流icon
//		show_icon: {
//			all: 1,
//			no: 0,
//			ip: {
//				0: 0,
//				1: 1,
//			}
//		},
//		//控制结果页面的跳动
//		result_bounce: {
//			all: 1,
//			no: 0,
//			ip: {
//				0: 0,
//				1: 1,
//			}
//		},
//		
//		//控制是否显示宝箱功能
//		box: {
//			all: 1,
//			no: 0,
//			ip: {
//				0: 0,
//				1: 1,
//			}
//		},	
//		//19.2.27新增——底部内容总开关，控制底部内容是否展示（all：全部展示；ip：屏蔽北广深；no：全部不展示）
//		banner: {
//			all: 1,
//			no: 0,
//			ip: {
//				0: 0,
//				1: 1,
//			}
//		},
//		//19.2.27新增——答题页导流位，控制底部内容是否展示（all：全部展示；ip：屏蔽北广深；no：全部不展示）
//		result_games: {
//			all: 1,
//			no: 0,
//			ip: {
//				0: 0,
//				1: 1,
//			}
//		},
//	}

//不用设置的参数
var noSet = ['bannerTime', 'isAudit']

const config = {
  baseUrl: 'https://game.zuiqiangyingyu.net',
  openLog: false, // 是否打印
}

const log = function(...args) {
  if (config.openLog) {
    console.log.call(console, 'getShowYouDao', ...args)
  }
}

export default {

  data: null, // 主数据
  config: {
    appName: null,
    configVersion: null,
  },

  getIp() {
    return new Promise((resolve, reject) => {
      swan.request({
        url: config.baseUrl + '/common/ip/is_enable',
        data: {
          app_name: this.config.appName,
        },
        success: (result) => {
          log('ip请求成功', result.data)
          resolve(result.data)
        },
        fail: (e) => {
          log('ip请求失败', e)
          reject(e)
        },
      })
    })
  },

  getConfig() {
    return new Promise((resolve, reject) => {
      swan.request({
        url: config.baseUrl + '/common/config/info',
        data: {
          app_name: this.config.appName,
          version: this.config.configVersion,
        },
        success: (result) => {
          log('config请求成功', result.data)
          resolve(result.data)
        },
        fail: (e) => {
          log('config请求失败', e)
          reject(e)
        },
      })
    })
  },

  run(appName, configVersion) {
    if (!appName) {
      throw new Error('未传入appName')
    }
    if (!configVersion) {
      throw new Error('未传入configVersion')
    }
    this.config.appName = appName
    this.config.configVersion = configVersion

    return new Promise((resolve, reject) => {
      if (this.data !== null) {
        log('数据已存在，直接返回')
        resolve(this.data)
      } else {
        log('数据不存在，发送请求')
        Promise.all([this.getIp(), this.getConfig()])
          .then(res => {
            log('两个请求都成功了', res)
            const [ipRes, configRes] = res
            if (ipRes.code === 0 && configRes.code === 0) {
              // is_enable 0是不显示 ** 内容，1是显示 ** 内容
			 				this.data = commonControlEnter(configRes.data, ipRes.data.is_enable)
			 				
			 				//19.3.20新增所有的控制
			 				this.data = controlAllNo(this.data)

              resolve(this.data)
            } else {
              log('请求有误')
              resolve(false)
            }
          })
          .catch(e => {
            log('getShowYouDao 错误', e)
            resolve(false)
          })
      }
    })
  },
}

	//去循环遍历，所有的配置信息
	var commonControlEnter= function(allControl, ipControl) {
		var that = this
////		所有的对象
		var controlBms = {}

		//循环遍历
		for(var key in allControl) {
			var value = allControl[key]
//			var lastValue = commonControl(key, value, allControl, ipControl)

			var lastValue = setDefaultValues(key, value, allControl, ipControl)

			//12.27因为需要兼容之前 的写法，所以这里直接去设置,不统一去设置
			controlBms[key] = lastValue
		}
        log('-bms配置对应的是否显示-', controlBms)
		return controlBms
	}
//	//单独去设置不同的值
//	var commonControl= function(key, value, allControl, ipControl) {
//		var that = this
//		log('commonControl', key, value, allControl, ipControl)
//      var control = controlAll[key]
//      // 12.29修改，如果没有设置配置，就返回原来的值
//      if(!control) {
//          log('-没有配置bms-controlAll参数，直接返回原值-', value)
//          return value
//      }
//
//		var result = control['no'] //默认给no的值
//		if(value == 'ip') {
//			result = control[value][ipControl]
//		} else {
//			result = control[value]
//		}
//		return result
//	}
	
	
	//19.2.26新增一个总开关
var controlAllNo = function(con) {
	if(con.isAudit == 1) {
		for(var key in con) {
			if(noSet.indexOf(key) == -1) {
				con[key] = 0
			}
		}
	}
	return con
}
	
	//19.3.1新增，设置一个默认的值,不用每次都去添加配置信息
	var setDefaultValues =  function(key, value, allControl, ipControl) {
		var that = this
		var obj = {
			all: 1,
			no: 0,
			ip: {
				0: 0,
				1: 1,
			}
		}
		//得到所有key的数组
		var keys = Object.keys(obj)
		
		//1.判断是否存在里面，如果是存在，就去设置，否则返回原来的值
		if(keys.indexOf(value) == -1) {
			log('-没有配置bms-controlAll参数，直接返回原值-', value)
            return value
		}
		
		//2.根据key来返回相应的值
		var result = obj['no'] //默认给no的值
		if(value == 'ip') {
			result = obj[value][ipControl]
		} else {
			result = obj[value]
		}
		return result
	}
