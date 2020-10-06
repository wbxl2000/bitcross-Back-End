const express = require('express')
const { userAuths } = require('./db/models.js')
const { emailCode } = require('./db/emailCode.js')
const { invitationCode } = require('./db/invitationCode.js')
const { counts } = require('./db/counts.js')

var router = express.Router()

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

router.post('/', jsonParser, async (req, res) => {
    // console.log(req.body)
    // 验证邮箱验证码
    // email is not exist
    const email = await emailCode.findOne({
        email: req.body.email
    })
    if (!email) {
        return res.status(422).send({
            msg: '未发送验证码'
        })
    }
    
    const isPasswordValid = (email.code == req.body.emailCode) 
    if (!isPasswordValid) {
        return res.status(422).send({
            msg: '验证码无效或错误'
        })
    }
    console.log('邮箱验证成功')

    const invitationVerification = await invitationCode.findOne({
        code: req.body.invitationCode
    })
    if (!invitationVerification) {
        return res.status(422).send({
            msg: '邀请码错误，没有注册权限'
        })
    }
    if (invitationVerification.count == invitationVerification.total) {
        return res.status(422).send({
            msg: '邀请码使用次数用完，已过期'
        })
    }

    const user = await userAuths.create({
        uid: req.body.studentId, 
        password: req.body.password
    })
    // console.log("user:" + user)
    // res.send(user)
    if(!user) {
        res.status(422).send({
            msg: "注册失败"
        })
    }

    invitationVerification.count += 1;

    // 这是我今年写过的最丑的代码，但是没办法
    let cnt = await counts.findOne({
        name: "user"
    })
    if (!cnt) {
        cnt = await counts.create({
            name: "user"
        })
        cnt = await counts.findOne({
            name: "user"
        })
    }
    if (!cnt) {
        res.status(200).send({
            msg: "一些意料之外的错误"
        })
        return;
    }
    let newCnt = cnt.count + 1;

    counts.updateOne({name: "user"}, {count: newCnt}, function(err, docs){
        if(err) console.log(err);
        console.log('人数修改成功：' + docs);
    })
    console.log('人:'+cnt.count);
    res.status(200).send({
        msg: "注册成功"
    })

})

module.exports = router