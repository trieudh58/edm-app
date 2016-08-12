var courseRequestValidation = {};

courseRequestValidation.create = require('./create');
courseRequestValidation.join = require('./join');
courseRequestValidation.undoJoin = require('./undoJoin');
courseRequestValidation.deleteOne = require('./deleteOne');
module.exports = courseRequestValidation;
