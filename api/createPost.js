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

    // 这是我今年写过的最丑的代码，但是没办法
    let cnt = await counts.findOne({
        name: "post"
    })
    // if (!cnt) {
    //     count = await counts.create({
    //         name: "post"
    //     })
    //     cnt = await counts.findOne({
    //         name: "post"
    //     })
    // }
    if (!cnt) {
        return res.status(200).send({
            // msg: "一些意料之外的错误"
            resCode: "1"
        })
    }
    let newCnt = cnt.count + 1;

    let some = await counts.updateOne({name: "post"}, {count: newCnt}, function(err, docs){
        if(err) console.log(err);
        console.log('post_cnt修改成功：' + docs);
    })

    const post = await postPublish.create({
        post_id: newCnt,
        post_type: req.body.postType, 
        creator_id: req.user.uid,
        title: req.body.title,
        content: req.body.content,
        introduce: req.body.introduce
    })
    if (!post) {
        res.status(200).send({
            // msg: "发帖失败"
            resCode: "1"
        })
    } else {
        res.status(200).send({
            // msg: "发帖成功"
            resCode: "0"
        })
    }


})

module.exports = router