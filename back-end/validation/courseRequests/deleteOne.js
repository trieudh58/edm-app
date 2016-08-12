var Joi = require('joi');

var schema = Joi.object().keys({
    courseRequestId: Joi.string().required()
});
module.exports = function (req, res, next) {
    Joi.validate({
        courseRequestId: req.query.courseRequestId
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