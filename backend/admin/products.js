let express = require('express');
let productsRouterAdmin = express.Router();
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

productsRouterAdmin.post('/admin/products/edit/', (req, res) => {
    let quering = `UPDATE \`products\` SET \`symbol\`='${req.body.symbol}',\`name\`='${req.body.name}',\`cover\`='${JSON.stringify(req.body.cover)}',\`shortdes\`='${req.body.descriptionShort}',\`category\`='${req.body.category}',\`shortVideo\`= '${JSON.stringify(req.body.videoShort)}',\`price\`='${req.body.price}',\`percentComplete\`='${req.body.percentComplateCourse}',\`updated\`='${req.body.updated}',\`time\`='${req.body.timeCourse}',\`status\`='${req.body.statusCourse}',\`support\`='${req.body.support}',\`prerequisite\`='${req.body.requirements}',\`whatcher\`='${req.body.whatcherType}',\`teacher\`='${req.body.teacher}',\`description\`='${req.body.descriptionLong}',\`persentOff\`='${req.body.persentOff}' WHERE symbol = '${req.body.symbol}'`;
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error', err);
        } else {
            res.json({ status: 200 });
        }
    });
});

productsRouterAdmin.delete('/admin/products/remove/', (req, res) => {
    let quering = `DELETE FROM \`products\` WHERE symbol = '${req.body.symbol}'`
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.send(`Success Remove Product`)
        }
    });
});

productsRouterAdmin.post('/admin/products/add/', (req, res) => {
    let quering = `INSERT INTO \`products\`(\`symbol\`, \`name\` , \`cover\`, \`shortdes\`, \`category\`, \`shortVideo\`, \`price\`, \`percentComplete\`, \`updated\`, \`time\`, \`status\`, \`support\`, \`prerequisite\`, \`whatcher\`, \`teacher\`, \`description\`, \`videos\`, \`Comments\`, \`student\`, \`persentOff\`) VALUES ('${req.body.symbol}','${req.body.name}' ,'${JSON.stringify(req.body.cover['urlCover'])}','${req.body.descriptionShort}','${req.body.category}','${JSON.stringify(req.body.videoShort['urlVideo'])}','${req.body.price}','${req.body.percentComplateCourse}','${req.body.updated}','${req.body.timeCourse}','${req.body.statusCourse}','${req.body.support}','${req.body.requirements}','${req.body.whatcherType}','${req.body.teacher}','${req.body.descriptionLong}','${JSON.stringify(req.body.videosFile['urlmainfile'])}','[]','empty','${req.body.persentOff}')`
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            let responseInfo = {
                status: 200,
            };
            res.send(responseInfo);
        }
    });
});

productsRouterAdmin.post('/admin/products/uploads/', (req, res) => {
    let Folder_dir_uploads = '../uploads/IntroductionVideoCourse/'
    let file = req.files.file;
    let pathDir = path.join(path.join(__dirname, Folder_dir_uploads), file.name);
    file.mv(pathDir, err => {
        if (err) {
            res.sendStatus(400);
        } else {
            let responseInfo = {
                status: 200,
                urlVideo: pathDir
            };
            res.json(responseInfo);
        }
    });
});

productsRouterAdmin.post('/admin/products/uploads/covers/', (req, res) => {
    let Folder_dir_uploads = '../uploads/covers/'
    let file = req.files.cover;
    let pathDir = path.join(path.join(__dirname, Folder_dir_uploads), file.name);
    file.mv(pathDir, err => {
        if (err) {
            res.sendStatus(400);
        } else {
            let responseInfo = {
                status: 200,
                urlCover: pathDir
            };
            res.json(responseInfo);
        }
    });
});

productsRouterAdmin.post('/admin/products/uploads/mainfile/', (req, res) => {
    let Folder_dir_uploads = '../uploads/mainfile/'
    let file = req.files.mainfile;
    let pathDir = path.join(path.join(__dirname, Folder_dir_uploads), file.name);
    file.mv(pathDir, err => {
        if (err) {
            res.sendStatus(400);
        } else {
            let responseInfo = {
                status: 200,
                urlmainfile: pathDir
            };
            res.json(responseInfo);
        }
    });
});

module.exports = productsRouterAdmin