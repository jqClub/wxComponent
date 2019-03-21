//1	ads	all,ip,no	控制答题页等界面的导流口是否开启，包括答题页导流icon（all：全部展示；ip：屏蔽广深；no：全部不展示）					
//2	banner	all,ip,no	控制答对/答错弹窗界面弹窗上移误触广告条（all：全部展示；ip：屏蔽广深；no：全部不展示）					
//3	red	all,ip,no	控制全部红包功能界面、是否展示（all：全部展示；ip：屏蔽广深；no：全部不展示）					
//4	energy	all,ip,no	控制能量值按钮,礼包功能界面，即全部能量值按钮是否展示（all：全部展示；ip：屏蔽广深；no：全部不展示）					
//5	music	1,0	控制游戏背景音乐是否开启（1：开启；0：不开启）					
//6	sound	1,0	控制游戏其他全部音效，即全部按钮音效、界面音效等是否开启（1：开启；0：不开启）					
//7	bottomAds	all,ip,no	控制答题页底部导流豆腐块是否开启（all：全部展示；ip：屏蔽广深；no：全部不展示）					
//8	box	all,ip,no	控制宝箱弹窗是否开启（all：全部展示；ip：屏蔽广深；no：全部不展示）					
//9	isAudit	1,0	总开关（包括全部控制，和广告条是否显示，0是非审核版本，1是审核版本					
//10	feedbackBtn	all,ip,no	控制投诉是否开启（all：全部展示；ip：屏蔽广深；no：全部不展示）					

//这里是配置的列表
	var controlAll= {
		//显示广告的banner
		ads: {
			all: 1,
			no: 0,
			ip: {
				0: 0,
				1: 1,
			}
		},
		banner: {
			all: 1,
			no: 0,
			ip: {
				0: 0,
				1: 1,
			}
		},
		banner_touch: {
			all: 1,
			no: 0,
			ip: {
				0: 0,
				1: 1,
			}
		},
		red: {
			all: 1,
			no: 0,
			ip: {
				0: 0,
				1: 1,
			}
		},
		energy: {
			all: 1,
			no: 0,
			ip: {
				0: 0,
				1: 1,
			}
		},
		bottomAds: {
			all: 1,
			no: 0,
			ip: {
				0: 0,
				1: 1,
			}
		},
		box: {
			all: 1,
			no: 0,
			ip: {
				0: 0,
				1: 1,
			}
		},
		feedbackBtn: {
			all: 1,
			no: 0,
			ip: {
				0: 0,
				1: 1,
			}
		},
		//控制全部弹窗界面的广告条是否展示（all：全部展示；ip：屏蔽广深；no：全部不展示）
		banner_result: {
			all: 1,
			no: 0,
			ip: {
				0: 0,
				1: 1,
			}
		},
	}

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
			 
			 //19.2.26新增一个总开关
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

//19.2.26新增一个总开关
var controlAllNo = function(con) {
	var names = Object.keys(controlAll)
	
	if(con.isAudit) {
		for(var key in con) {
			if(names.indexOf(key) > -1) {
				con[key] = 0
			}
		}
	}
	return con
}

	//去循环遍历，所有的配置信息
	var commonControlEnter= function(allControl, ipControl) {
		var that = this
////		所有的对象
		var controlBms = {}

		//循环遍历
		for(var key in allControl) {
			var value = allControl[key]
			var lastValue = commonControl(key, value, allControl, ipControl)
			//12.27因为需要兼容之前 的写法，所以这里直接去设置,不统一去设置
			controlBms[key] = lastValue
		}
        log('-bms配置对应的是否显示-', controlBms)
		return controlBms
	}
	//单独去设置不同的值
	var commonControl= function(key, value, allControl, ipControl) {
		var that = this
        var control = controlAll[key]
        // 12.29修改，如果没有设置配置，就返回原来的值
        if(!control) {
            log('-没有配置bms-controlAll参数，直接返回原值-', value)
            return value
        }

		var result = control['no'] //默认给no的值
		if(value == 'ip') {
			result = control[value][ipControl]
		} else {
			result = control[value]
		}
		return result
	}
