let express = require('express');
let mysql = require('mysql');
const cryptoModule = require('crypto');
const otpGeneratorss = require('otp-generator');
let path = require('path');
let blogRouterUser = express.Router();

let database = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

database.connect(err => {
    if (err) {
        console.log('Error');
    } else {
        console.log('Success');
    }
});

blogRouterUser.post('/user/blog/new-comment/', (req, res) => {
    let quering = `SELECT \`Comments\` FROM \`blog\` WHERE id = '${req.body.article}'`;
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            let memoryComment = JSON.parse(result[0]["Comments"]);
            let hashEmail = cryptoModule.createHash('md5').update(req.body.user.email).digest('hex');
            let profileGet = `https://s.gravatar.com/avatar/${hashEmail}?s=70`;
            req.body.user.profile = profileGet
            memoryComment.push(req.body);
            let qouery2 = `UPDATE \`blog\` SET \`Comments\`='${JSON.stringify(memoryComment)}' WHERE id = '${req.body.article}'`;
            database.query(qouery2, (err, result) => {
                if (err) {
                    console.log('Error', err);
                } else {
                    res.send('SuccessFully Send Comment');
                }
            });
        }
    });
});

blogRouterUser.post('/user/blog/replay-comment/', (req, res) => {
    let quering = `SELECT \`Comments\` FROM \`blog\` WHERE id = '${req.body.article}'`;
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            let memoryComment = JSON.parse(result[0]["Comments"]);
            let FindComment = memoryComment.find(comment => {
                return comment.id == req.body.resiveReplay
            })
            let FindCommentIndex = memoryComment.findIndex(comment => {
                return comment.id == req.body.resiveReplay
            })
            let replaysMemory = FindComment.replays;
            let hashEmail = cryptoModule.createHash('md5').update(req.body.user.email).digest('hex');
            let profileGet = `https://s.gravatar.com/avatar/${hashEmail}?s=70`;
            req.body.user.profile = profileGet;
            replaysMemory.push(req.body);
            memoryComment[FindCommentIndex].replays = replaysMemory;
            let qouery2 = `UPDATE \`blog\` SET \`Comments\`='${JSON.stringify(memoryComment)}' WHERE id = '${req.body.article}'`;
            database.query(qouery2, (err, result) => {
                if (err) {
                    console.log('Error');
                } else {
                    res.send('SuccessFully Send Replay Comment');
                }
            });
        }
    });
});

module.exports = blogRouterUser