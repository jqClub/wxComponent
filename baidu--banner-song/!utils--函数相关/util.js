var log = console.log.bind(console)
//1.通用的js函数
//1.1判断类型的方法（返回的是小写的形式）
var class2type = {} ;
"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function(e,i){
    class2type[ "[object " + e + "]" ] = e.toLowerCase();
}) ;
//当然为了兼容IE低版本，forEach需要一个polyfill，不作细谈了。
function _typeof(obj){
    if ( obj == null ){
        return String( obj );
    }
    return typeof obj === "object" || typeof obj === "function" ?
        class2type[ class2type.toString.call(obj) ] || "object" :
        typeof obj;
}

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}
//返回一个对象的大小
function roughSizeOfObject( object ) {

    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while ( stack.length ) {
        var value = stack.pop();

        if ( typeof value === 'boolean' ) {
            bytes += 4;
        }
        else if ( typeof value === 'string' ) {
            bytes += value.length * 2;
        }
        else if ( typeof value === 'number' ) {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList.push( value );

            for( var i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes;
}

var returnToday = function() {
	//今天日期
	 var timestamp = Date.parse(new Date());
   var date = new Date(timestamp);
    //年
    var Y =date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var reslt = (Y + M + D)
    return Number(reslt)
}

//1.4合并2个数组的方法
var assignObject = function(obj1, obj2) {
        //es2015 Object.assign(): 注意目标对象自身也会改变。
        var obj
        if(Object.assign) {
            obj = Object.assign(obj1, obj2)
        } else {
            for(key in obj2) {
                obj1[key] = obj2[key]
            }
            obj = obj1
        }
        return obj
    }


//打印函数
var logNew = function() {
    //一般log会给2个参数，如果是一个，就直接打印出来
    if(arguments.length == 2) {
        var log0 = arguments[0]
        var log1 = arguments[1]  //第2个参数是对象，就先转换一下
        if(_typeof(log1) == 'object') {
            log(`${log0}:${JSON.stringify(log1)}`)
        } else {
            log(`${log0}:${log1}`)
        }
    } else {
        log(arguments[0])
    }
}


var log = function() {
    var result = ''
//     console.log(arguments)
    var args = Array.prototype.slice.call(arguments);
    args.forEach(function(value){
        // console.log(value)
        if(typeof value == 'object') {
            value = JSON.stringify(value)
        }
        result += value + ' '
    });
    console.log(result)
    return result
}

//测试函数
var addLen = function(arr) {
	arr = arr || []
	var len = 10
	for (var i = 0; i < len ; i++) {
		var a = arr[0]
		arr.push(a)
	} 
	return arr
}

//1.7根据bool值，返回对应的json序列化
var jsonAbout = function(key, bool) {
	var result = JSON.stringify(key)
	if(bool) {
		result = JSON.parse(key)
	}
	return result
}


//1.9拼接对象参数的方法
var joinObj = (obj) => {
  	var arr = []
	for(var key in obj) {
		if(obj[key]) {
			var value = obj[key]
			var b = `${key}=${value}`
			arr.push(b)
		}
	}
	var result = arr.join('&')
	return result
}

//频率控制
function throttle(fn, gapTime) {
    if (gapTime == null || gapTime == undefined) {
        gapTime = 1500
    }

    let _lastTime = null
    return function () {
        let _nowTime = + new Date()
        if (_nowTime - _lastTime > gapTime || !_lastTime) {
            fn()
            _lastTime = _nowTime
        }
    }
}

var isEquals = function(a1, a2) {
	var result = JSON.stringify(a1) == JSON.stringify(a2)
	return result
}

//11.22新增，解码和编码
function encodeUnicode(str) {
  var res = [];
  for (var i = 0; i < str.length; i++) {
      res[i] = ( "00" + str.charCodeAt(i).toString(16) ).slice(-4);
  }
  return "\\u" + res.join("\\u");
}

function decodeUnicode(str) {
   str = str.replace(/\\/g, "%");
   return unescape(str);
}


//生成从minNum到maxNum的随机数
function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
}


//utils生成从minNum到maxNum的随机数（取的是整数，所以需要取小数点的时候，乘以10。再在结果除以10）
function randomNumDecimal(minNum, maxNum, decimalPlaces){
	//decimalPlaces是返回小数点后几位数
	if(decimalPlaces) {
		minNum = minNum * 10 * decimalPlaces
		maxNum = maxNum * 10 * decimalPlaces
	}
	let result = parseInt(Math.random()*(maxNum-minNum+1)+minNum,10)
	//如果是小数点，需要相除
	if(decimalPlaces) {
		result = result / (10 * decimalPlaces).toFixed(decimalPlaces)
	}
    return result
}

 //数组随机取值
var GetArrTarge= function(arr) {
	var index = Math.floor((Math.random() * arr.length));
	return arr[index]
}

//2.从前面的一篇随机数组中随机取几个元素
function getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}


    //根据概率返回相应的值
var returnAccording = function(probability) {
		var that = this
	//	probability是出现的概率值
		var type = 0
		//1.先传递一个概率值
		var red_probability = probability * 100
	
		//2.如果是在概率中，就显示相应的弹窗
		//取一个随机值，看是在哪个区间内
		var suiji = randomNumDecimal(0, 100)
		log('-随机值-', suiji, '-原来的值-', red_probability)
		//如果大于，则出现第二种形式
		if(suiji <= red_probability) {
			type = 1
		}
		return type
	}


module.exports = {
  formatTime: formatTime,
  isEmptyObject:isEmptyObject,
  roughSizeOfObject: roughSizeOfObject,
  returnToday: returnToday,
  //1.4合并2个数组的方法
  assignObject:assignObject,
  logNew,
  _typeof,
  log,
  
  addLen,
  
  jsonAbout,
  joinObj,
  //频率控制
  throttle,
  
  //判断是否相等
  isEquals,
  //11.22新增，解码和编码
  encodeUnicode,
  decodeUnicode,
  randomNum,
  
  randomNumDecimal,
  GetArrTarge,
  getRandomArrayElements,
  returnAccording,
}
