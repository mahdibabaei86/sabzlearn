let express = require('express');
let tokenRouter = express.Router();
const jwt = require('jsonwebtoken');
const secretKey = process.env.secretKeyJWT;
tokenRouter.get(`/token/isVriefy/:token/`, (req, res) => {
    const token = req.params.token;
    // Verify the token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            res.send('Failed to authenticate token');
        } else {
            res.send('Access Token');
        }
    });
});

module.exports = tokenRouter