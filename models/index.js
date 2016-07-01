var mongoose = require('mongoose');
var config = require('../config');

mongoose.createConnection(config.mongodb.host);

var models = {};

models.User = require('./User');
models.Subject = require('./Subject');
models.StudentRecord = require('./StudentRecord');

module.exports = models;