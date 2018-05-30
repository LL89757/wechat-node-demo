/*
 * @Description: config文件 
 */

let config;
if (process.env.NODE_ENV == "prod") {
    config = require("./prod.sys.config");
} else if (process.env.NODE_ENV == "test") {
    config = require("./test.sys.config");
} else{
    config = require("./dev.sys.config");
}
module.exports=config