var courseRequestValidation = {};

courseRequestValidation.create = require('./create');
courseRequestValidation.join = require('./join');
courseRequestValidation.undoJoin = require('./undoJoin');
module.exports = courseRequestValidation;
