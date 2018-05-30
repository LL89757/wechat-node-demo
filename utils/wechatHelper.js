/*
 * @Description: 微信通用方法封装库
 */
const crypto = require("crypto");
const configHelper = require("../utils/configHelper");
const cache = require("../cache/cache");
const util = require("../utils/util");
const fs = require("fs");
const context = require("./context");
const weChatApi = require("wechat-node-sp");




const Wechat = {

    init: async function ({
        appId,
        appSecret,
        mch_id,
        payKey
    }) {

        this.wechatApi = weChatApi({
            appId,
            appSecret,
            mch_id,
            // pfx: fs.readFileSync("./apiclient_cert.p12"),//微信商户支付证书
            payKey
        })
    },
    //小程序登录接口
    login: async function (code) {
        try {
            var result = await this.wechatApi.login(code),
                data = null;
            if (result.status === 200 && !result.data.errcode) {
                data = {
                    openid: result.data.openid,
                    session_key: result.data.session_key,
                    unionid: result.data.unionid
                }
                return data;
            } else {
                console.log(result.data);
                return data;
            }
        } catch (e) {
            console.log("小程序登录异常", e);
            throw e;
            return null;
        }
    },
    //获取微信小程序用户信息
    getWeixinXcxUserInfo: async function (sessionKey, encryptedData, iv) {
        try {
            var data = await this.wechatApi.getWechatUserInfo(sessionKey, encryptedData, iv);
            return data;
        } catch (e) {
            throw e;
            return null;
        }
    },
    //获取token
    getAccessToken: async function (isRefresh) {
        var token = await cache.get("accessToken");
        if (isRefresh || !token) {
            token = this.updateAccessToken();
        }
        return token;

    },
    //更新token
    updateAccessToken: async function () {
        var result = await this.wechatApi.getAccessToken(),
            token = null,
            _this = this;
        if (result.data && !result.data.errcode) {
            token = result.data.access_token;
            cache.set("accessToken", result.data.access_token, 5400);
        } else {
            token = "";
        }
        return token;
    }
   





}



module.exports = Wechat;