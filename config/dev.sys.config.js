/*
 * @Description: 开发环境系统配置文件
 */


//   为了安全考虑，其余敏感数据配置放到数据库，由接口请求读取
module.exports = {
    //环境配置
    envConfig: {
        systemMode: 2,
        host: "",
        cacheArea: "Dev"
    },
    //OCS配置
    ocsConfig: {
        host: "",
        port: "",
        userName: "",
        password: ""
    },
    //api服务器地址
    apiConfig: {
        baseUrl: "http://192.168.10.47:8084"
    },
    //exceptionless日志服务配置
    log: {
        apiKey: "E8G4tIkbYndrN00ov1KzSNOZyNWvyrVjcdHNsHkW",
        serverUrl: "http://192.168.4.184:50000",
        enable: false
    }

}