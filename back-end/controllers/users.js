var User = require('../models').User;
var PendingUser = require('../models').PendingUser;
var BlackListToken = require('../models').BlackListToken;
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
        User.findById(req.user._id, '-updatedAt -createdAt -password -__v').populate('personalInfo.groups.group', 'name').exec(function (err, result) {
            res.json({
                data: result
            })
        });
        //res.json({
        //    success: true,
        //    data: {
        //        email: req.user.email,
        //        studentCode: req.user.studentCode,
        //        personalInfo: {
        //            gender: req.user.personalInfo.gender ? 'Male' : 'Female',
        //            DOB: req.user.personalInfo.DOB,
        //            className: req.user.personalInfo.className
        //        },
        //        isActive: req.user.isActive,
        //        isAdmin: req.user.isAdmin
        //    },
        //    user: req.user
        //});
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
        User.findOne({
            email: req.body.email
        }, function (err, user) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!user) {
                res.json({
                    success: false,
                    message: 'Unacceptable email.'
                });
            }
            else if (user && user.isActive) {
                res.json({
                    success: false,
                    message: 'Email exists or account by this email is activated.'
                });
            }
            else {
                var rememberToken = jwt.sign({ email: req.body.email, password: req.body.password }, config.jwt.secret);
                PendingUser.update({
                    email: req.body.email
                },{
                    password: bcrypt.hashSync(req.body.password, config.bcrypt.saltRounds),
                    rememberToken: rememberToken
                }, {
                    upsert: true
                }, function (err, result) {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            message: err
                        });
                    }
                    else if (result.ok) {
                        var transporter = nodemailer.createTransport({
                            service: config.mailer.service,
                            auth: {
                                user: config.mailer.user,
                                pass: config.mailer.pass
                            }
                        });

                        var receiver = req.body.email;
                        var activationLink = 'http://' + req.get('host') + '/api/v1/users/verify-email?email=' + req.body.email + '&token=' + rememberToken;
                        console.log(activationLink);
                        var mailOptions = {
                            from: config.mailer.sender,
                            to: receiver,
                            subject: 'Activate your account',
                            html: 'Dear ' + receiver + ',</br>Please activate your account here:' + activationLink
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
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/users/verify-email
     * operations:
     *   -  httpMethod: GET
     *      summary: Verify registered user with email and token provided
     *      notes: Redirect to login page if success
     *      nickname: Verify user
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: email
     *          description: Your email
     *          paramType: form
     *          required: true
     *          dataType: string
     *          format: email
     *        - name: token
     *          description: Your token
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Verify pending user then redirect */
    verifyEmail: function (req, res) {
        var email = req.query.email || req.body.email;
        var rememberToken = req.query.token || req.body.token;
        PendingUser.findOneAndRemove({
            email: email,
            rememberToken: rememberToken
        }, function (err, removedPendingUser) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!removedPendingUser) {
                res.json({
                    success: false,
                    message: 'Email does not exist or invalid token.'
                });
            }
            else {
                User.update({
                    email: removedPendingUser.email
                }, {
                    password: removedPendingUser.password,
                    isActive: true
                }, function (err, result) {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            message: err
                        });
                    }
                    else if (result.ok) {
                        res.redirect('http://google.com');
                    }
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/users/logout
     * operations:
     *   -  httpMethod: POST
     *      summary: User logs out (move current token to blacklist)
     *      notes: Require access token
     *      nickname: Log out
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* User logs out. Return result message */
    logOut: function (req, res) {
        BlackListToken.create({
            token: req.validToken
        }, function (err, bannedToken) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            res.json({
                success: true,
                message: 'Token banned.'
            });
        });
    }
};