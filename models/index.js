var mongoose = require('mongoose');
var User = require('./User');
var config = require('../config');

mongoose.createConnection(config.mongodb.host);

var models = {};

models.User = User;

module.exports = models;