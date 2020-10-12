// TODO 用文件替换掉 而且 全局唯一
const SECRET = 'qwrqerewrwerasedfsd';
const jwt = require('jsonwebtoken')

const express = require('express')
const { userAuths } = require('./db/models.js')

var router = express.Router()

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

router.post('/', jsonParser, async (req, res) => {
    console.log("登录")
    const user = await userAuths.findOne({
        uid: req.body.studentId
    })
    // uid is not exist
    if (!user) {
        return res.status(200).send({
            resCode: '2',
            token: ''
        })
    }
    
    const isPasswordValid = await require('bcrypt').compareSync(
        req.body.password,
        user.password
    )
    if (!isPasswordValid) {
        return res.status(200).send({
            resCode: '1',
            token: ''
        })
    }
    // 生成token
    const token = jwt.sign({
        id: String(user.uid),
    }, SECRET)

    res.send({
        resCode: "0",
        token
    })
})

module.exports = router