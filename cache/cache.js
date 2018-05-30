/*
 * @Description: cache服务 
 */

const memcached = require("./memcached");
const configHelper = require("../utils/configHelper");

const cache = {
    aliMemcached: memcached,
    getPrefix: function (key) {
        var cacheArea = configHelper.getEnvConfig("cacheArea");
        return cacheArea + "-" + key;
    },
    add: async function (key, value, expires) {
        var value = JSON.stringify(value),
            _this = this;
        return new Promise((resolve, reject) => {
            this.aliMemcached.add(_this.getPrefix(key), value, expires, function (err, data) {
                if (err) {
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        })
    },
    get: async function (key) {
        var value = "",
            _this = this;
        return new Promise(function (resolve, reject) {
            _this.aliMemcached.get(_this.getPrefix(key), function (err, data) {
                // 如果查询错误或者失败
                if (err) {
                    console.log("get error:", err);
                    // _this.aliMemcached.end();
                    resolve();
                } else {
                    value = data ? JSON.parse(data) : "";
                    resolve(value);
                }
            });
        });
    },
    set: async function (key, value, expires) {
        var value = JSON.stringify(value),
            _this = this;
        return new Promise(function (resolve, reject) {
            if (!expires) {
                _this.aliMemcached.set(_this.getPrefix(key), value, function (err, data) {
                    if (err) {
                        console.log("set error:", err);
                        // _this.aliMemcached.end();
                    }
                    resolve();
                });
            } else {
                _this.aliMemcached.set(_this.getPrefix(key), value, expires, function (err, data) {
                    if (err) {
                        console.log("set error:", err);
                        // _this.aliMemcached.end();
                    }
                    resolve();
                });
            }
        })
    },
    delete: async function (key) {
        var value = JSON.stringify(value),
            _this = this;
        return new Promise(function (resolve, reject) {
            _this.aliMemcached.delete(_this.getPrefix(key), function (err, data) {
                if (err) {
                    console.log('delete error:', err);
                    // _this.aliMemcached.end();
                }
                resolve();
            });
        })

    }
}

module.exports = cache;