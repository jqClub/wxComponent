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
//      if(utils.isObject(log1) == 'Object') {
        if(_typeof(log1) == 'object') {
            log(`${log0}:${JSON.stringify(log1)}`)
        } else {
            log(`${log0}:${log1}`)
        }
    } else {
        log(arguments[0])
    } 
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
}
