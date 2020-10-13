const fs = require('fs');
const SECRET = fs.readFileSync('lib/BALNEPO', 'utf8');

const jwt = require('jsonwebtoken')
const { userAuths } = require('./db/models.js')

const express = require('express')
const { postPublish } = require('./db/postPublish.js')
const { counts } = require('./db/counts.js')

var router = express.Router()

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const auth = async (req, res, next) => {
    // const raw = String(req.headers.authorization).split(' ').pop();
    var raw = req.body.token;
    // console.log('raw:' + raw);
    const { id } = jwt.verify(raw, SECRET)
    // console.log("id? " + id);
    req.user = await userAuths.findOne({ uid: id });
    // console.log("who? " + req.user);
    next()
}

router.post('/', jsonParser, auth, async (req, res) => {
    // console.log(req.body)
    var result = await postPublish.find({
        post_type: req.body.postType
    });
    console.log('raw:');
    console.log(result)

    result = await postPublish.find({
        post_type: req.body.postType
    }).skip(req.body.numberBegin).limit(req.body.numberEnd - req.body.numberBegin + 1);
    console.log("after skip and limit");
    console.log(result);
})

module.exports = router