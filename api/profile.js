const fs = require('fs');
const SECRET = fs.readFileSync('lib/BALNEPO', 'utf8');

const express = require('express')
const jwt = require('jsonwebtoken')
const { userAuths } = require('./db/models.js')

var router = express.Router()

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const auth = async (req, res, next) => {
    const raw = String(req.headers.authorization).split(' ').pop();
    // console.log('raw:' + raw);
    const { id } = jwt.verify(raw, SECRET)
    // console.log("id? " + id);
    req.user = await userAuths.findOne({ uid: id });
    // console.log("who? " + req.user);
    next()
}

router.get('/', jsonParser, auth, async (req, res) => {
    // console.log(req.body)
    res.send(req.user)
})

module.exports = router