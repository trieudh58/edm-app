var Joi = require('joi');
var validation = {};

validation.publicOne = function (req, res, next) {
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

validation.addToPending = function (req, res, next) {
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

validation.denyOne = function (req, res, next) {
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