var Joi = require('joi');
var validation = {};

validation.updateSMTP = function (req, res, next) {
    Joi.validate({
        service: req.body.service,
        host: req.body.host,
        port: req.body.port,
        user: req.body.user,
        password: req.body.password,
        sender: req.body.sender
    }, {
        service: Joi.string(),
        host: Joi.string(),
        port: Joi.number(),
        user: Joi.string(),
        password: Joi.string().min(6),
        sender: Joi.string()
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