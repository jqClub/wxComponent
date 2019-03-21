var log = console.log.bind(console)
/* 版本兼容的方法 */
function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  var len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (var i = 0; i < len; i++) {
    var num1 = parseInt(v1[i])
    var num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }
  return 0
}
//判断最低的版本要求
var comparison = function(str) {
	var getSystemInfo = wx.getSystemInfoSync()
	var SDKVersion = getSystemInfo.SDKVersion
	var num = compareVersion(SDKVersion, str)
	//是否在指定的版本之上
	return (num != -1)
}

const obj_can = {
	comparison207: comparison('2.0.7'),
}


module.exports = obj_can