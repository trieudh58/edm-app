var Joi = require('joi');

var validation = {};

validation.create = function (req, res, next) {
    Joi.validate({
        subjectId: req.body.subjectId,
        expectedTime: req.body.expectedTime,
        reason: req.body.reason
    }, {
        subjectId: Joi.string().required(),
        expectedTime: Joi.string().required().valid('Morning', 'Afternoon', 'Evening'),
        reason: Joi.string().required()
    }, function (err) {
        if (err) {
            return res.json({
                success: false,
                message: err.details[0].message
            });
        }
        next();
    });
};

validation.deleteOne = function (req, res, next) {
    Joi.validate({
        courseRequestId: req.query.courseRequestId
    }, {
        courseRequestId: Joi.string().required()
    }, function (err) {
        if (err) {
            return res.json({
                success: false,
                message: err.details[0].message
            });
        }
        next();
    });
};

validation.join = function (req, res, next) {
    Joi.validate({
        courseRequestId: req.body.courseRequestId
    }, {
        courseRequestId: Joi.string().required()
    }, function (err) {
        if (err) {
            return res.json({
                success: false,
                message: err.details[0].message
            });
        }
        next();
    });
};

validation.undoJoin = function (req, res, next) {
    Joi.validate({
        courseRequestId: req.body.courseRequestId
    }, {
        courseRequestId: Joi.string().required()
    }, function (err) {
        if (err) {
            return res.json({
                success: false,
                message: err.details[0].message
            });
        }
        next();
    });
};

module.exports = validation;