var models = require('../models');
var jwt = require('jsonwebtoken');
var config = require('../config');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var uuid = require('node-uuid');

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
        models.User.findOne({
            email: req.body.email
        }, 'email password isActive', function (err, user) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Failed to authenticate.'
                });
            }
            else if (!user.isActive) {
                return res.status(400).json({
                    success: false,
                    message: 'Failed to authenticate. The account is deactivated.'
                });
            }
            else {
                bcrypt.compare(req.body.password, user.password, function (err, isMatch) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err
                        });
                    }
                    else if (!isMatch) {
                        return res.status(400).json({
                            success: false,
                            message: 'Failed to authenticate.'
                        });
                    }
                    else {
                        var refreshTokenId = uuid.v4();
                        jwt.sign({
                            tokenId: refreshTokenId,
                            type: 'refreshToken'
                        }, config.jwt.secret, {
                            expiresIn: config.jwt.expiresTime.refreshToken
                        }, function (err, refreshToken) {
                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });
                            }
                            else {
                                jwt.sign({
                                    userId: user._id,
                                    type: 'accessToken'
                                }, config.jwt.secret, {
                                    expiresIn: config.jwt.expiresTime.accessToken
                                }, function (err, accessToken) {
                                    if (err) {
                                        return res.status(500).json({
                                            success: false,
                                            message: err
                                        });
                                    }
                                    else {
                                        models.UserToken.findOne({
                                            userId: user._id
                                        }, function (err, userToken) {
                                            if (err) {
                                                return res.status(500).json({
                                                    success: false,
                                                    message: err
                                                });
                                            }
                                            else if (!userToken) {
                                                models.UserToken.create({
                                                    userId: user._id,
                                                    tokens: [{ tokenId: refreshTokenId}]
                                                }, function (err) {
                                                    if (err) {
                                                        return res.status(500).json({
                                                            success: false,
                                                            message: err
                                                        });
                                                    }
                                                });
                                            }
                                            else {
                                                userToken.update({
                                                    $push: {
                                                        tokens: {
                                                            tokenId: refreshTokenId
                                                        }
                                                    }
                                                }, function (err) {
                                                    if (err) {
                                                        return res.status(500).json({
                                                            success: false,
                                                            message: err
                                                        });
                                                    }
                                                });
                                            }
                                            return res.json({
                                                success: true,
                                                accessToken: accessToken,
                                                refreshToken: refreshToken
                                            });
                                        });
                                    }
                                });
                            }
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
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return user data */
    get: function (req, res) {
        return res.json({
            success: true,
            data: {
                email: req.user.email,
                studentCode: req.user.studentCode,
                personalInfo: req.user.personalInfo,
                isAdmin: req.user.isAdmin,
                isActive: req.user.isActive
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
        models.User.findOne({
            email: req.body.email
        }, function (err, user) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email.'
                });
            }
            else if (user && user.isActive) {
                return res.status(400).json({
                    success: false,
                    message: 'Email exists or account is activated.'
                });
            }
            else {
                var rememberToken = jwt.sign({ email: req.body.email, password: req.body.password }, config.jwt.secret);
                models.PendingUser.update({
                    email: req.body.email
                },{
                    password: bcrypt.hashSync(req.body.password, config.bcrypt.saltRounds),
                    rememberToken: rememberToken
                }, {
                    upsert: true
                }, function (err, result) {
                    if (err) {
                        return res.status(500).json({
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
                        var frontEndFullURL = config.frontEnd.url + ':' + config.frontEnd.port;
                        var activationLink = frontEndFullURL + '/home/#/verify/?email=' + receiver + '&token=' + rememberToken;
                        console.log(activationLink);
                        var mailOptions = {
                            from: config.mailer.sender,
                            to: receiver,
                            subject: 'Activate your account',
                            html: 'Dear ' + receiver + ',</br>Please activate your account here:' + activationLink
                        };
                        transporter.sendMail(mailOptions, function (err, info) {
                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    err: err
                                });
                            }
                            else {
                                return res.json({
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
     *   -  httpMethod: PUT
     *      summary: Verify registered user with email and token provided
     *      notes: Return result
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
     *          description: Remember token
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Verify pending user */
    verifyEmail: function (req, res) {
        models.PendingUser.findOneAndRemove({
            email: req.body.email,
            rememberToken: req.body.token
        }, function (err, removedPendingUser) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!removedPendingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email does not exist or invalid token.'
                });
            }
            else {
                models.User.update({
                    email: removedPendingUser.email
                }, {
                    password: removedPendingUser.password,
                    isActive: true
                }, function (err, result) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err
                        });
                    }
                    return res.json({
                        success: true,
                        message: 'Account activated.'
                    });
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/users/logout
     * operations:
     *   -  httpMethod: POST
     *      summary: User logs out (move refresh token to blacklist)
     *      notes: Require refresh token
     *      nickname: Log out
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [refreshToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* User logs out. Return result message */
    logOut: function (req, res) {

    }
};