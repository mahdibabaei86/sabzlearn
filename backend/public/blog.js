let express = require('express');
let mysql = require('mysql');
const cryptoModule = require('crypto');
const otpGeneratorss = require('otp-generator');
let path = require('path');
let blogRouterPublic = express.Router();

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


blogRouterPublic.get('/public/blog/all-comments/:id/', (req, res) => {
    let quering = `SELECT \`Comments\` FROM \`blog\` WHERE id = '${req.params.id}'`;
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.json(result);
        }
    });
});

blogRouterPublic.get(`/public/blog/view-article/:id/`, (req, res) => {
    let quering = `SELECT * FROM \`blog\` WHERE id = '${req.params.id}'`;
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.json(result);
        }
    });
})

blogRouterPublic.get('/public/blog/all/', (req, res) => {
    let quering = `SELECT * FROM \`blog\``;
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            res.json(result);
        }
    });
});

blogRouterPublic.get('/public/blog/search/:name/', (req, res) => {
    let quering = `SELECT * FROM \`blog\``;
    database.query(quering, (err, result) => {
        if (err) {
            console.log('Error');
        } else {
            let resultSearch = result.filter(course => {
                const regex = new RegExp(req.params.name, 'i');
                return regex.test(course.title);
            });
            res.json(resultSearch);
        }
    })
});

module.exports = blogRouterPublic