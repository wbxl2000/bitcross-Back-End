const express = require('express')
var nodemailer = require('nodemailer');
const { emailCode } = require('./db/emailCode.js')

var router = express.Router()

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

var createSixNum = () => {
    var Num = "";
    for (var i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    return Num;
}

router.post('/', jsonParser, async (req, res) => {
    const theMail = req.body.email;

    var transporter = nodemailer.createTransport({
        service: 'qq',
        auth: {
            user: '1074796769@qq.com',
            pass: 'xmjuwlugtsqejdba'
        }
    });

    var code = createSixNum();
    console.log(code);


    var mailOptions = {
        from: '1074796769@qq.com',
        to: theMail,
        subject: 'Bitcross 注册验证码',
        text: '感谢您注册Bitcross。\n您的验证码为：' + code + '。\n有效时间：5 min。'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            // 保存验证码
            console.log(`will store:` + theMail + ", " + code);
            const emailer = emailCode.create({
                email: theMail,
                code
            }, (err, data) => {
                if (err) {
                    console.log('store error' + err);
                    res.status(200).send({
                        resCode: "1"
                        // msg: "邮件发送失败，邮箱填写错误，请检查后重试。详情请询问管理员。"
                    })
                } else {
                    res.status(200).send({
                        resCode: "0"
                        // msg: "邮件发送成功"
                    })
                }
            })
        }
    });

})

module.exports = router

