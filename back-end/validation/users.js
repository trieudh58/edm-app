var Joi = require('joi');

var authenticateSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});
module.exports = function (req, res, next) {
    Joi.validate({
        email: req.body.email,
        password: req.body.password
    }, authenticateSchema, function (err) {
        if (!err) {
            next();
        }
        else {
            return res.json({
                err: err
            });
        }
    });
};