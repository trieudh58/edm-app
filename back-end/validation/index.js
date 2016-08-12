var validation = {};

validation.users = require('./users');
validation.subjects = require('./subjects');
validation.studentRecords = require('./studentRecords');
validation.notifications = require('./notifications');
validation.courseRequests = require('./courseRequests');

module.exports = validation;