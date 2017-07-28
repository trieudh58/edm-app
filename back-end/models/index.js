var mongoose = require('mongoose');
var config = require('../config');
var fs = require('fs');

/* Connect to mongodb */
var mongooseConnect = function () {
    mongoose.createConnection(config.mongodb.host, function () {
        console.log('Connected to mongodb.');
    });
};

var models = {};

fs.readdir(__dirname, function (err, files) {
    for (var i = 0; i < files.length; i++) {
        if (files[i] != 'index.js') {
            models[files[i].split('.')[0]] = require('./' + files[i]);
        }
    }
});

models.dbConnect = mongooseConnect;
module.exports = models;