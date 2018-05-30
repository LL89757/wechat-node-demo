const router = require("koa-router")();
const testRouter = require("./testRouter");
const context = require("../../utils/context");
const _ = require("underscore");

const validate = async (ctx, next) => {
    var sessionId = ctx.headers.xbxsessionid;
    let urls = ["/Api/Test/Login", "/Api/Test/ClearXbxCache", "/Api/Test/GetUser", "/Api/Test/SiteCheck", "/Api/Test/SiteCheckTest"];
    var requestUrl = ctx.request.url;
    if (!(_.contains(urls, ctx.request.url)) && requestUrl.indexOf("/Api/Schedule") == -1) {
        if (!sessionId) {
            ctx.body = {
                error: "unlogin"
            }
            ctx.rest(2001, "", null);
            return;
        } else {
            var currentUser = await context.getCurrentUser(ctx);
            if (!currentUser) {
                ctx.rest(2001, "", null);
                return;
            }
        }
    }
    await next();
}

router.use("/Test", validate, testRouter.routes(), testRouter.allowedMethods());

module.exports = router;