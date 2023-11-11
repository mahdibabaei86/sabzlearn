let express = require('express');
let crypto = require('crypto');
let usersPublicRouter = express.Router();
let mysql = require('mysql');
var env = require('dotenv').config();
let jwt = require('jsonwebtoken');
const secretKey = process.env.secretKeyJWT;

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
        console.log('Success');
    }
});

// Get Profile User Account
usersPublicRouter.get('/public/users/profile/:email/', (req, res) => {
    let text = req.params.email;
    let hash = crypto.createHash('md5').update(text).digest('hex');
    res.send(`https://s.gravatar.com/avatar/${hash}?s=70`);
})

// login Users
usersPublicRouter.post('/public/users/login/', (req, res) => {
    let password = req.body.password;
    let passwordHashing = crypto.createHash('md5').update(password).digest('hex');
    let quering = `SELECT * FROM \`users\``
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            let resultUser = result.find(user => {
                if (user.username == req.body.username && user.password == passwordHashing && user.email == req.body.email) {
                    return user
                }
            });
            if (!resultUser) {
                let loginData = {
                    txt: 'not found',
                }
                res.send(JSON.stringify(loginData));
            } else {
                if (resultUser.status == 'Inactive') {
                    let loginData = {
                        txt: 'Ban User',
                    }
                    res.send(JSON.stringify(loginData));
                } else if (resultUser) {
                    const token = jwt.sign({ user: resultUser.username, email: resultUser.email, role: resultUser.type }, secretKey, {
                        expiresIn: '1h' // Token expiration time
                    });
                    let loginData = {
                        txt: 'accueillir',
                        info: resultUser,
                        token: token
                    }
                    res.send(JSON.stringify(loginData));
                }
            }
        }
    });
});

// signin Users
usersPublicRouter.post('/public/users/signin/', (req, res) => {
    let hashPassword = crypto.createHash('md5').update(req.body.password).digest('hex');
    let quering = `INSERT INTO \`users\`(\`username\`, \`password\`, \`name\`, \`family\`, \`bio\`, \`type\`, \`courses\`, \`wallet\`, \`email\`, \`status\`) VALUES ('${req.body.username}','${hashPassword}','${req.body.name}','${req.body.family}','bio','0','empty','${req.body.wallet}' ,'${req.body.email}' ,'${req.body.status}')`
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error create user', err);
        } else {
            res.send(hashPassword);
        }
    });
});

usersPublicRouter.post('/users/yuniq-info/', (req, res) => {
    let allUsers = `SELECT * FROM \`users\``;
    database.query(allUsers, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            let YuniqUsername = result.some(user => {
                return user.username == req.body.username
            });
            let YuniqEmail = result.some(user => {
                return user.email == req.body.email
            });
            if (YuniqUsername == true || YuniqEmail == true) {
                res.send('repeat');
            } else {
                res.send('yuniq');
            }
        }
    });
})

// Get Users All
usersPublicRouter.get('/public/users/all/', (req, res) => {
    let quering = `SELECT * FROM \`users\``
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.send(result);
        }
    });
});

// valid User
usersPublicRouter.post(`/public/users/validate/`, (req, res) => {
    let quering = `SELECT * FROM \`users\``
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            let TypeUser = result.some(user => {
                return user.username == req.body.username && user.password == req.body.password && req.body.type == user.type
            });
            res.send(TypeUser);
        }
    });
});

module.exports = usersPublicRouter