let express = require('express');
let mysql = require('mysql');
let notificationPublicRouter = express.Router();

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

notificationPublicRouter.get('/public/notification/get/', (req, res) => {
    let quring = `SELECT \`message\`, \`status\` FROM \`notifications\` WHERE 1`;
    database.query(quring, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.json(result);
        }
    });
})

module.exports = notificationPublicRouter