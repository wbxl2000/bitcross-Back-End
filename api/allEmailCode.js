const express = require('express')
const { emailCode } = require('./db/emailCode.js')

var router = express.Router()

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

router.get('/', jsonParser, async (req, res) => {
    const emailCodes = await emailCode.find()
    res.send(emailCodes)
})

module.exports = router