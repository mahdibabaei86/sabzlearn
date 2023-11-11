let express = require('express');
let mysql = require('mysql');
let notificationAdminRouter = express.Router();

let database = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4'
});

database.connect(err => {
    if (err) {
        console.log('Error');
    } else {
        console.log('Success');
    }
});

notificationAdminRouter.put('/admin/notification/edit/', (req, res) => {
    let message = req.body.message;
    let quring = `UPDATE \`notifications\` SET \`message\`='${message}', \`status\`='active' WHERE 1`;
    database.query(quring, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.send('Update notification');
        }
    });
})

notificationAdminRouter.get('/admin/notification/enable/', (req, res) => {
    let quring = `UPDATE \`notifications\` SET \`status\`='inactive' WHERE 1`;
    database.query(quring, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.send('enable notification');
        }
    });
})

module.exports = notificationAdminRouter