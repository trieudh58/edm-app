var Joi = require('joi');

var validation = {};

validation.createPersonalTimeTable = function createPersonalTimeTable(req, res, next) {
    Joi.validate({
        classInfoList: req.body.classInfoList
    }, {
        classInfoList: Joi.string().required()
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