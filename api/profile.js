const fs = require('fs');
const SECRET = fs.readFileSync('lib/BALNEPO', 'utf8');

const express = require('express')
const jwt = require('jsonwebtoken')
const { userAuths } = require('./db/models.js')
const { userInfo } = require('./db/userInfo.js')

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

    resJson.resCode = "0";
    let per = await userInfo.findOne({uid: req.user.uid});
    // console.log("per" + per);
    if (!per) {
        resJson.resCode = "1";
        resJson.data = [];
        res.json(resJson);
        res.end();
        return;
    }

    let perData = {
        uid: per.uid,
        RegDate: (String)(per.RegDate).split(' '),
        nickName: per.nickName,
        realName: per.realName,
        realNamehide: per.realNamehide,
        Point: per.Point,
        Level: per.Level,
        Signature: per.Signature,
        userImg: per.userImg
    };
    
    resJson.data.push(perData);
    
    res.json(resJson);
    res.end();
    return;

})

module.exports = router