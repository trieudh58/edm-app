var Joi = require('joi');

var validation = {};

validation.deleteNotifications = function (req, res, next) {
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

validation.getById = function (req, res, next) {
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

validation.markOneAsImportant = function (req, res, next) {
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

validation.markOneAsUnimportant = function (req, res, next) {
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

validation.markOneAsRead = function (req, res, next) {
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

validation.markOneAsUnread = function (req, res, next) {
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

module.exports = validation;