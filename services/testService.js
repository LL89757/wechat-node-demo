const axios = require("../utils/axios");
const context = require("../utils/context");
const configHelper = require("../utils/configHelper");

const microshopService = {
    getUser: function () {
        return new Promise(function (resolve, reject) {
            let user = {
                headImageUrl: "test-headImageUrl",
                nickName: 'test-nickName',
                openId: "test-openId"
            }
            resolve(user);
        });
        // return axios.post("/MicroShopOrderService/AddMicroProgramPushInfo");
    }


}


module.exports = microshopService;