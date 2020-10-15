const fs = require('fs');
const SECRET = fs.readFileSync('lib/BALNEPO', 'utf8');

const jwt = require('jsonwebtoken')
const { userAuths } = require('./db/models.js')

const express = require('express')
const { postPublish } = require('./db/postPublish.js')
const { postReply } = require('./db/postReply.js')
const { postReplyRE } = require('./db/postReply_RE.js')

var router = express.Router()

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const auth = async (req, res, next) => {
    // const raw = String(req.headers.authorization).split(' ').pop();
    var raw = req.body.token;
    console.log('raw:' + raw);
    if (!raw) {
        req.user = null;
    } else {
        console.log("process token");
        const { id } = jwt.verify(raw, SECRET)
        // console.log("id? " + id);
        req.user = await userAuths.findOne({ uid: id });
        // console.log("who? " + req.user);
    }
    next()
}

router.post('/', jsonParser, auth, async (req, res) => {
    console.log(req.body)

    const post = await postPublish.findOne({
        post_id: req.body.post_id
    })

    if (!post) {
        res.status(200).send({
            resCode: "1"
        })
        return;
    }
    let floor = post.floor_counts + 1;
    let some = postPublish.updateOne({post_id: req.body.post_id}, {floor_counts: floor}, function(err, docs){
        if(err) console.log(err);
        console.log('floor修改成功：' + docs);
    })

    const content = await postReplyRE.create({
        post_id: req.body.post_id,
        uid: req.user.uid,
        reply_content: req.body.reply_content,
        rereply_floor: req.body.rereply_floor
    })

    if (!content) {
        res.status(200).send({
            resCode: "1"
        })
    } else {
        res.status(200).send({
            resCode: "0"
        })
    }


})

module.exports = router