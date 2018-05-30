/*
 * @Description: axios相关配置
 */



var axios = require("axios");
var configHelper = require("../utils/configHelper");

axios.defaults.baseURL = configHelper.getApiConfig("baseUrl");
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
// 请求拦截
axios.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});
// 响应拦截
axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
});



module.exports = axios;