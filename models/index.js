var mongoose = require('mongoose');
var UserSchema = require('./User');
var config = require('../config');

var connection = mongoose.createConnection(config.mongodb.host);

var models = {};
var User = connection.model('User', UserSchema);

models.User = User;

module.exports = models;