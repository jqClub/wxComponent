var dtime = '_deadtime';
function put(k, v, t) {
  swan.setStorageSync(k, v)
  var seconds = parseInt(t);
  if (seconds > 0) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000 + seconds;
    swan.setStorageSync(k + dtime, timestamp + "")
  } else {
    swan.removeStorageSync(k + dtime)
  }
}

function get(k, def) {
  var deadtime = parseInt(swan.getStorageSync(k + dtime))
  if (deadtime) {
    if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
      if (def) { return def; } else { return; }
    }
  }
  var res = swan.getStorageSync(k);
  if (res) {
    return res;
  } else {
    return def;
  }
}

function remove(k) {
  swan.removeStorageSync(k);
  swan.removeStorageSync(k + dtime);
}

function clear() {
  swan.clearStorageSync();
}

//距离下一天0点的秒数
function nextDayTime(){
    var date = new Date();
    // 获取当前时间距离----毫秒数
    var m1 = date.getTime();
    // 设置为当前天凌晨0:0:0
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    // 获取当前天凌晨距离----毫秒数
    var m0 = date.getTime();
    // 获取距离明天的秒数
    var m = 60*60*24 - (m1-m0)/1000;
    return m
}

module.exports = {
  put: put,
  get: get,
  remove: remove,
  clear: clear,
  nextDayTime: nextDayTime, 
}