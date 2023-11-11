let express = require('express');
let authRouters = express.Router();
let nodemailer = require('nodemailer');
let sessions = require('express-session');
const crypto = require('crypto');
let otpGenerator = require('otp-generator')

authRouters.use(sessions({
    name: 'sabzlearn',
    secret: 'password',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1200000, httpOnly: true }
}));

authRouters.get('/auth/otp/created/:email/', (req, res) => {
    let OTP = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false });
    let transportMail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSEMAIL
        }
    });

    let optionsMail = {
        from: process.env.EMAIL,
        to: req.params.email,
        subject: 'Code OTP',
        html: `<h1>Code OTP: ${OTP}</h1>`
    }

    transportMail.sendMail(optionsMail, (err) => {
        if (err) {
            console.log('Error Send Email');
        } else {
            // req.session.OTPCode = OTP
            // res.sendStatus(200);
            let newCookie = {
                otp: crypto.createHash('md5').update(OTP).digest('hex'),
            }
            res.json(newCookie);
            console.log('SuccessFully Send Email');
        }
    });

});

authRouters.get('/auth/otp/vreify/:otp/', (req, res) => {
    res.json(crypto.createHash('md5').update(req.params.otp).digest('hex'));
    // if (req.session['OTPCode'] == req.params.otp) {
    //     res.send('Success OTP');
    // } else {
    //     res.send('Invalid OTP Code');
    // }
});

// authRouters.get('/auth/otp/info/', (req, res) => {
//     res.json((req.session));
// });

module.exports = authRouters