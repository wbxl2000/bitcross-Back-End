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
    code: { type: String},
    createdAt: { 
        type: Date, expires: 3600, default: Date.now
    }
})
// { createdAt: { type: Date, expires: 3600, default: Date.now }}

// db.emailCode.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 3600 } )

const emailCode = mongoose.model('email_code', emailCodeSchema)
// emailCode.createIndexes(emailCodeSchema.index({expires:1}, {expireAfterSeconds:300}), function(err, info){
//     if(err) console.error(err);
// });

module.exports = { emailCode }