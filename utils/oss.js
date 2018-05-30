
const context = require("../utils/context");
const ALY = require("aliyun-sdk");

var upload = {
    init: async function (systemConfig) {
        this.OSS = new ALY.OSS({
            "accessKeyId": systemConfig.ossAccessKeyId,
            "secretAccessKey": systemConfig.ossSecretAccessKey,
            endpoint: systemConfig.ossEndpoint,
            apiVersion: '2013-10-15'
        });
    },
    uploadImage: async function (filename, data,
        header = {
            AccessControlAllowOrigin: "",
            ContentType: "text/plain",
            CacheControl: "no-cache",
            ContentDisposition: "",
            ContentEncoding: "utf-8",
            Expires: null
        }) {
        let _this = this;
        let systemConfig = await context.getSystemConfig();
        let { AccessControlAllowOrigin, ContentType, CacheControl, ContentDisposition, ContentEncoding, Expires } = header;
        if (!_this.OSS) {
            _this.init(systemConfig);
        }
        return new Promise(function (resolve, reject) {
            _this.OSS.putObject({
                Bucket: systemConfig.ossBucket,
                Key: 'test/' + filename, // 注意, Key 的值不能以 / 开头, 否则会返回错误.
                Body: data,
                AccessControlAllowOrigin,
                ContentType,
                CacheControl, // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
                ContentDisposition, // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.5.1
                ContentEncoding, // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.11
                ServerSideEncryption: 'AES256',
                Expires // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21
            },
                function (err, data) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve('/test' + filename);
                });
        });
    }
}


module.exports = upload;
