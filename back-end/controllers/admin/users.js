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
    }
};