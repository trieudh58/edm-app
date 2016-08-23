var Joi = require('joi');
var validation = {};

validation.createNew = function (req, res, next) {
    Joi.validate({
        title: req.body.title,
        body: req.body.body,
        targetGroupIds: req.body.targetGroupIds
    }, {
        title: Joi.string().required(),
        body: Joi.string().required(),
        targetGroupIds: Joi.string().required()
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

validation.sendCreated = function (req, res, next) {
    Joi.validate({
        notificationId: req.body.notificationId
    }, {
        notificationId: Joi.string().required()
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

validation.createAndSend = function (req, res, next) {
    Joi.validate({
        title: req.body.title,
        body: req.body.body,
        targetGroupIds: req.body.targetGroupIds
    }, {
        title: Joi.string().required(),
        body: Joi.string().required(),
        targetGroupIds: Joi.string().required()
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

validation.getOneById = function (req, res, next) {
    Joi.validate({
        notificationId: req.query.notificationId
    }, {
        notificationId: Joi.string().required()
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

validation.deleteOneById = function (req, res, next) {
    Joi.validate({
        notificationId: req.body.notificationId
    }, {
        notificationId: Joi.string().required()
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

validation.deleteByIds = function (req, res, next) {
    Joi.validate({
        notificationIds: req.body.notificationIds
    }, {
        notificationIds: Joi.string().required()
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