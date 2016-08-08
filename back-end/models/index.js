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
models.BlackListToken = require('./BlackListToken');
models.KnowledgeUnit = require('./KnowledgeUnit');
models.EducationProgram = require('./EducationProgram');
models.EPDetail = require('./EPDetail');
models.Notification = require('./Notification');
models.StudentGroup = require('./StudentGroup');
models.CourseRequest = require('./CourseRequest');

models.dbConnect = mongooseConnect;
module.exports = models;