const fs = require('fs');
const SECRET = fs.readFileSync('lib/BALNEPO', 'utf8');

const jwt = require('jsonwebtoken')


const express = require('express')
const { userAuths } = require('./db/models.js')
const { emailCode } = require('./db/emailCode.js')
const { invitationCode } = require('./db/invitationCode.js')
const { counts } = require('./db/counts.js')

var router = express.Router()

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

router.post('/', jsonParser, async (req, res) => {
    var endPost = (resCode, token = '') => {
        console.log('endpost: ' + token)
        return res.status(200).send({
            resCode,
            token
        })
    }

    var token = "";
    var resCode = 0;
    // 验证数据是否合法
    if (!req.body.studentId || !req.body.realName || !req.body.password 
        || !req.body.invitationCode || !req.body.email || !req.body.emailCode) {
            resCode = "4";
        } else {
            console.log("数据合法");
        }
    if (resCode) {
        endPost(resCode, token);
        return;
    }
    // 验证用户是否存在
    const existUser = await userAuths.findOne({
        uid: req.body.studentId
    }, (err, data) => {
        if (err || data) {
            console.log("err:" + err + ', data:' + data);
            // endPost("4", "ttttt");
            resCode = "4"
        } else {
            console.log("不存在重复用户");
        }
    })
    if (resCode) {
        endPost(resCode, token);
        return;
    }

    // 验证邮箱验证码  期待一种更好看的写法
    const email = await emailCode.findOne({
        email: req.body.email
    }, (err, data) => {
        if (err || !data) {
            resCode = "1"
        } else {
            if (data.code != req.body.emailCode) {
                resCode = "1";
            } else {
                console.log('邮箱验证成功');
            }
        }
    })
    if (resCode) {
        endPost(resCode, token);
        return;
    }

    // 验证邀请码
    const invitationVerification = await invitationCode.findOne({
        code: req.body.invitationCode
    }, (err, data) => {
        if (err) {
            // endPost("2");
            resCode = "2"
        } else {
            if (!data) {
                // endPost("4");
                resCode = "4"
            } else {
                console.log('邀请码查找成功');
                if (data.count == data.total) {
                    console.log('邀请码使用次数用完，已过期');
                    // endPost("3");
                    resCode = "3";
                } 
            }
        }
    })
    if (resCode) {
        endPost(resCode, token);
        return;
    }
    
    // 更新邀请码使用次数
    const x3 = await invitationCode.updateOne({
        code: req.body.invitationCode
    }, {
        count: invitationVerification.count + 1
    }, (err, data) => {
        if(err) {
            console.log(err);
            // endPost("4");
            resCode = "4";
        } else {
            console.log('邀请码使用次数修改成功：' + data);
        }
    })    
    if (resCode) {
        endPost(resCode, token);
        return;
    }
    // 修改总人数
    let nums = await counts.findOne({
        name: "user"
    })

    let x1 = await counts.updateOne({
        name: "user"
    }, {
        count: nums.count + 1
    }, (err, data) => {
        if(err) {
            console.log('人数修改失败:' + err);
            // endPost("4");
            resCode = "4";
        } else {
            console.log('人数修改成功：' + data.count);
        }
    })
    if (resCode) {
        endPost(resCode, token);
        return;
    }
    // 创建用户
    const user = await userAuths.create({
        uid: req.body.studentId, 
        id: nums.count + 1, 
        password: req.body.password
    }, (err, data) => {
        if (err) {
            console.log('用户创建失败:' + err);
            // endPost("4");
            resCode = "4";
        } else {
            console.log('用户创建成功:' + data.uid);
            // 生成token
            token = jwt.sign({
                id: String(req.body.studentId),
            }, SECRET)
            console.log("token生成成功");
            endPost("0", token);
        }
    })

})

module.exports = router