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
                            userId: user._id,
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
                            host: config.mailer.host,
                            port: config.mailer.port,
                            auth: {
                                user: config.mailer.auth.user,
                                pass: config.mailer.auth.pass
                            }
                        });

                        var receiver = req.body.email;
                        var frontEndFullURL = config.frontEnd.url;
                        var activationLink = frontEndFullURL + '/access?action=verify&email=' + receiver + '&token=' + rememberToken;
                        var mailOptions = {
                            from: config.mailer.auth.sender,
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
     * path: /api/v1/users/change-password
     * operations:
     *   -  httpMethod: PUT
     *      summary: Change password
     *      notes: Change password (require old + new password )
     *      nickname: Change password
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: oldPassword
     *          description: Your old password
     *          paramType: form
     *          required: true
     *          dataType: string
     *          format: password
     *        - name: newPassword
     *          description: Your new password
     *          paramType: form
     *          required: true
     *          dataType: string
     *          format: password
     */
    /* Change password */
    changePassword: function (req, res) {
        if (req.body.oldPassword === req.body.newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Two input passwords are the same.'
            });
        }
        else {
            bcrypt.compare(req.body.oldPassword, req.user.password, function (err, isMatch) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    });
                }
                else if (!isMatch) {
                    return res.status(400).json({
                        success: false,
                        message: 'Wrong password.'
                    });
                }
                else {
                    models.User.findById(req.user._id, function (err, user) {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: err
                            });
                        }
                        else if (!user) {
                            return res.status(400).json({
                                success: false,
                                message: 'User not found.'
                            });
                        }
                        else {
                            user.update({
                                password: bcrypt.hashSync(req.body.newPassword, config.bcrypt.saltRounds)
                            }, function (err) {
                                if (err) {
                                    return res.status(500).json({
                                        success: false,
                                        message: err
                                    });
                                }
                                else {
                                    return res.json({
                                        success: true,
                                        message: 'Password changed.'
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    },

    /**
     * @swagger
     * path: /api/v1/users/update-interests
     * operations:
     *   -  httpMethod: PUT
     *      summary: Update interests
     *      notes: Each interest must be separated by a comma
     *      nickname: Update interests
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: interests
     *          description: Your new interests
     *          paramType: form
     *          required: false
     *          dataType: string
     */
    /* Update interests */
    updateInterests: function updateInterests (req, res) {
        // if 'undefined' -> assign to ''
        req.body.interests = req.body.interests || '';
        // if '' -> assign to []
        let newInterests = req.body.interests ? req.body.interests.split(',') : [];
        // trim all spaces in each interest string
        newInterests.forEach(function (interest, idx) {
            newInterests[idx] = newInterests[idx].trim();
        });
        // Update to DB
        models.User.update({
            _id: req.user._id
        }, {
            $set: {
                'personalInfo.interests': newInterests
            }
        }, function (err) {
            if (err) {
                res.status(400).json({
                    success: false,
                    message: err
                });
            } else {
                res.json({
                    success: true,
                    message: 'Interests updated.'
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/users/update-skills
     * operations:
     *   -  httpMethod: PUT
     *      summary: Update skills
     *      notes: Each interest must be separated by a comma
     *      nickname: Update skills
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: skills
     *          description: Your new skills
     *          paramType: form
     *          required: false
     *          dataType: string
     */
    /* Update skills */
    updateSkills: function updateSkills (req, res) {
        // if 'undefined' -> assign to ''
        req.body.skills = req.body.skills || '';
        // if '' -> assign to []
        let newSkills = req.body.skills ? req.body.skills.split(',') : [];
        // trim all spaces in each skill string
        newSkills.forEach(function (skill, idx) {
            newSkills[idx] = newSkills[idx].trim();
        });
        // Update to DB
        models.User.update({
            _id: req.user._id
        }, {
            $set: {
                'personalInfo.skills': newSkills
            }
        }, function (err) {
            if (err) {
                res.status(400).json({
                    success: false,
                    message: err
                });
            } else {
                res.json({
                    success: true,
                    message: 'Skills updated.'
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/users/upload-avatar
     * operations:
     *   -  httpMethod: POST
     *      summary: Upload avatar of a user
     *      notes: Return message
     *      nickname: Upload avatar
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: avatar
     *          description: Your profile picture
     *          paramType: formData
     *          required: true
     *          dataType: file
     */
    /* Upload avatar of a user. Return a message when successful */
    uploadAvatar: function (req, res) {
        if (req.file) {
            models.User.update({
                _id: req.user._id
            }, {
                'personalInfo.profilePicture': config.app.url + ':' + config.app.port + '/images/' + req.file.filename
            }, function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: true,
                        message: err
                    });
                }
                else {
                    return res.json({
                        success: true,
                        message: 'Avatar uploaded.'
                    });
                }
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'Invalid file type or file size'
            });
        }
    }
};
