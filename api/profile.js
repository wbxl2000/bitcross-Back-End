// TODO 用文件替换掉 而且 全局唯一
const SECRET = 'qwrqerewrwerasedfsd';

const express = require('express')
const jwt = require('jsonwebtoken')
const { userAuths } = require('./db/models.js')

var router = express.Router()

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const auth = async (req, res, next) => {
    const raw = String(req.headers.authorization).split(' ').pop();
    const { id } = jwt.verify(raw, SECRET)
    req.user = await userAuths.findById(id)
    next()
}

router.get('/', jsonParser, auth, async (req, res) => {
    // console.log(req.body)
    res.send(req.user)
})

module.exports = router