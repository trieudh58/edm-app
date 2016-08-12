var notificationValidation = {};

notificationValidation.getById = require('./getById');
notificationValidation.markOneAsRead = require('./markOneAsRead');
notificationValidation.markOneAsUnread = require('./markOneAsUnread');
notificationValidation.markOneAsImportant = require('./markOneAsImportant');
notificationValidation.markOneAsUnimportant = require('./markOneAsUnimportant');
notificationValidation.delete = require('./delete');
module.exports = notificationValidation;
