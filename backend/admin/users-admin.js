let express = require('express');
let crypto = require('crypto');
let usersAdminRouter = express.Router();
let mysql = require('mysql');
var env = require('dotenv').config();
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

// add user by admin
usersAdminRouter.post('/admin/users/add/', (req, res) => {
    let hashPassword = crypto.createHash('md5').update(req.body.password).digest('hex');
    let quering = `INSERT INTO \`users\`(\`username\`, \`password\`, \`name\`, \`family\`, \`bio\`, \`type\`, \`courses\`, \`wallet\`, \`email\`, \`status\`) VALUES ('${req.body.username}','${hashPassword}','${req.body.name}','${req.body.family}','bio','${req.body.type}','${req.body.courses}','${req.body.wallet}' ,'${req.body.email}' ,'${req.body.status}')`
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error create user');
        } else {
            res.send(hashPassword);
        }
    });
});

// edit user by admin
usersAdminRouter.post(`/admin/users/edit/`, (req, res) => {
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
});

// remove user by admin
usersAdminRouter.delete('/admin/users/remove/', (req, res) => {
    let quering = `DELETE FROM \`users\` WHERE username = '${req.body.findUsername}'`
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.send('Remove User');
        }
    });
});

// ban user by admin
usersAdminRouter.get('/admin/users/ban/:username/', (req, res) => {
    let quering = `UPDATE \`users\` SET \`status\`='Inactive' WHERE username = '${req.params.username}'`
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.send('Ban User');
        }
    });
});

// open user by admin
usersAdminRouter.get('/admin/users/open/:username/', (req, res) => {
    let quering = `UPDATE \`users\` SET \`status\`='active' WHERE username = '${req.params.username}'`
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.send('Open User');
        }
    });
});

// access to users all by admin
usersAdminRouter.get('/admin/users/all/', (req, res) => {
    let quering = `SELECT * FROM \`users\``
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.send(result);
        }
    });
});

module.exports = usersAdminRouter