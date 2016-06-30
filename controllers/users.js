var User = require('../models').User;
var jwt = require('jsonwebtoken');
var config = require('../config');
var bcrypt = require('bcrypt');

module.exports = {
    /* Authenticate user with email and password. Return a token if success */
    authenticate: function (req, res) {
        User.findOne({
            email: req.body.email
        }, function (err, user) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed.'
                });
            }
            else {
                bcrypt.compare(req.body.password, user.password, function (err, result) {
                    if (result) {
                        var token = jwt.sign({user: user}, config.jwt.secret, {expiresIn: config.jwt.expiresTime});
                        res.json({
                            success: true,
                            token: token
                        });
                    }
                    else {
                        res.json({
                            success: false,
                            message: 'Authentication failed.'
                        });
                    }
                });
            }
        })
    },
    
    /* Return user data */
    get: function (req, res) {
        res.json({
            success: true,
            data: {
                email: req.user.email,
                isActive: req.user.isActive,
                isAdmin: req.user.isAdmin
            }
        });
    },
    
    /* Create a user */
    create: function (req, res) {
        User.findOne({
            email: req.body.email
        }, function (err, user) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            if (user) {
                res.json({
                    success: false,
                    message: 'Email exists.'
                });
            }
            else {
                bcrypt.genSalt(config.bcrypt.saltRounds, function (err, salt) {
                    bcrypt.hash(req.body.password, salt, function (err, hash) {
                        if (!err) {
                            User.create({
                                email: req.body.email,
                                password: hash
                            }, function (err, user) {
                                if (err) {
                                    res.status(500).json({
                                        success: false,
                                        message: err
                                    });
                                }
                                res.json({
                                    success: true,
                                    data: user
                                });
                            });
                        }
                    });
                });
            }
        });
    }
};