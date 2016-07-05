var User = require('../models').User;
var jwt = require('jsonwebtoken');
var config = require('../config/index');

module.exports = function (req, res, next) {
    /* Get access token from request */
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
        res.status(403).json({
            success: false,
            message: 'No token provided.'
        });
    }
    else {
        jwt.verify(token, config.jwt.secret, function (err, decoded) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to authenticate.'
                });
            }
            else if (!decoded.user.isActive) {
                res.json({
                    success: false,
                    message: 'Authentication failed. The account is inactive.'
                });
            }
            else {
                req.user = decoded.user;
                next();
            }
        });
    }
};