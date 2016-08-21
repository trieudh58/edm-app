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
                return res.json({
                    success: false,
                    message: 'Failed to authenticate.'
                });
            }
            else if (!user.isActive) {
                return res.json({
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
                        return res.json({
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
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return user data */
    get: function (req, res) {
        models.User.findById(req.user._id, '-updatedAt -createdAt -password -notificationStack').populate('personalInfo.groups.group', 'name').exec(function (err, result) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!result) {
                return res.json({
                    success: false,
                    message: 'User does not exist.'
                });
            }
            return res.json({
                success: true,
                data: result
            })
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
                models.PendingUser.update({
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
     *          description: Your token
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
                models.User.update({
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
                        res.json({
                            success: true,
                            message: 'Account activated.'
                        });
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
        models.BlackListToken.create({
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