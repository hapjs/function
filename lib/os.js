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

module.exports = os;