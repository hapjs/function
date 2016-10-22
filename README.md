# function

记录一些可以复用的函数或代码片段，支持在ES5+的环境中运行。

### 客户端os检测
```js
// 判断客户端操作系统是win还是mac还是linux
// 判断客户端是否移动设备
// 判断客户端是否微信

var os = (function(p, ua){
    var win = !!p.match(/^Win/),
        mac = !!p.match(/^Mac/),
        linux = p === 'X11' || !!p.match(/^Linux/),
        mobile = !(win || mac || linux),
        wechat = !!ua.match(/micromessenger/);
    
    return {
        win: win,
        mac: mac,
        linux: linux,
        mobile: mobile,
        wechat: wechat
    };
}(
    navigator.platform, 
    navigator.userAgent.toLowerCase()
));
```

### 扩展函数，支持深度拷贝
```js
/**
 * @param  {boolean} deep 是否深度拷贝，可选参数
 * @param   {object} dest 目标对象
 * @param   {object} src  源对象
 * @param   {object} srcN 源对象N
 * @return  {object} 返回修改后的目标对象
 */
function extend() {
    var args = arguments, deep = false, dest;
    if (typeof args[0] === 'boolean') {
        deep = Array.prototype.shift.call(args);
    };
    dest = Array.prototype.shift.call(args);
    Array.prototype.forEach.call(args, function (src) {
        Object.keys(src).forEach(function (key) {
            if (deep && typeof src[key] === 'object' && typeof dest[key] === 'object') {
                extend(true, dest[key], src[key]);
            } else if (typeof src[key] !== 'undefined') {
                dest[key] = src[key];
            };
        });
    });
    return dest;
};
```

### 遍历对象或数组
```js
function each(obj, fn){
    
    if(typeof fn !== 'function') return;
    
    if(isArray(obj)){
        Array.prototype.forEach.call(obj, fn);
    }else if(typeof obj === 'object'){
        Object.keys(obj).forEach(function(key){
            fn(obj[key], key);
        });
    };
}
```