const mongoose = require('mongoose');
const bodyParser = require('body-parser')

mongoose.connect('mongodb://bitcorssAdmin:#1Xbit@localhost:27017/bitcross', {
    useCreateIndex: true,
    useUnifiedTopology: true, 
    useNewUrlParser: true
})

// 数据库相关命名使用下划线，其余均小驼峰
const userAuthsSchema = new mongoose.Schema({
    uid: { type: String, unique: true}, 
    password: { type: String, set(val) {
        return require('bcrypt').hashSync(val, 10)
    }
},
})

const userAuths = mongoose.model('user_auths', userAuthsSchema)

module.exports = { userAuths }