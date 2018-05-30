/*
 * @Description: exceptionless日志服务封装接口
 */

var exceptionless = require('exceptionless')
var exlogConfig = require("../config/config.index").log;
let exClient = new exceptionless.ExceptionlessClient({
    apiKey: exlogConfig.apiKey,
    serverUrl: exlogConfig.serverUrl,
    submissionBatchSize: 100
});
//加载配置文件
// log4js.configure(logConfig)

var logUtil = {}
logUtil.exClient=exClient;
// var errorLogger = log4js.getLogger('errorLogger')
// var resLogger = log4js.getLogger('resLogger')
// var logger = log4js.getLogger();

// //初始化日志文件
// logUtil.initLogFiles = function (ctx, error, resTime) {
//     var confirmPath = function (pathStr) {
//       if (!fs.existsSync(pathStr)) {
//         fs.mkdirSync(pathStr);
//         console.log('createPath: ' + pathStr);
//       }
//     }
//     var initLogPath = function () {
//     //创建log的根目录'logs'
//     if (logConfig.baseLogPath) {
//       confirmPath(logConfig.baseLogPath)
//       //根据不同的logType创建不同的文件目录
//         for (let i = 0, len = logConfig.appenders.length; i < len; i++) {
//           if (logConfig.appenders[i].path) {
//             confirmPath(logConfig.baseLogPath + logConfig.appenders[i].path)
//           }
//         }
//       }
//     }
//     initLogPath()
// }

//封装错误日志
logUtil.logError = function (ctx, error, resTime) {
    if (ctx && error) {
        exClient.createLog("xcxlog.logError",formatError(ctx, error, resTime),"Error").addTags('node应用中错误').submit()
    }
}
//手工日志
logUtil.logHand = function (mes) {
    if(Error.prototype.isPrototypeOf(mes)){
        let logText="";
        //错误名称
        logText += "err name: " + mes.name + ";"
        //错误信息
        logText += "err message: " + mes.message + ";"
        //错误详情
        logText += "err stack: " + mes.stack + ";"
        exClient.createLog("xcxlog.handlog",logText,"Debug").addTags('手工日志').submit()
    }else if(typeof mes ==="string"){
        exClient.createLog("xcxlog.handlog",mes,"Debug").addTags('手工日志').submit()
    }else {
        exClient.createLog("xcxlog.handlog","手工日志输入有问题，请传入Error对象或者字符串","Debug").addTags('手工日志').submit()
    }
}
//封装响应日志
logUtil.logResponse = function (ctx, resTime) {
    if (ctx && exlogConfig.responseEnable) {
        exClient.createLog("xcxlog.logResponse",formatRes(ctx, resTime),"Info").addTags('响应信息').submit()
    }
};

//格式化响应日志
var formatRes = function (ctx, resTime) {
    var logText = new String()


    //添加请求日志
    logText += formatReqLog(ctx.request, resTime)

    //响应状态码
    logText += "response status: " + ctx.status + ";"

    //响应内容
    logText += "response body: " + ";" + JSON.stringify(ctx.body) + ";"


    return logText

}

//格式化错误日志
var formatError = function (ctx, err, resTime) {
    var logText = new String()


    //添加请求日志
    logText += formatReqLog(ctx.request, resTime)

    //错误名称
    logText += "err name: " + err.name + ";"
    //错误信息
    logText += "err message: " + err.message + ";"
    //错误详情
    logText += "err stack: " + err.stack + ";"

    return logText
};

//格式化请求日志
var formatReqLog = function (req, resTime) {

    var logText = new String()

    var method = req.method
    //访问方法
    logText += "request method: " + method + "\r\n"

    //请求原始地址
    logText += "request originalUrl:  " + req.originalUrl + "\r\n"

    //客户端ip
    logText += "request client ip:  " + req.ip + "\r\n"

    //开始时间
    var startTime
    //请求参数
    if (method === 'GET') {
        logText += "request query:  " + JSON.stringify(req.query) + "\r\n"
        // startTime = req.query.requestStartTime;
    } else {
        logText += "request body: " + "\r\n" + JSON.stringify(req.body) + "\r\n"
        // startTime = req.body.requestStartTime;
    }
    //服务器响应时间
    logText += "response time: " + resTime + "\r\n"

    return logText
}

module.exports = logUtil