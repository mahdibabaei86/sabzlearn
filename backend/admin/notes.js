let express = require('express');
let mysql = require('mysql');
const otpGeneratorss = require('otp-generator');
let noteRouterAdmin = express.Router();

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

noteRouterAdmin.post('/admin/note/new/', (req, res) => {
    let newAlaram = req.body;
    let TokenId = otpGeneratorss.generate(19, { upperCaseAlphabets: false, specialChars: false });
    let qoeury = `INSERT INTO \`notes\`(\`id\`, \`title\`, \`clock\`, \`note\`, \`email\`, \`username\`, \`status\`) VALUES ('${TokenId}','${newAlaram.title}','${newAlaram.clock}','${newAlaram.note}','${newAlaram.email}','${newAlaram.username}', 'active')`;
    database.query(qoeury, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.send('create note');
        }
    });
});

noteRouterAdmin.delete('/admin/note/remove/:id/', (req, res) => {
    let query = `DELETE FROM \`notes\` WHERE id = '${req.params.id}'`;
    database.query(query, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.send('remove note');
        }
    });
});

noteRouterAdmin.get('/admin/note/all/', (req, res) => {
    let query = `SELECT * FROM \`notes\``;
    database.query(query, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.json(result);
        }
    });
});

module.exports = noteRouterAdmin