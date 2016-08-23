var models = require('../models');
var jwt = require('jsonwebtoken');
var config = require('../config/index');

module.exports = function (req, res, next) {
    /* Get access token from request */
    if (!req.headers.authorization || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        return res.status(403).json({
            success: false,
            message: 'Invalid authorization.'
        });
    }
    else {
        var accessToken = req.headers.authorization.split(' ')[1];
        if (!accessToken) {
            return res.status(403).json({
                success: false,
                message: 'No token provided.'
            });
        }
        else {
            jwt.verify(accessToken, config.jwt.secret, function (err, decoded) {
                if (err || decoded.type !== 'accessToken') {
                    if (err.name === 'TokenExpiredError') {
                        return res.status(403).json({
                            success: false,
                            message: err.name
                        });
                    }
                    else {
                        return res.status(400).json({
                            success: false,
                            message: 'Failed to authenticate. Invalid token.'
                        });
                    }
                }
                else {
                    models.User.findById(decoded.userId, function (err, user) {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: err
                            });
                        }
                        else if (!user) {
                            return res.status(400).json({
                                success: false,
                                message: 'Failed to authenticate. Invalid user.'
                            });
                        }
                        else if (!user.isActive) {
                            return res.status(400).json({
                                success: false,
                                message: 'Failed to authenticate. The account is deactivated.'
                            });
                        }
                        else {
                            req.user = user;
                            req.accessToken = accessToken;
                            next();
                        }
                    });
                }
            });
        }
    }
};