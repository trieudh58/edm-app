var models = require('../models');
var jwt = require('jsonwebtoken');
var config = require('../config/index');

module.exports = function (req, res, next) {
    /* Get access token from request */
    var accessToken = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!accessToken) {
        return res.status(403).json({
            success: false,
            message: 'No token provided.'
        });
    }
    else {
        jwt.verify(accessToken, config.jwt.secret, function (err, decoded) {
            if (err || decoded.type !== 'accessToken') {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate. Invalid token.'
                });
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
                        return res.json({
                            success: false,
                            message: 'Failed to authenticate. Invalid user.'
                        });
                    }
                    else if (!user.isActive) {
                        return res.json({
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
};