var Joi = require('joi');
var validation = {};

validation.create = function (req, res, next) {
    Joi.validate({
        groupName: req.body.groupName
    }, {
        groupName: Joi.string().required()
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

validation.deleteById = function (req, res, next) {
    Joi.validate({
        groupId: req.query.groupId
    }, {
        groupId: Joi.string().required()
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

validation.deleteByName = function (req, res, next) {
    Joi.validate({
        groupName: req.query.groupName
    }, {
        groupName: Joi.string().required()
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