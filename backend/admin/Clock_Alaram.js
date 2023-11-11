let express = require('express');
let mysql = require('mysql');
const otpGeneratorss = require('otp-generator');
let ClockRouterAdmin = express.Router();

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

ClockRouterAdmin.post('/admin/alaram/new/', (req, res) => {
    let newAlaram = req.body;
    let TokenId = otpGeneratorss.generate(19, { upperCaseAlphabets: false, specialChars: false });
    let qoeury = `INSERT INTO \`alarm-clock\`(\`id\`, \`title\`, \`clock\`, \`note\`, \`email\`, \`username\`, \`status\`) VALUES ('${TokenId}','${newAlaram.title}','${newAlaram.clock}','${newAlaram.note}','${newAlaram.email}','${newAlaram.username}', 'active')`;
    database.query(qoeury, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.send('create alaram');
        }
    });
});

ClockRouterAdmin.delete('/admin/alaram/remove/:id/', (req, res) => {
    let query = `DELETE FROM \`alarm-clock\` WHERE id = '${req.params.id}'`;
    database.query(query, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.send('remove alaram');
        }
    });
});

ClockRouterAdmin.get('/admin/alaram/all/', (req, res) => {
    let query = `SELECT * FROM \`alarm-clock\``;
    database.query(query, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.json(result);
        }
    });
});

module.exports = ClockRouterAdmin