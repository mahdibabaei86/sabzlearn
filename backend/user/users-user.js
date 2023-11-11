let express = require('express');
let crypto = require('crypto');
let usersUserRouter = express.Router();
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

usersUserRouter.post(`/user/users/edit/`, (req, res) => {
    if (req.body.password == 'empty') {
        let quering = `UPDATE \`users\` SET \`name\`='${req.body.name}',\`family\`='${req.body.family}',\`bio\`='${req.body.bio}' WHERE username = '${req.body.username}'`;
        database.query(quering, (err, result) => {
            if (err) {
                console.log('Error Update info user');
            } else {
                res.send('Success Edit Info');
            }
        });
    } else {
        let hashPasswords = crypto.createHash('md5').update(req.body.password).digest('hex');
        let quering = `UPDATE \`users\` SET \`password\`='${hashPasswords}',\`name\`='${req.body.name}',\`family\`='${req.body.family}',\`bio\`='${req.body.bio}' WHERE username = '${req.body.username}'`;
        database.query(quering, (err, result) => {
            if (err) {
                console.log('Error Update info user');
            } else {
                res.send('Success Edit Info');
            }
        });
    }
})

module.exports = usersUserRouter