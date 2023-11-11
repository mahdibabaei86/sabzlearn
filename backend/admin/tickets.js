let express = require('express');
let ticketsRouterAdmins = express.Router();
require('dotenv').config();
let mysql = require('mysql');

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
// // in admin send status ticket
// ticketsAdminRouter.get(`/admin/ticket/view/:id/`, (req, res) => {
//     let quering = `SELECT * FROM \`tickets\` WHERE id = ${req.params.id}`
//     database.query(quering, (err, result) => {
//         if (err) {
//             console.log('Error Status Tickets');
//         } else {
//             res.send(result);
//         }
//     })
// });

// render append info message in page chat //admin
ticketsRouterAdmins.get(`/admin/ticket/views/:id/`, (req, res) => {
    let quering = `SELECT * FROM \`tickets\` WHERE id = '${req.params.id}'`
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error Status Tickets',err);
        } else {
            res.send(result);
        }
    })
});

ticketsRouterAdmins.get('/admin/ticket/close/:id/', (req, res) => {
    let quering = `UPDATE \`tickets\` SET \`status\`='close' WHERE id = ${req.params.id}`
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error close Ticket');
        } else {
            res.send('success close');
        }
    })
});

//  view all tickets
ticketsRouterAdmins.get(`/admin/ticket/view/all/`, (req, res) => {
    let querinrewg = `SELECT * FROM \`tickets\``
    database.query(querinrewg, (err, result) => {
        if (err) {
            console.log('Error view Ticket');
        } else {
            res.send(result);
        }
    })
});

// page Chat
ticketsRouterAdmins.post('/admin/ticket/send-response/', (req, res) => {
    let quering = `SELECT * FROM \`tickets\` WHERE id = '${req.body.id}'`
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
            let googled = `UPDATE \`tickets\` SET \`chats\`='${JSON.stringify(chats)}' WHERE id = '${req.body.id}'`
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



module.exports = ticketsRouterAdmins