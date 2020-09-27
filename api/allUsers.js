const express = require('express')
const { userAuths } = require('./db/models.js')

var router = express.Router()

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

router.get('/', jsonParser, async (req, res) => {
    const users = await userAuths.find()
    res.send(users)
    // res.send("users")
})

module.exports = router