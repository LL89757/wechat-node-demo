/*
 * @Description: 当前上下文通用方法封装 
 */
const cache = require("../cache/cache");
const configHelper = require("../utils/configHelper");
const axios = require("../utils/axios");
class context {
    constructor() {
        this.aliMemcached = cache;
    }




    async getCurrentUser(ctx) {
        var sessionId = ctx.headers.xbxsessionid,
            currentUser = null,
            _this = this;
        if (!sessionId) {
            return null;
        }
        currentUser = await cache.get(`currentUser_${sessionId}`);
        if (currentUser) {
            cache.set(`currentUser_${sessionId}`, currentUser, 60 * 60 * 24);
            return currentUser;
        } else {
            return null;
        }
    }


    async setCurrentUser(ctx, value, expires) {
        var sessionId = ctx.headers.xbxsessionid ? ctx.headers.xbxsessionid : ctx.session.sessionId,
            currentUser = null;
        if (!sessionId) {
            return;
        }
        return await cache.set(`currentUser_${sessionId}`, value, 60 * 60 * 24);

    }
    async getSystemConfig() {
        var systemMode = configHelper.getEnvConfig("systemMode"),
            config = await cache.get("xbxSystemConfig");
        if (!config) {
            return {
                appId: "",
                appSecret: "appSecret",
                mch_id: "mch_id",
                payKey: "payKey",
            };

            // var data = {
            //     "Filter": systemMode
            // }
            // var res = await axios.post("/SystemConfigService/GetSystemConfigListBySystemMode", data);
            // if (res.data.Success && res.data.Data) {
            //     config = this.parseSystemConfig(res.data.Data);
            //     await cache.set("xbxSystemConfig", config);
            //     return config;
            // } else {
            //     throw ("获取配置信息失败");
            // }
        } else {
            return config;
        }
    }

    parseSystemConfig(res) {
        var config = {
            xcxAppId: "",
            xcxAppSecret: "",
            xcxMchId: "",
            xcxPayKey: "",
            smsApiUrl: "", //短信服务api地址
            ossBucket: "",
            ossEndpoint: "",
            ossSecretAccessKey: "",
            ossAccessKeyId: "",
        }
        for (var i = 0, l = res.length; i < l; i++) {
            config[res[i].ConfigKey] = res[i].ConfigValue;
        }
        return config;
    }


}

module.exports = new context();