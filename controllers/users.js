var User = require('../models').User;
var jwt = require('jsonwebtoken');
var config = require('../config');

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
                if (user.password != req.body.password) {
                    res.json({
                        success: false,
                        message: 'Authentication failed.'
                    });
                }
                else {
                    var token = jwt.sign({user: user}, config.jwt.secret, {expiresIn: config.jwt.expiresTime});
                    res.json({
                        success: true,
                        token: token
                    })
                }
            }
        })
    },
    
    /* Return user data */
    get: function (req, res) {
            res.json({
                success: true,
                data: req.user
            });
    },
    
    /* Create a user */
    create: function (req, res) {
        User.create({
            email: req.body.email,
            password: req.body.password,
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
};