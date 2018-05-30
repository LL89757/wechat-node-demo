/*
 * @Description: 获取系统配置通用封装
 */
var config = require("../config/config.index");



var configHelper = {
    getEnvConfig: function (key) {
        return config.envConfig[key];
    },
    getOcsConfig: function (key) {
        return config.ocsConfig[key];
    },
    getWechatXcxConfig: function (key) {
        return config.wechatXcxConfig[key];
    },
    getApiConfig: function (key) {
        return config.apiConfig[key];
    },
    getScheduleJobConfig: function (key) {
        return config.scheduleJobConfig[key];
    }
}


module.exports = configHelper;