var Joi = require('joi');

var schema = Joi.object().keys({
    subjectId: Joi.string().required(),
    expectedTime: Joi.string().required().valid('Morning', 'Afternoon', 'Evening'),
    reason: Joi.string().required()
});
module.exports = function (req, res, next) {
    Joi.validate({
        subjectId: req.body.subjectId,
        expectedTime: req.body.expectedTime,
        reason: req.body.reason
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