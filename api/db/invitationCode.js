const mongoose = require('mongoose');
const bodyParser = require('body-parser')

mongoose.connect('mongodb://bitcrossAdmin:#1Xbit@localhost:27017/bitcross', {
    useCreateIndex: true,
    useUnifiedTopology: true, 
    useNewUrlParser: true
})

// 数据库相关命名使用下划线，其余均小驼峰
const invitationCodeSchema = new mongoose.Schema({
    code: { type: String, unique: true }, 
    date: { type: Date, default: Date.now()},
    total: { type: Number},
    count: { type: Number, default: 0}

})

const invitationCode = mongoose.model('invitation_code', invitationCodeSchema)

module.exports = { invitationCode }