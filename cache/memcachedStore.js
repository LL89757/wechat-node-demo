//koa-session2库使用membercached存储

// const Memcached = require("./memcached");
const memcached = require('./memcached');
const cache = require("./cache");
// const currentContext=new context();



//  var memcached = new Memcached(Server locations, options);
const {
    Store
} = require("koa-session2");

class MemcachedStore extends Store {
    constructor() {
        super();
        this.memcached = memcached;
    }

    async get(sid, ctx) {
        var data = await cache.get(`SESSION:${sid}`);

        if (!data) {
            data = '{}';
        }
        return JSON.parse(data);
    }

    async set(session, {
        sid = this.getID(24),
        maxAge = 7200000
    } = {}, ctx) {
        try {
            sid = ctx.headers.xbxsessionid ? ctx.headers.xbxsessionid : sid;
        } catch (e) {}
        ctx.session.sessionId = sid;
        return sid;
    }

    async destroy(sid, ctx) {
        return await this.memcached.delete(`SESSION:${sid}`, function (err, data) {
            if (err) {
                console.log('delete error:', err);
                memcached.end();
                return;
            }
            memcached.end();
        });
    }
}

module.exports = MemcachedStore;