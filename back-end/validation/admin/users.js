var Joi = require('joi');

var validation = {};

validation.create = function (req, res, next) {
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

validation.activateUser = function (req, res, next) {
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

validation.deactivateUser = function (req, res, next) {
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

validation.delete = function (req, res, next) {
    Joi.validate({
        email: req.query.email
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

validation.updateName = function (req, res, next) {
    Joi.validate({
        userId: req.body.userId,
        newName: req.body.newName
    }, {
        userId: Joi.string().required(),
        newName: Joi.string().required()
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

validation.findAccount = function (req, res, next) {
    Joi.validate({
        query: req.query.query
    }, {
        query: Joi.string().required()
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