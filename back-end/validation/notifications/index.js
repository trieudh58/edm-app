var notificationValidation = {};

notificationValidation.getById = require('./getById');
notificationValidation.markOneAsRead = require('./markOneAsRead');
notificationValidation.markOneAsUnread = require('./markOneAsUnread');
notificationValidation.markOneAsImportant = require('./markOneAsImportant');
module.exports = notificationValidation;
