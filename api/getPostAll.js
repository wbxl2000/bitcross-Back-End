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
        resCode: "-1",
        total: 0,
        data: []
    };
    if (req.user == null) {
        resJson.resCode = "1";
        resJson.data = [];
        resJson.total = 0;
        res.json(resJson);
        res.end();
        return;
    }
    // var result = await postPublish.find({
    //     post_type: req.body.postType
    // });
    // console.log('raw:');
    // console.log(result)

    const sortParams = ['','pageView','start_time','floor_counts','floor_counts'];

    var result;

    if (req.body.postType == -1) { // search
        const keyword = req.body.search //从URL中传来的 keyword参数
        const reg = new RegExp(keyword, 'i') //不区分大小写
        console.log("keyword:" + keyword);
        let sssort = sortParams[req.body.rankType];
        result = await postPublish.find(
            {
                $or : [ //多条件，数组
                    {title : {$regex : reg}},
                    {introduce : {$regex : reg}}
                ]
            })
            .skip(req.body.numberBegin - 1)
            .limit(req.body.numberEnd - req.body.numberBegin + 1)
            .sort({
                sssort: -1
            });
        resJson.total = await postPublish.count(
            {
                $or : [ //多条件，数组
                    {title : {$regex : reg}},
                    {introduce : {$regex : reg}}
                ]
            })
        console.log('search res: ');
        console.log(result)
    } else if (req.body.postType == 0) {
        result = await postPublish.find()
        .skip(req.body.numberBegin - 1)
        .limit(req.body.numberEnd - req.body.numberBegin + 1)
        .sort({
            sssort: -1
        });
        resJson.total = await postPublish.count();
    } else {
        result = await postPublish.find({
            post_type: req.body.postType
        })
        .skip(req.body.numberBegin - 1)
        .limit(req.body.numberEnd - req.body.numberBegin + 1)
        .sort({
            sssort: -1
        });
        resJson.total = await postPublish.count({
            post_type: req.body.postType
        });
    }


    console.log("after skip and limit");
    console.log(result);


    for (let i = 0; i < result.length; i++) {
        // var timeTmp = (String)(result[i].start_time).split(' ');
        // timeTmp[1] = trans[timeTmp[1]];
        var aPost = {
            username: result[i].creator_id,
            id: result[i].creator_id, 
            title: result[i].title, 
            userimg: "https://myweb-image.oss-cn-beijing.aliyuncs.com/main_head.jpg",
            introduce: result[i].introduce, 
            count: [result[i].pageView, result[i].floor_counts, result[i].favors],
            articleid: result[i].post_id,
            time: (String)(result[i].start_time).split(' ')
        }


        resJson.data.push(aPost);
    }
    resJson.resCode = "0";
    console.log('this is data');
    console.log(resJson);
    res.json(resJson);
    res.end();
})

module.exports = router



// const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// var trans = [];
// for (let i = 0; i < Months.length; i++) {
//     trans[Months[i]] = i + 1;
// }
// console.log(trans);

// resJson.data[i].username = result[i].create_id; // need change
// resJson.data[i].id = result[i].create_id;
// resJson.data[i].title = result[i].title;
// resJson.data[i].userimg = "https://myweb-image.oss-cn-beijing.aliyuncs.com/main_head.jpg"; // need change
// resJson.data[i].content = result[i].content;
// resJson.data[i].count = [];
// resJson.data[i].count[0] = result[i].pageView;
// resJson.data[i].count[1] = result[i].pageView; // need change
// resJson.data[i].count[2] = result[i].pageView; // need change
// resJson.data[i].articleid = result[i].post_id;