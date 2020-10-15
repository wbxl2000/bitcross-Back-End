const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const { postPublish } = require('./postPublish.js')

mongoose.connect('mongodb://bitcrossAdmin:#1Xbit@localhost:27017/bitcross', {
    useCreateIndex: true,
    useUnifiedTopology: true, 
    useNewUrlParser: true
})

// 数据库相关命名使用下划线，其余均小驼峰

// const email = await postPublish.findOne({
//     email: req.body.email
// })

const postReplyRESchema = new mongoose.Schema({
    post_id: { type: String}, 
    uid: { type: String},
    rereply_content: {type: String},
    rereply_time: { type: Date, default: Date.now},
    rereply_floor: { type: Number}
})

const postReplyRE = mongoose.model('post_rereply', postReplyRESchema)

module.exports = { postReplyRE }