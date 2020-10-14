const mongoose = require('mongoose');
const bodyParser = require('body-parser')

mongoose.connect('mongodb://bitcrossAdmin:#1Xbit@localhost:27017/bitcross', {
    useCreateIndex: true,
    useUnifiedTopology: true, 
    useNewUrlParser: true
})

// 数据库相关命名使用下划线，其余均小驼峰
const postPublishSchema = new mongoose.Schema({
    post_id: {type: Number},
    post_type: { type: String}, 
    creator_id: {type: String},
    start_time: { type: Date, default: Date.now},
    title: { type: String},
    content: { type: String},
    pageView: {type: Number, default: 0},
    floor_counts: {type: Number, default: 1},
    introduce: {type: String},
    favors: {type: Number, default: 0}
})

const postPublish = mongoose.model('post_publish', postPublishSchema)

module.exports = { postPublish }