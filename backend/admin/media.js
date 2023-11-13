let express = require('express');
let fs = require('fs');
let mediaRouterAdmin = express.Router();

mediaRouterAdmin.get(`/admin/media/:folder/`, (req, res) => {
    fs.readdir(`./uploads/${req.params.folder}`, (err, result) => {
        if (err) {
            console.log('Error Get All Media', err);
        } else {
            res.json(result);
        }
    });
});

module.exports = mediaRouterAdmin