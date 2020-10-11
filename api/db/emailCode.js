const mongoose = require('mongoose');
const bodyParser = require('body-parser')

mongoose.connect('mongodb://bitcrossAdmin:#1Xbit@localhost:27017/bitcross', {
    useCreateIndex: true,
    useUnifiedTopology: true, 
    useNewUrlParser: true
})

// 数据库相关命名使用下划线，其余均小驼峰
const emailCodeSchema = new mongoose.Schema({
    email: { type: String}, 
    code: { type: String }
})

const emailCode = mongoose.model('email_code', emailCodeSchema)

module.exports = { emailCode }