const mongoose = require('mongoose');
const bodyParser = require('body-parser')

mongoose.connect('mongodb://bitcrossAdmin:#1Xbit@localhost:27017/bitcross', {
    useCreateIndex: true,
    useUnifiedTopology: true, 
    useNewUrlParser: true
})

// 数据库相关命名使用下划线，其余均小驼峰
const favorPostListSchema = new mongoose.Schema({
    uid: { type: String}, 
    post_id: { type: String}
})

const favorPostList = mongoose.model('favor_post_list', favorPostListSchema)

module.exports = { favorPostList }