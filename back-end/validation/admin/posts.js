var Joi = require('joi');
var validation = {};

validation.create = function (req, res, next) {
    Joi.validate({
        header: req.body.header,
        body: req.body.body
    }, {
        header: Joi.string().required(),
        body: Joi.string().required().min(20)
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

validation.createAndPublish = function (req, res, next) {
    Joi.validate({
        header: req.body.header,
        body: req.body.body
    }, {
        header: Joi.string().required(),
        body: Joi.string().required().min(20)
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

validation.updatePostHeader = function (req, res, next) {
    Joi.validate({
        postId: req.body.postId,
        newHeader: req.body.newHeader
    }, {
        postId: Joi.string().required(),
        newHeader: Joi.string().required()
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

validation.updatePostBody = function (req, res, next) {
    Joi.validate({
        postId: req.body.postId,
        newBody: req.body.newBody
    }, {
        postId: Joi.string().required(),
        newBody: Joi.string().required().min(20)
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

validation.publishOne = function (req, res, next) {
    Joi.validate({
        postId: req.body.postId
    }, {
        postId: Joi.string().required()
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

validation.unpublishOne = function (req, res, next) {
    Joi.validate({
        postId: req.body.postId
    }, {
        postId: Joi.string().required()
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

validation.delete = function (req, res, next) {
    Joi.validate({
        postId: req.body.postId
    }, {
        postId: Joi.string().required()
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