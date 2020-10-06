const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const { postPublish } = require('./postPublish.js')

mongoose.connect('mongodb://bitcorssAdmin:#1Xbit@localhost:27017/bitcross', {
    useCreateIndex: true,
    useUnifiedTopology: true, 
    useNewUrlParser: true
})

// 数据库相关命名使用下划线，其余均小驼峰

// const email = await postPublish.findOne({
//     email: req.body.email
// })

const postContentSchema = new mongoose.Schema({
    post_id: { type: String}, 
    reply_id: {type: String},
    reply_content: {type: String},
    reply_time: { type: Date, default: Date.now()},
    floor: { type: Number},
    be_likes: {type: Number, default: 0}

})

const postContent = mongoose.model('post_content', postContentSchema)

module.exports = { postContent }