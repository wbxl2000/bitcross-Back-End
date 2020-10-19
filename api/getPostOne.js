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
    // console.log(req.body)
    console.log('要找的：' + req.body.post_id);
    var resJson = {
        resCode: "-1",
        data: []
    };
    if (req.user == null) {
        resJson.resCode = "1";
        resJson.data = [];
        res.json(resJson);
        res.end();
        return;
    }

    var results = await postPublish.find({
        post_id: req.body.post_id
    })

    var result = results[0];

    if (!result) {
        resJson.resCode = "1";
        resJson.data = [];
        res.json(resJson);
        res.end();
        return;
    }
    console.log("result:");
    console.log(result);

    var pageView_add = result.pageView + 1;
    // 浏览量
    var update_val = await postPublish.updateOne({
        post_id: req.body.post_id
    }, {
        pageView: pageView_add
    })

    var aPost = {
        username: result.creator_id,
        id: result.creator_id, 
        title: result.title, 
        userimg: "https://myweb-image.oss-cn-beijing.aliyuncs.com/main_head.jpg",
        content: result.content, 
        count: [result.pageView, result.floor_counts, result.favors],
        time: (String)(result.start_time).split(' '),
        reply: [],
    }

    const replys = await postReply.find({
        post_id: req.body.post_id,
    }).sort({
        floor: 1
    })
    console.log('replys:');
    console.log(replys);
    for (let i = 0; i < replys.length; i++) {
        var aFloor = {
            floor: replys[i].floor,
            user_img: "https://myweb-image.oss-cn-beijing.aliyuncs.com/main_head.jpg",
            username: replys[i].uid,
            reply_content: replys[i].reply_content,
            time: (String)(replys[i].reply_time).split(' '),
            reply_list: []
        }
        // const allrereplys = await postReplyRE.find()
        const rereplys = await postReplyRE.find({
            post_id: replys[i].post_id,
            rereply_floor: replys[i].floor
        })
        console.log('rereplys');
        console.log(rereplys);
        // console.log('allrereplys');
        // console.log(allrereplys);
        for (let j = 0; j < rereplys.length; j++) {
            var aFloorFloor = {
                user_img: "https://myweb-image.oss-cn-beijing.aliyuncs.com/main_head.jpg",
                username: rereplys[j].uid,
                reply_content: rereplys[j].reply_content,
                time: (String)(rereplys[j].rereply_time).split(' ')
            }

            aFloor.reply_list.push(aFloorFloor)
        }


        aPost.reply.push(aFloor);
        
    }

    resJson.resCode = '0';
    resJson.data.push(aPost);
    res.json(resJson);
    res.end();
})


module.exports = router