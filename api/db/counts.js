const mongoose = require('mongoose');
const bodyParser = require('body-parser')

mongoose.set('useCreateIndex', true) //解决问题代码

mongoose.connect('mongodb://bitcrossAdmin:#1Xbit@localhost:27017/bitcross', {
    useCreateIndex: true,
    useUnifiedTopology: true, 
    useNewUrlParser: true
})

// 数据库相关命名使用下划线，其余均小驼峰
const countsSchema = new mongoose.Schema({
    name: {type: String},
    count: {type: Number, default:0}

})

const counts = mongoose.model('counts', countsSchema)

module.exports = { counts }