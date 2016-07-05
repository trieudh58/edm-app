var User = require('../models').User;
var jwt = require('jsonwebtoken');
var config = require('../config');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/users
     * description: Users apis
     */

    /**
     * @swagger
     * path: /api/v1/users/authenticate
     * operations:
     *   -  httpMethod: POST
     *      summary: Authenticate (Sign in) with email and password
     *      notes: Return access token
     *      nickname: Authenticate
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: email
     *          description: Your email
     *          paramType: form
     *          required: true
     *          dataType: string
     *          format: email
     *        - name: password
     *          description: Your password
     *          paramType: form
     *          required: true
     *          dataType: string
     *          format: password
     */
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
            else if (!user.isActive) {
                res.json({
                    success: false,
                    message: 'Authentication failed. The account is inactive.'
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

    /**
     * @swagger
     * path: /api/v1/users/get
     * operations:
     *   -  httpMethod: GET
     *      summary: Get user data
     *      notes: Require access token
     *      nickname: Get user data
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     */
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

    /**
     * @swagger
     * path: /api/v1/users/create
     * operations:
     *   -  httpMethod: POST
     *      summary: Create user (Sign up) with email and password
     *      notes: Return created user if success
     *      nickname: Create user
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: email
     *          description: Your email
     *          paramType: form
     *          required: true
     *          dataType: string
     *          format: email
     *        - name: password
     *          description: Your password
     *          paramType: form
     *          required: true
     *          dataType: string
     *          format: password
     */
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
    },

    /**
     * @swagger
     * path: /api/v1/users/delete
     * operations:
     *   -  httpMethod: DELETE
     *      summary: Delete a user (using email)
     *      notes: Return result
     *      nickname: Delete user
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: email
     *          description: Your email
     *          paramType: form
     *          required: true
     *          dataType: string
     *          format: email
     */
    /* Delete a user. Admin permission required */
    delete: function (req, res) {
        User.findOneAndRemove({
            email: req.body.email
        }, function (err, removedUser) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!removedUser) {
                res.json({
                    success: false,
                    message: 'Email does not exist.'
                });
            }
            else {
                res.json({
                    success: true,
                    message: 'User is deleted.'
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/users/register
     * operations:
     *   -  httpMethod: POST
     *      summary: User register account with email and password
     *      notes: Send a verify email to registered mail if success
     *      nickname: Register user
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: email
     *          description: Your email
     *          paramType: form
     *          required: true
     *          dataType: string
     *          format: email
     *        - name: password
     *          description: Your password
     *          paramType: form
     *          required: true
     *          dataType: string
     *          format: password
     */
    /* Register a new account */
    register: function (req, res) {
        var transporter = nodemailer.createTransport({
            service: config.mailer.service,
            auth: {
                user: config.mailer.user,
                pass: config.mailer.pass
            }
        });

        // Hard-code for testing first
        var receiver = 'dangtrieu25@gmail.com';
        // In production
        //var receiver = req.body.email;

        var mailOptions = {
            from: config.mailer.sender,
            to: receiver,
            subject: 'Activate your account',
            text: 'Dear ' + req.body.email + '. This is just a test email :)'
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                res.status(500).json({
                    success: false,
                    err: err
                });
            }
            else {
                res.json({
                    success: true,
                    message: 'Activation link sent.'
                });
            }
        });
    }
};