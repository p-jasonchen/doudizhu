/**
 * 日志方法
 * User: simon
 * Date: 12-12-10
 * 为手机端调试用，详见adb catlog,可加关键词过滤如:log;error;debug
 * 依赖:__debug__,DEBUG_SERVER_URL两个变量
 * 在执行本代码段前需要在传入的root变量中设定__debug__及DEBUG_SERVER_URL的值
 */
(function (root) {
    //日志状态
    var __debug__ = root[__debug__]||false;
    var DEBUG_INFO_LIST = [];
    var DEBUG_SERVER_URL=root[DEBUG_SERVER_URL]||'http://sp.microrapid.com/debug.php';
    var _logTimer=null;

    /**
     * 打印
     * @private
     * arguments可传类型
     * 1._log('log'|'debug'|'error',msg)
     * 2._log(msg)
     */
    function _log() {
        //如果没有传参，返回
        if(arguments.length===0)return;
        var args = Array.prototype.slice.call(arguments, 0);
        var type=args[0];
        if(type==='log' ||type==='debug'||type==='error'){
            args.shift();
        }else{
            type='log';
        }

        args[0]="【" +type+' '+ (new Date()).toTimeString().substr(0, 8) + "】" +args[0];
        console[type]&&console[type].apply(console,args);
        if (__debug__=="2") {
            DEBUG_INFO_LIST.push(args.join(''));
            if (!_logTimer)
                _logTimer = setTimeout(function () {
                    console.log("向服务器发送日志");
                    _logTimer = null;
                    var ajax = new XMLHttpRequest();
                    ajax.open("post", DEBUG_SERVER_URL, true);
                    ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    var data = "type=f_report&msg=" + encodeURIComponent("---------------------------------------------------------------\r\n" + DEBUG_INFO_LIST.join("\r\n"));
                    ajax.send(data);
                    DEBUG_INFO_LIST.splice(0);
                }, 3000);
        }else if(__debug__=="1"){
            alert(args[0]);
        }
    }
    if(root.log){
        root._log=window.log;
    }
    root.log=_log;
})(window);
