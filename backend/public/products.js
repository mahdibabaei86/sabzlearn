let express = require('express');
let productsRouterPublic = express.Router();
let mysql = require('mysql');
const crypto = require('crypto');
let path = require('path');

let database = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

database.connect(err => {
    if (err) {
        console.log('Error');
    } else {
        console.log('Success ticket');
    }
});

productsRouterPublic.get('/public/products/search/:name/', (req, res) => {
    let quering = `SELECT * FROM \`products\``;
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            let resultSearch = result.filter(course => {
                const regex = new RegExp(req.params.name, 'i'); // 'i' flag for case-insensitive search
                return regex.test(course.name);
            });
            res.json(resultSearch);
        }
    })
});

productsRouterPublic.post('/public/products/new-comment/', (req, res) => {
    let quering = `SELECT \`Comments\` FROM \`products\` WHERE symbol = '${req.body.course}'`;
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            let memoryComment = JSON.parse(result[0]["Comments"]);
            let hashEmail = crypto.createHash('md5').update(req.body.user.email).digest('hex');
            let profileGet = `https://s.gravatar.com/avatar/${hashEmail}?s=70`;
            req.body.user.profile = profileGet
            memoryComment.push(req.body);
            let qouery2 = `UPDATE \`products\` SET \`Comments\`='${JSON.stringify(memoryComment)}' WHERE symbol = '${req.body.course}'`;
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

productsRouterPublic.post('/public/products/replay-comment/', (req, res) => {
    let quering = `SELECT \`Comments\` FROM \`products\` WHERE symbol = '${req.body.course}'`;
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
            let hashEmail = crypto.createHash('md5').update(req.body.user.email).digest('hex');
            let profileGet = `https://s.gravatar.com/avatar/${hashEmail}?s=70`;
            req.body.user.profile = profileGet;
            replaysMemory.push(req.body);
            memoryComment[FindCommentIndex].replays = replaysMemory;
            let qouery2 = `UPDATE \`products\` SET \`Comments\`='${JSON.stringify(memoryComment)}' WHERE symbol = '${req.body.course}'`;
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

productsRouterPublic.get('/public/products/all-comments/:symbol/', (req, res) => {
    let quering = `SELECT \`Comments\` FROM \`products\` WHERE symbol = '${req.params.symbol}'`;
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.json(result);
        }
    });
});

productsRouterPublic.post(`/public/products/rigistred-course/`, (req, res) => {
    let quering = `SELECT \`student\` FROM \`products\` WHERE symbol = '${req.body.symbol}'`;
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            let students = Array(result[0].student);
            let username = req.body.username
            students.push(username);
            let updating = `UPDATE \`products\` SET \`student\`= '${students}' WHERE symbol = '${req.body.symbol}'`;
            database.query(updating, (err, result) => {
                if (err) {
                    console.log('Error');
                } else {
                    res.send('rigistred');
                }
            });
        }
    });
});

productsRouterPublic.get('/public/products/view/:name/', (req, res) => {
    let quering = `SELECT \`symbol\`, \`name\`, \`cover\`, \`shortdes\`, \`category\`, \`shortVideo\`, \`price\`, \`percentComplete\`, \`updated\`, \`time\`, \`status\`, \`support\`, \`prerequisite\`, \`whatcher\`, \`teacher\`, \`description\`, \`videos\`, \`Comments\`, \`student\`, \`persentOff\` FROM \`products\` WHERE symbol = '${req.params.name}'`
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.send(result);
            console.log('Success Result');
        }
    });
});

productsRouterPublic.get('/public/products/all/', (req, res) => {
    let quering = `SELECT * FROM \`products\``
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.send(result);
        }
    });
});

productsRouterPublic.get('/public/products/my-course/:username', (req, res) => {
    let quering = `SELECT * FROM \`products\``
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            let myCourse = [];
            result.forEach(product => {
                product.student.split(',').forEach(student => {
                    if (req.params.username == student) {
                        myCourse.push(product);
                    }
                })
            });
            res.send(JSON.stringify(myCourse));
        }
    });
});

module.exports = productsRouterPublic