var mongoose = require('mongoose');
var config = require('../config');

/* Connect to mongodb */
var mongooseConnect = function () {
    mongoose.connect(config.mongodb.host, function () {
        console.log('Connected to mongodb.');
    });
};

var models = {};

models.User = require('./User');
models.PendingUser = require('./PendingUser');
models.Subject = require('./Subject');
models.StudentRecord = require('./StudentRecord');

models.dbConnect = mongooseConnect;
module.exports = models;