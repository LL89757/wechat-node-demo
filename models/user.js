/*
 * @Description: 测试model文件定义 
 */




class User {
    constructor(user) {
        this.headImageUrl = user.headImageUrl;
        this.nickName = user.nickName;
        this.openId = user.openId;
    }
}




module.exports = {
    User
}