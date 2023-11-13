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

mediaRouterAdmin.get(`/admin/media/search/:folder/:txt/`, (req, res) => {
    fs.readdir(`./uploads/${req.params.folder}`, (err, result) => {
        if (err) {
            console.log('Error Get All Media', err);
        } else {
            let resultSearch = result.filter(file => {
                const regex = new RegExp(req.params.txt, 'i');
                return regex.test(file);
            });
            res.json(resultSearch);
        }
    });
});

mediaRouterAdmin.get(`/admin/media/remove/:folders/:name/`, (req, res) => {
    fs.unlink(`./uploads/${req.params.folders}/${req.params.name}/`, (err) => {
        if (err) {
            console.log('Error Remvoe File', err);
        } else {
            res.send('successfully remove file');
        }
    });
});

module.exports = mediaRouterAdmin