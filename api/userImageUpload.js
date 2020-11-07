const fs = require('fs');
const SECRET = fs.readFileSync('lib/BALNEPO', 'utf8');

const jwt = require('jsonwebtoken')
const { userAuths } = require('./db/models.js')

const express = require('express')
const { userInfo } = require('./db/userInfo.js')

var router = express.Router()

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

router.post('/', async (req, res) => {
    var resJson = {
        resCode: "-1",
        url: ""
    };
    // if (req.user == null) {
    //     resJson.resCode = "1";
    //     resJson.url = "";
    //     res.json(resJson);
    //     res.end();
    //     return;
    // }
    
    if (!req.files) {
        resJson.resCode = "3";
        resJson.url = "";
        res.json(resJson);
        res.end();
        return;
    }

    if (req.files.image.size > 1024 * 1024) {
        resJson.resCode = "2";
        resJson.url = "";
        res.json(resJson);
        res.end();
        return;
    }
    console.log(req.files.image.name);

    const url = '/user_img/' + req.user.uid + req.files.image.name;
    const url2 = '/public/user_img/' + req.files.image.name;


    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.image;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('./public' + url, function (err) {
        console.log(url);
        if (err) {
            resJson.resCode = "3";
            resJson.url = "";
            console.log(err);
        } else {
            resJson.resCode = "0";
            resJson.url = url;
        }
        res.json(resJson);
        res.end();
        return;
    });
    if (resJson.resCode == "0") {
        let info = await userInfo.updateOne({
            uid: req.user.uid
        },{
            userImg: url
        })
        if (!info) {
            resJson.resCode = "1";
        }
    }
    res.json(resJson);
    res.end();
    return;
})


module.exports = router