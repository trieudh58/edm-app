var Joi = require('joi');
var validation = {};

validation.getInfo = function (req, res, next) {
    Joi.validate({
        subjectCode: req.query.subjectCode
    }, {
        subjectCode: Joi.string().required()
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

validation.createSubject = function (req, res, next) {
    Joi.validate({
        subjectCode: req.body.subjectCode,
        subjectName: req.body.subjectName,
        subjectCredits: req.body.subjectCredits,
        subjectPrerequisites: req.body.subjectPrerequisites
    }, {
        subjectCode: Joi.string().required(),
        subjectName: Joi.string().required(),
        subjectCredits: Joi.number().integer().required(),
        subjectPrerequisites: Joi.string()
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
        subjectCode: req.query.subjectCode
    }, {
        subjectCode: Joi.string().required()
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