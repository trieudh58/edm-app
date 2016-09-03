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
        email: req.body.email
    }, {
        email: Joi.string().email().required()
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

validation.changePassoword = function (req, res, next) {
    Joi.validate({
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword
    }, {
        oldPassword: Joi.string().min(6).required(),
        newPassword: Joi.string().min(6).required()
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