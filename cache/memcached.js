/*
 * @Description: aliocs缓存服务初始化 
 */


const ALY = require("aliyun-sdk");
const configHelper = require("../utils/configHelper");

const port = configHelper.getOcsConfig("port"),
  host = configHelper.getOcsConfig("host"),
  userName = configHelper.getOcsConfig("userName"),
  password = configHelper.getOcsConfig("password");

// 创建 OCS 的 memcached 实例

var memcached = ALY.MEMCACHED.createClient(port, host, {
  username: userName,
  password: password
});

memcached.on('error', function (err) {
  console.log('memached error', err);
});



module.exports = memcached;