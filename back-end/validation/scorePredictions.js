var Joi = require('joi');

var validation = {};

validation.predictOneSubject = function predictOneSubject(req, res, next) {
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