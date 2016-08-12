var userValidation = {};

userValidation.authenticate = require('./authenticate');
userValidation.register = require('./register');
userValidation.verifyEmail = require('./verifyEmail');
module.exports = userValidation;
