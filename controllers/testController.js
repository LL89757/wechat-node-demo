/*
 * @Description: 测试接口
 */

const Wechat = require("../utils/wechatHelper");
const context = require("../utils/context");
const configHelper = require("../utils/configHelper");
const util = require("../utils/util");
const cache = require("../cache/cache");
const {
    User
} = require("../models/user");
const {
    testService
} = require("../services/baseService");
const commonHelper = require('../utils/commonHelper');
const logUtil = require("../utils/log");

let controller = {
    getUser: async function (ctx, next) {
        let user = await testService.getUser();
        ctx.rest(200, "", new User(user));
        await next();
    },
    login: async function (ctx, next) {
        try {
            let body = ctx.request.body,
                wechatSession = {},
                currentUser = null;
            let result = await Wechat.login(body.code);
            if (result) {
                wechatSession = result;
                let userInfo = await Wechat.getWeixinXcxUserInfo(wechatSession.session_key, body.encryptedData, body.iv);
                currentUser = {
                    "headImageUrl": userInfo.avatarUrl,
                    "nickName": userInfo.nickName,
                    "openId": userInfo.openId,
                    "session_key": wechatSession.session_key
                }
                ctx.session.currentUser = currentUser;
                ctx.rest(200, "success", new User(currentUser));
                await next();
            } else {
                ctx.rest(1001, "登录失败", "");
                await next();
            }
        } catch (e) {
            ctx.rest(500, "", "");
            throw e;
            await next();
        }

    },
    //获取当前用户
    getCurrentUser: async function (ctx, next) {
        let currentUser = await context.getCurrentUser(ctx);
        if (!currentUser) {
            ctx.rest(2001, "", null);
        } else {
            let user = new MicroshopUser(currentUser.headImageUrl, currentUser.nickName, currentUser.phone);
            ctx.rest(200, "", user);
        }
    },
    //获取小程序支付参数
    getPayParameters: async function (ctx, next) {
        try {
            let currentUser = await context.getCurrentUser(ctx);
            if (!currentUser) {
                ctx.rest(2001, "", "");
                await next();
                return;
            }
            let data = {
                productName: "test",
                openId: currentUser.openId,
                price: 0.01
            }
            let result = await Wechat.unifiedorder(data);
            ctx.rest(200, "success", result);
            await next();
        } catch (e) {
            ctx.rest(500, "", "");
            throw e;
            await next();
        }
    },
    clearXbxCache: async function (ctx, next) {
        let body = ctx.request.body;
        let key = await configHelper.getKey("clearCacheKey");
        if (body.key != key) {
            ctx.rest(1000, "", "");
        } else {
            let res = await cache.delete("xbxSystemConfig");
            ctx.rest(200, "success", res);
        }

        await next();
    },
    getAccessToken: async function (ctx, next) {
        let token = await Wechat.getAccessToken();
        ctx.rest(200, "success", token);

    },
    siteCheck: async function (ctx, next) {
        try {
            ctx.rest(200, "success", "success ok");
        } catch (e) {
            ctx.rest(1000, "error", e);
            throw e;
        }

    }

}


module.exports = controller;