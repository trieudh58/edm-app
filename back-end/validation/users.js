var Joi = require('joi');

var validation = {};

validation.authenticate = function (req, res, next) {
    Joi.validate({
        email: req.body.email,
        password: req.body.password
    }, {
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
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

validation.register = function (req, res, next) {
    Joi.validate({
        email: req.body.email,
        password: req.body.password
    }, {
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
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

validation.verifyEmail = function (req, res, next) {
    Joi.validate({
        email: req.body.email,
        token: req.body.token
    }, {
        email: Joi.string().email().required(),
        token: Joi.string().required()
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