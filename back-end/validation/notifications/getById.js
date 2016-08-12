var Joi = require('joi');

var schema = Joi.object().keys({
    notificationId: Joi.string().required()
});
module.exports = function (req, res, next) {
    Joi.validate({
        notificationId: req.query.notificationId
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