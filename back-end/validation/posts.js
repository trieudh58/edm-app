var Joi = require('joi');

var validation = {};

validation.getOneById = function getOneById(req, res, next) {
    Joi.validate({
        postId: req.query.postId
    }, {
        postId: Joi.string().required()
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