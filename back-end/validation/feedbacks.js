var Joi = require('joi');

var validation = {};

validation.createFeedback = function createFeedback(req, res, next) {
    Joi.validate({
        header: req.body.header,
        body: req.body.body
    }, {
        header: Joi.string().required(),
        body: Joi.string().required().min(20)
    }, function (err) {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.details[0].message
            });
        }
        next();
    });
};

module.exports = validation;