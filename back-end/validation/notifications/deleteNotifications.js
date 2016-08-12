var Joi = require('joi');

var schema = Joi.object().keys({
    notificationIds: Joi.string().required()
});
module.exports = function (req, res, next) {
    Joi.validate({
        notificationIds: req.query.notificationIds
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