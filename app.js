/*
 * @Description: 入口文件 
 */

const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
// const logger = require('koa-logger')


const api = require('./routes/api');
const response_formatter = require('./middlewares/response_formatter');
const rest = require('./middlewares/rest');
const router = require('koa-router')();
const session = require("koa-session2");
const Store = require("./cache/memcachedStore");
const currentContext = require("./utils/context");
const logUtil = require('./utils/log');
const wechat = require('./utils/wechatHelper');

// const currentContext=new context();
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
// app.use(logger())
// app.use(require('koa-static')(__dirname + '/public'))

// app.use(views(__dirname + '/views', {
//   extension: 'pug'
// }))


//添加格式化处理响应结果的中间件，在添加路由之前调用，仅对/api开头的url进行格式化处理
app.use(rest.restify('/Api'));
/*
  初始化日志系统所需要的文件夹
*/
// {
//   log.initLogFiles();
// }


// logger
app.use(async (ctx, next) => {
  //响应开始时间
  const start = new Date()
  //响应间隔时间
  var ms
  try {
    //开始进入到下一个中间件
    await next()
    ms = new Date() - start
    //记录响应日志
    logUtil.logResponse(ctx, ms)
  } catch (error) {
    ms = new Date() - start
    //记录异常日志
    logUtil.logError(ctx, error, ms)
    // logUtil.logHand(error);
    ctx.rest(500, "", "");
  }
})

app.use(async (ctx, next) => {

  await next()
  if (ctx.request.url == "/Api/Microshop/Login") {
    var sessionId = ctx.session.sessionId;
    ctx.body.data.xbxsessionid = ctx.session.sessionId;
    if (ctx.session.currentUser) {
      await currentContext.setCurrentUser(ctx, ctx.session.currentUser);
    } else {
      ctx.rest(1001, "", "");
    }

  }
});
app.use(session({
  store: new Store(),
  key: "xbx_session"
}));





//
app.use(async (ctx, next) => {
  ctx.session.user = {};
  await next();
})



// routes
router.use('/Api', api.routes(), api.allowedMethods());
app.use(router.routes(), router.allowedMethods());

try {
  currentContext.getSystemConfig().then(function (res) {
    wechat.init({
      appId: res.appId,
      appSecret: res.appSecret,
      mch_id: res.mch_id,
      payKey: res.payKey,
    })
  })
} catch (e) {
  console.log(e);
  throw e;
}

// error-handling
app.on('error', (err, ctx) => {
  console.error('server   error', err, ctx);

});

module.exports = app