var Joi = require('joi');

var validation = {};

validation.getEPDetailByCode = function (req, res, next) {
    Joi.validate({
        epCode: req.query.epCode
    }, {
        epCode: Joi.number().integer().required().min(1).max(6)
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