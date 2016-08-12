var Joi = require('joi');

var schema = Joi.object().keys({
    email: Joi.string().email().required(),
    token: Joi.string().required()
});
module.exports = function (req, res, next) {
    Joi.validate({
        email: req.body.email,
        token: req.body.token
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