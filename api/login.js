// TODO 用文件替换掉 而且 全局唯一
const SECRET = 'qwrqerewrwerasedfsd';

const express = require('express')
const jwt = require('jsonwebtoken')
const { userAuths } = require('./db/models.js')

var router = express.Router()

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

router.post('/', jsonParser, async (req, res) => {
    const user = await userAuths.findOne({
        uid: req.body.studentId
    })
    // uid is not exist
    if (!user) {
        return res.status(422).send({
            msg: '用户名不存在'
        })
    }
    
    const isPasswordValid = require('bcrypt').compareSync(
        req.body.password,
        user.password
    )
    if (!isPasswordValid) {
        return res.status(422).send({
            msg: '密码无效或错误'
        })
    }
    // 生成token
    const token = jwt.sign({
        id: String(user._id),
    }, SECRET)

    res.send({
        user,
        token
    })
})

module.exports = router