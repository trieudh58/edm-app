var models = require('../../models');
var config = require('../../config');
var bcrypt = require('bcrypt');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/admin/users
     * description: Users apis (for admin)
     */

    /**
     * @swagger
     * path: /api/v1/admin/users/create
     * operations:
     *   -  httpMethod: POST
     *      summary: Create user (Sign up) with email and password
     *      notes: Return created user if success
     *      nickname: Create user
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
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
        models.User.findOne({
            email: req.body.email
        }, function (err, user) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            if (user) {
                return res.status(400).json({
                    success: false,
                    message: 'Email exists.'
                });
            }
            else {
                bcrypt.genSalt(config.bcrypt.saltRounds, function (err, salt) {
                    bcrypt.hash(req.body.password, salt, function (err, hash) {
                        if (!err) {
                            models.User.create({
                                email: req.body.email,
                                password: hash
                            }, function (err, user) {
                                if (err) {
                                    return res.status(500).json({
                                        success: false,
                                        message: err
                                    });
                                }
                                else {
                                    return res.json({
                                        success: true,
                                        data: user
                                    });
                                }
                            });
                        }
                    });
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/users/activate-user
     * operations:
     *   -  httpMethod: PUT
     *      summary: Activate a user by email
     *      notes: Return result
     *      nickname: Activate user
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: email
     *          description: User email
     *          paramType: form
     *          required: true
     *          dataType: string
     *          format: email
     */
    /* Activate a user */
    activateUser: function (req, res) {
        models.User.findOne({
            email: req.body.email,
            isAdmin: false
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
                    message: 'Email does not exist.'
                });
            }
            else if (user.isActive) {
                return res.status(202).json({
                    success: false,
                    message: 'Email is already activated.'
                });
            }
            else {
                user.update({
                    isActive: true
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
                            message: 'Account activated.'
                        });
                    }
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/users/deactivate-user
     * operations:
     *   -  httpMethod: PUT
     *      summary: Deactivate a user by email
     *      notes: Return result
     *      nickname: Deactivate user
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: email
     *          description: User email
     *          paramType: form
     *          required: true
     *          dataType: string
     *          format: email
     */
    /* Deactivate a user */
    deactivateUser: function (req, res) {
        models.User.findOne({
            email: req.body.email,
            isAdmin: false
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
                    message: 'Email does not exist.'
                });
            }
            else if (!user.isActive) {
                return res.status(202).json({
                    success: false,
                    message: 'Email is already deactivated.'
                });
            }
            else {
                user.update({
                    isActive: false
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
                            message: 'Account deactivated.'
                        });
                    }
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/users/delete
     * operations:
     *   -  httpMethod: DELETE
     *      summary: Delete a user (using email)
     *      notes: Return result
     *      nickname: Delete user
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
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
        models.User.findOneAndRemove({
            email: req.body.email
        }, function (err, removedUser) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!removedUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email does not exist.'
                });
            }
            else {
                return res.json({
                    success: true,
                    message: 'User is deleted.'
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/users/update-name
     * operations:
     *   -  httpMethod: PUT
     *      summary: Update name of a user
     *      notes: Return result
     *      nickname: Update name
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: userId
     *          description: User id (that need to be updated)
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: newName
     *          description: New name
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Update name of a user */
    updateName: function (req, res) {
        models.User.findById(req.body.userId, function (err, user) {
            if (err)
                return handleInternalDBError(err, res);
            if (!user)
                return handleUserErrorWithCustomMessage(res, 'Invalid user id');
            if (user.personalInfo.fullName === req.body.newName)
                return handleUserErrorWithCustomMessage(res, 'New name are the same as old name');
            return user.update({
                'personalInfo.fullName': req.body.newName
            }, function (err, result) {
                if (err)
                    return handleInternalDBError(err, res);
                return res.json({
                    success: true,
                    message: 'New name updated'
                });
            });
        })
    },

    /**
     * @swagger
     * path: /api/v1/admin/users/find-by-student-code
     * operations:
     *   -  httpMethod: GET
     *      summary: Find a user by student code
     *      notes: Return user information
     *      nickname: Find by student code
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: studentCode
     *          description: Student code
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    /* Find a user by student code */
    findByStudentCode: function (req, res) {
        models.User.find({
            studentCode: req.query.studentCode
        }, '-password -notificationStack', function (err, users) {
            if (err)
                return handleInternalDBError(err, res);
            return res.json({
                success: true,
                data: users
            });
        })
    },

    /**
     * @swagger
     * path: /api/v1/admin/users/find-by-name
     * operations:
     *   -  httpMethod: GET
     *      summary: Find a user by name
     *      notes: Return user information
     *      nickname: Find by name
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: name
     *          description: User name
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    /* Find a user by name */
    findByName: function (req, res) {
        models.User.find({
            'personalInfo.fullName': req.query.name
        }, '-password -notificationStack', function (err, users) {
            if (err)
                return handleInternalDBError(err, res);
            return res.json({
                success: true,
                data: users
            });
        })
    },

    /**
     * @swagger
     * path: /api/v1/admin/users/find-by-email
     * operations:
     *   -  httpMethod: GET
     *      summary: Find a user by email
     *      notes: Return user information
     *      nickname: Find by email
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: email
     *          description: User email
     *          paramType: query
     *          required: true
     *          dataType: string
     *          format: email
     */
    /* Find a user by email */
    findByEmail: function (req, res) {
        models.User.find({
            email: req.query.email
        }, '-password -notificationStack', function (err, users) {
            if (err)
                return handleInternalDBError(err, res);
            return res.json({
                success: true,
                data: users
            });
        })
    }
};

function handleInternalDBError(err, res) {
    return res.status(500).json({
        success: false,
        message: err
    });
}

function handleUserErrorWithCustomMessage(res, customMessage) {
    return res.status(400).json({
        success: false,
        message: customMessage
    });
}