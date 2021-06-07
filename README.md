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
/**
 * @param {object|array} obj 遍历的对象
 * @param {function}     fn  处理函数，将会接收到2个参数：value, key
 */
function each(obj, fn){
    
    if(typeof fn !== 'function') return;
    
    if(Array.isArray(obj)){
        Array.prototype.forEach.call(obj, fn);
    }else if(typeof obj === 'object'){
        Object.keys(obj).forEach(function(key){
            fn(obj[key], key);
        });
    };
}
```

### 微型模板函数

使用：`sub('hello {name}!', { name: 'world' });` ==> `hello world!`

```js
var sub = function(s, o) {
    var SUBREGEX = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g; 
    return s.replace ? s.replace(SUBREGEX, function (match, key) {
        return undef(o[key]) ? match : o[key];
    }) : s;
};
```

### 判断是否数字
```
function isNumber(s){
    return typeof s === 'number' || !!(s && !isNaN(s));
};
```

### 判断是否具有指定class
```js
function hasClass(node, cls, context){

    // 同时支持Node和选择器
    if(typeof node === 'string'){
        node = (context || document).querySelector(node); 
    };
    
    if(!node || typeof cls !== 'string') return false;
    
    return !!node.className.match(new RegExp('\\b' + cls + '\\b'));
}
```

### 命名空间函数，对象的深层属性读写

用法1：
> namespace(window, 'location.href') 等价于  window.location.href

用法2：
> namespace(window, 'location.href', 'https://a.com') 等价于  window.location.href = 'https://a.com'

```js
function namespace(obj, ns, value) {
  // 是否写入模式
  var writeMode = arguments.length >= 3;

  ns = ns.split(".");

  if (writeMode) {
    // 写入
    let result = obj;
    for (var i = 0; i < ns.length; i++) {
      let name = ns[i];
      if (i === ns.length - 1) {
        // 叶子节点，赋值value
        obj[name] = value;
      } else {
        // 空节点设置为{}
        if (obj[name] + "" !== "[object Object]") {
          obj[name] = {};
        }
        // 更新游标
        obj = obj[name];
      }
    }
    return result;
  } else {
    // 读取
    for (var i = 0; i < ns.length; i++) {
      let node = obj[ns[i]];
      // 叶子属性
      if (i === ns.length - 1) {
        // 返回结果
        return node;
      } else if (node + "" === "[object Object]") {
        // 更新游标
        obj = node;
      } else {
        // 提前返回
        return undefined;
      }
    }
  }
}
```

### 复制到剪贴板
```js
function copy(text, success) {
  // 创建一个临时input元素
  var el = document.createElement('input');
  document.body.appendChild(el);
  el.value = text + '';
  el.focus();
  el.select();

  // 兼容iOS
  // https://stackoverflow.com/questions/34045777/copy-to-clipboard-using-javascript-in-ios
  var range = document.createRange();
  var selection = window.getSelection();
  el.contentEditable = true;
  el.readOnly = false;
  range.selectNodeContents(el);
  selection.removeAllRanges();
  selection.addRange(range);
  el.setSelectionRange(0, 999999);
  
  // 拷贝并执行回调函数
  if (document.execCommand('copy')) {
    if (typeof success === 'function') {
      success();
    }
  }

  // 清理
  document.body.removeChild(el);
}
```

### 版本号判断

判断两个格式为 "10.5.3" 的版本号的大小

如果ver大于targetVer，则返回true，否则返回false

```js
function compageVersion(ver, targetVer) {
  targetVer = targetVer.split('.');
  // 切割、遍历目标版本串
  return ver.split('.').every(function (v, i) {
    var tv = targetVer[i];
    // 每一段相应的当前版本都存在、并且大于目标版本
    return !!tv && (parseInt(v) >= parseInt(tv));
  });
}
```

### 取URL参数

取URL中的服务端参数，如果未取到则返回null
```
function getQueryString(name) {
    return (location.search.match(new RegExp('[?&]' + name + '=([^&]*)')) || [])[1];
}
```
