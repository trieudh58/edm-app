var Joi = require('joi');

var schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});
module.exports = function (req, res, next) {
    Joi.validate({
        email: req.body.email,
        password: req.body.password
    }, schema, function (err) {
        if (err) {
            return res.json({
                success: false,
                message: err.details[0].message
            });
        }
        next();
    });
};