const express = require('express')
const { postPublish } = require('./db/postPublish.js')
const { postContent } = require('./db/postContent.js')

var router = express.Router()

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

router.post('/', jsonParser, async (req, res) => {
    console.log(req.body)

    const post = await postPublish.findOne({
        post_id: req.body.post_id
    })

    if (!post) {
        res.status(200).send({
            msg: "帖子id参数错误"
        })
        return;
    }
    let floor = post.floor_counts+1;
    let some = postPublish.updateOne({post_id: req.body.post_id}, {floor_counts: floor}, function(err, docs){
        if(err) console.log(err);
        console.log('floor修改成功：' + docs);
    })

    const content = await postContent.create({
        post_id: req.body.post_id,
        reply_id: req.body.reply_id,
        reply_content: req.body.reply_content,
        floor
    })

    if (!content) {
        res.status(200).send({
            msg: "回复失败"
        })
    } else {
        res.status(200).send({
            msg: "回复成功"
        })
    }


})

module.exports = router