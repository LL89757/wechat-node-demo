/*
 * @Author: li.lv 
 * @Date: 2018-06-20 16:21:33 
 * @Last Modified by: li.lv
 * @Last Modified time: 2018-07-02 16:54:24
 * @Description: 静态服务中间件 
 */
const fs = require('fs')
const path = require('path')

const staticPath = "./public";

/**
 * 
 * @param {string} fullStaticPath 静态资源服务器地址
 */
const static = (fullStaticPath) => {
    console.log(fullStaticPath)
    return async (ctx, next) => {
        if (!ctx.request.path.startsWith("/Api")) {
            // 获取静态资源内容，有可能是文件内容，目录，或404
            let _content = await content(ctx, fullStaticPath);
            // 解析请求内容的类型
            let _mime = parseMime(ctx.url);
            // 如果有对应的文件类型，就配置上下文的类型
            if (_mime) {
                ctx.type = _mime;
            }

            // 输出静态资源内容
            if (_mime && _mime.indexOf('image/') >= 0) {
                // 如果是图片，则用node原生res，输出二进制数据
                ctx.res.writeHead(200);
                ctx.res.write(_content, 'binary');
                ctx.res.end();
            } else {
                // 其他则输出文本
                ctx.body = _content;
            }

        } else {
            await next()
        }
    }
}


/**
 * 获取文件扩展类型
 * 
 * @param {string} url 
 * @returns 
 */
function parseMime(url) {
    let extName = path.extname(url);
    extName = extName ? extName.slice(1) : 'unknown';
    return mimes[extName];
}

/**
 * 返回文件
 * 
 * @param {any} ctx     koa上下文
 * @param {string} fullStaticPath   静态资源服务器地址
 * @returns 
 */
async function content(ctx, fullStaticPath) {
    // 封装请求资源的完绝对径
    let reqPath = path.join(fullStaticPath, ctx.url);
    // 判断请求路径是否为存在目录或者文件
    let exist = fs.existsSync(reqPath);
    // 返回请求内容， 默认为空
    let content = '';
    if (!exist) {
        //如果请求路径不存在，返回404
        content = '404 Not Found!';
    } else {
        //判断访问地址是文件夹还是文件
        let stat = fs.statSync(reqPath);
        if (stat.isDirectory()) {
            //如果为目录，则渲读取目录内容
            content = dir(ctx.url, reqPath);
        } else {
            // 如果请求为文件，则读取文件内容
            content = file(reqPath);
        }
    }
    return content;
}


/**
 * 返回文件目录html结构
 * 
 * @param {string} url   
 * @param {string} reqPath  
 * @returns 
 */
function dir(url, reqPath) {

    // 遍历读取当前目录下的文件、子目录
    let contentList = walk(reqPath);

    let html = `<ul>`;
    for (let [index, item] of contentList.entries()) {
        html = `${html}<li><a href="${url === '/' ? '' : url}/${item}">${item}</a></li>`;
    }
    html = `${html}</ul>`;

    return html;
}
/**
 * 获取文件
 * 
 * @param {string} filePath 文件路径
 * @returns 
 */
function file(filePath) {

    let content = fs.readFileSync(filePath, 'binary');
    return content;
}

/**
 *  返回目录下文件列表
 * 
 * @param {string} reqPath  请求路径
 * @returns 
 */
function walk(reqPath) {

    let files = fs.readdirSync(reqPath);

    let dirList = [],
        fileList = [];
    for (let i = 0, len = files.length; i < len; i++) {
        let item = files[i];
        let itemArr = item.split("\.");
        let itemMime = (itemArr.length > 1) ? itemArr[itemArr.length - 1] : "undefined";

        if (typeof mimes[itemMime] === "undefined") {
            dirList.push(files[i]);
        } else {
            fileList.push(files[i]);
        }
    }


    let result = dirList.concat(fileList);

    return result;
};

let mimes = {
    'css': 'text/css',
    'less': 'text/css',
    'gif': 'image/gif',
    'html': 'text/html',
    'ico': 'image/x-icon',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'js': 'text/javascript',
    'json': 'application/json',
    'pdf': 'application/pdf',
    'png': 'image/png',
    'svg': 'image/svg+xml',
    'swf': 'application/x-shockwave-flash',
    'tiff': 'image/tiff',
    'txt': 'text/plain',
    'wav': 'audio/x-wav',
    'wma': 'audio/x-ms-wma',
    'wmv': 'video/x-ms-wmv',
    'xml': 'text/xml'
}

module.exports = static;