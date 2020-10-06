const express = require('express')
const { postPublish } = require('./db/postPublish.js')
const { counts } = require('./db/counts.js')

var router = express.Router()

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

router.post('/', jsonParser, async (req, res) => {
    console.log(req.body)

    // 这是我今年写过的最丑的代码，但是没办法
    let cnt = await counts.findOne({
        name: "post"
    })
    if (!cnt) {
        count = await counts.create({
            name: "post"
        })
        cnt = await counts.findOne({
            name: "post"
        })
    }
    if (!cnt) {
        res.status(200).send({
            msg: "一些意料之外的错误"
        })
        return;
    }
    let newCnt = cnt.count + 1;

    let some = await counts.updateOne({name: "post"}, {count: newCnt}, function(err, docs){
        if(err) console.log(err);
        console.log('post修改成功：' + docs);
    })

    const post = await postPublish.create({
        post_id: newCnt,
        post_type: req.body.postType, 
        creator_id: req.body.creatorId,
        title: req.body.title,
        content: req.body.content
    })
    if (!post) {
        res.status(200).send({
            msg: "发帖失败"
        })
    } else {
        res.status(200).send({
            msg: "发帖成功"
        })
    }



})

module.exports = router