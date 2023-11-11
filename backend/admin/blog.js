let express = require('express');
let mysql = require('mysql');
const cryptoModule = require('crypto');
const otpGeneratorss = require('otp-generator');
let path = require('path');
let blogRouterAdmin = express.Router();

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

blogRouterAdmin.post('/admin/blog/uploads/', (req, res) => {
    let Folder_dir_uploads = '../uploads/covers/'
    let file = req.files.file;
    let pathDir = path.join(path.join(__dirname, Folder_dir_uploads), file.name);
    file.mv(pathDir, err => {
        if (err) {
            res.sendStatus(400);
        } else {
            let responseInfo = {
                status: 200,
                urlCover: pathDir
            };
            res.send(responseInfo);
        }
    });
});

blogRouterAdmin.post('/admin/blog/new-article/', (req, res) => {
    let TokenId = otpGeneratorss.generate(19, { upperCaseAlphabets: false, specialChars: false });
    let querying = `INSERT INTO \`blog\`(\`id\`, \`title\`, \`athor\`, \`clendare\`, \`category\`, \`cover\`, \`description\`, \`Comments\`) VALUES ('${TokenId}','${req.body.title}','${req.body.author}','${req.body.clender}','${req.body.category}','${JSON.stringify(req.body.cover)}','${req.body.description}','[]')`;
    database.query(querying, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.send('ُSuccessFully new article');
        }
    })
});

blogRouterAdmin.delete('/admin/blog/remove/', (req, res) => {
    let quering = `DELETE FROM \`blog\` WHERE id = '${req.body.symbol}'`
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.send(`Success Remove post`)
        }
    });
});

blogRouterAdmin.post('/admin/blog/edit/', (req, res) => {
    let quering = `UPDATE \`blog\` SET \`title\`='${req.body.title}',\`athor\`='${req.body.author}',\`clendare\`='${req.body.clendare}',\`category\`='${req.body.category}',\`cover\`='${JSON.stringify(req.body.cover)}',\`description\`='${req.body.description}' WHERE id = '${req.body.id}'`;
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error', err);
        } else {
            res.json({ status: 200 });
        }
    });
});

module.exports = blogRouterAdmin