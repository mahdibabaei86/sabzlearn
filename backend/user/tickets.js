let express = require('express');
let ticketUserRouter = express.Router();
let mysql = require('mysql');
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
        console.log('Success');
    }
});

// send tickets
ticketUserRouter.post(`/user/ticket/send/`, (req, res) => {
    let quering = `INSERT INTO \`tickets\`(\`id\`, \`own\`, \`keyPass\`,\`title\`, \`departeman\`, \`chats\`, \`status\`) VALUES ('','${req.body.chats.infoUser.username}','${req.body.chats.infoUser.password}','${req.body.title}','${req.body.departeman}','[${JSON.stringify(req.body.chats)}]','${req.body.status}')`;
    console.log(quering);
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error Send Ticket');
        } else {
            res.send('Success Send Ticket');
        }
    })
})

ticketUserRouter.get(`/user/ticket/view/:username/:password/`, (req, res) => {
    let quering = `SELECT * FROM \`tickets\` WHERE own = '${req.params.username}' AND keyPass = '${req.params.password}'`
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error view Ticket');
        } else {
            res.json(result);
        }
    })
});

// render append inf message in page chat
ticketUserRouter.get(`/user/ticket/view/:id/:username/:password/`, (req, res) => {
    let quering = `SELECT * FROM \`tickets\` WHERE own = '${req.params.username}' AND keyPass = '${req.params.password}' AND id = ${req.params.id}`
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error Status Ticket');
        } else {
            res.send(result);
        }
    })
});

ticketUserRouter.post('/user/ticket/send-response/', (req, res) => {
    let quering = `SELECT * FROM \`tickets\` WHERE own = '${req.body.username}' AND keyPass = '${req.body.password}' AND id = '${req.body.id}'`
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error send response Ticket');
        } else {
            let chats = JSON.parse(result[0].chats);
            let now = new Date();
            let newResponse = {
                infoUser: req.body.userInfo,
                description: req.body.description,
                hour: `${now.getHours()}:${now.getMinutes()}`,
                date: `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`,
            }
            chats.push(newResponse);
            let googled = `UPDATE \`tickets\` SET \`chats\`='${JSON.stringify(chats)}' WHERE own = '${req.body.username}' AND keyPass = '${req.body.password}' AND id = '${req.body.id}'`
            database.query(googled, (err, result) => {
                if (err) {
                    console.log('Error send response Ticket');
                } else {
                    res.send('send message');
                }
            })
        }
    })
});

ticketUserRouter.post('/user/ticket/upload/file/', (req, res) => {
    let file = req.files.file;
    let Folder_dir_uploads = '../uploads/chats/'
    let pathDir = path.join(path.join(__dirname, Folder_dir_uploads), file.name);
    file.mv(pathDir, err => {
        if (err) {
            res.sendStatus(400);
        } else {
            res.send(pathDir);
        }
    });
});

module.exports = ticketUserRouter