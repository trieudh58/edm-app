var Joi = require('joi');

var validation = {};

validation.getByLecturer = function (req, res, next) {
    Joi.validate({
        lecturer: req.query.lecturer
    }, {
        lecturer: Joi.string().required()
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