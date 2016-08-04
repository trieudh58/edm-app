var User = require('../../models').User;
var config = require('../../config');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/admin/users
     * description: Users apis (for admin)
     */

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
     * path: /api/v1/admin/users/delete
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
    }
};