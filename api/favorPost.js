const fs = require('fs');
const SECRET = fs.readFileSync('lib/BALNEPO', 'utf8');

const jwt = require('jsonwebtoken')
const { userAuths } = require('./db/models.js')

const express = require('express')
const { postPublish } = require('./db/postPublish.js')
const { favorPostList } = require('./db/favorPostList.js')

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
    // console.log(req.body)
    var resJson = {
        resCode: "-1"
    }

    // 找不到用户
    if (req.user == null) {
        resJson.resCode = "-1";
        res.json(resJson);
        res.end();
        return;
    }

    // 找文章
    var postRes = await postPublish.findOne({
        post_id: req.body.post_id
    })
    if (!postRes) {
        resJson.resCode = "1";
        res.json(resJson);
        res.end();
        return;
    }
    // console.log('postRes：：');
    // console.log(postRes);
    var nowCnt = postRes.favors;

    // 找一下是否收藏
    var isFavorite = '-1';
    var postRes = await favorPostList.findOne({
        post_id: req.body.post_id,
        uid: req.user.uid
    })

    if (!postRes) {
        isFavorite = "0";
    } else {
        isFavorite = "1";
    }

    // 仅查询
    if (req.body.opt != 1) {
        resJson.resCode = isFavorite;
        res.json(resJson);
        res.end();
        return;
    }

    console.log('是否被收藏过：' + isFavorite);
    // 反向
    if (isFavorite == '0') {
        // 需要添加
        console.log('req.body.uid::' + req.user.uid);
        var addFavor = await favorPostList.create({
            post_id: req.body.post_id,
            uid: req.user.uid
        })
        if (!addFavor) {
            resJson.resCode = '1';
        } else {
            resJson.resCode = '0';
            nowCnt += 1;
            console.log("now 数量+1：" + nowCnt);
            var findRes = await postPublish.findOne({
                post_id: req.body.post_id
            })

            // console.log("要更新的文章：");
            // console.log(findRes);

            var updateCount = await postPublish.updateOne({
                post_id: req.body.post_id
            },{
                favors: nowCnt
            })
        }
        res.json(resJson);
        res.end();
        return;
    } else if (isFavorite == '1') {
        // 需要删除
        var addFavor = await favorPostList.deleteOne({
            post_id: req.body.post_id,
            uid: req.user.uid
        })
        if (!addFavor) {
            resJson.resCode = '1';
        } else {
            resJson.resCode = '0';
            nowCnt -= 1;
            console.log("now 数量-1：" + nowCnt);
            var updateCount = await postPublish.updateOne({
                post_id: req.body.post_id
            },{
                favors: nowCnt
            })
        }
        res.json(resJson);
        res.end();
        return;
    }

})

module.exports = router