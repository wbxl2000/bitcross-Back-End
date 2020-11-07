const mongoose = require('mongoose');
const bodyParser = require('body-parser')

mongoose.connect('mongodb://bitcrossAdmin:#1Xbit@localhost:27017/bitcross', {
    useCreateIndex: true,
    useUnifiedTopology: true, 
    useNewUrlParser: true
})

// 数据库相关命名使用下划线，其余均小驼峰
const userInfoSchema = new mongoose.Schema({
    uid: { type: String, unique: true}, 
    RegDate: { type: Date, default: Date.now}, 
    nickName: { type: String},
    realName: { type: String},
    realNamehide: {type: Number, default: 0},
    Point: {type: Number, default: 0},
    Level: {type: Number, default: 1},
    Signature: {type: String, default: "这个人很懒，还没有个性签名哦~"},
    userImg:{ type: String, default: ""}
    // latelogin: {type: String},
})

const userInfo = mongoose.model('user_info', userInfoSchema)

module.exports = { userInfo }