const fs = require('fs');
const SECRET = fs.readFileSync('lib/BALNEPO', 'utf8');

const jwt = require('jsonwebtoken')
const { userAuths } = require('./db/models.js')

const express = require('express')
const { postPublish } = require('./db/postPublish.js')
const { postReply } = require('./db/postReply.js')
const { postReplyRE } = require('./db/postReply_RE.js')

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
    console.log(req.files.image.name);
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.image;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('./lib/img/qer.jpeg', function (err) {
        if (err)
            return res.status(500).send(err);
        res.send('File uploaded!');
    });
})


module.exports = router