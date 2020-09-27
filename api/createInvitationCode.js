const express = require('express')
const { invitationCode } = require('./db/invitationCode.js')

var router = express.Router()

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

router.post('/', jsonParser, async (req, res) => {


    const code = await invitationCode.create({
        code: req.body.code, 
        total: req.body.total
    })

    if(!code) {
        res.status(422).send({
            msg: "生成失败"
        })
    }

    code.count += 1;

    res.status(200).send({
        msg: "生成成功：" + req.body.code
    })
})

module.exports = router