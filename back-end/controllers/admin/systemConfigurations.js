var models = require('../../models');
var config = require('../../config');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/admin/system-configurations
     * description: System configuration apis (for admin only)
     */

    /**
     * @swagger
     * path: /api/v1/admin/system-configurations/get-all
     * operations:
     *   -  httpMethod: GET
     *      summary: Admin reads all system configurations in database
     *      notes: Return all system configurations
     *      nickname: Read all system configurations
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Read all system configurations */
    getAll: function (req, res) {
        models.SystemConfiguration.findOne({
            creator: req.user._id
        }, function (err, sysConfiguration) {
            if (err)
                return handleInternalDBError(err, res);
            if (!sysConfiguration)
                return handleUserErrorWithCustomMessage(res, 'No configuration is set or invalid user');
            return res.json({
                success: true,
                sysConfiguration: sysConfiguration
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/system-configurations/reset
     * operations:
     *   -  httpMethod: POST
     *      summary: Admin reset all system configurations to default in database
     *      notes: Return result
     *      nickname: Reset all system configurations
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Reset all system configurations */
    reset: function (req, res) {
        models.SystemConfiguration.findOne({
            creator: req.user._id
        }, function (err, sysConfiguration) {
            if (err)
                return handleInternalDBError(err, res);
            if (sysConfiguration) {
                return sysConfiguration.update({
                    mailer: {
                        service: config.mailer.service,
                        host: config.mailer.host,
                        port: config.mailer.port,
                        auth: {
                            user: config.mailer.auth.user,
                            pass: config.mailer.auth.pass,
                            sender: config.mailer.auth.sender
                        }
                    },
                    allowAccountRegister: true,
                    allowCourseRequest: true,
                    allowSystemAssessment: true,
                    allowCourseComment: true
                }, function (err) {
                    if (err)
                        return handleInternalDBError(err, res);
                    return res.json({
                        success: true,
                        message: 'All configurations are reset'
                    });
                });
            }
            else {
                models.SystemConfiguration.create({
                    creator: req.user._id,
                    mailer: {
                        service: config.mailer.service,
                        host: config.mailer.host,
                        port: config.mailer.port,
                        auth: {
                            user: config.mailer.auth.user,
                            pass: config.mailer.auth.pass,
                            sender: config.mailer.auth.sender
                        }
                    },
                    allowAccountRegister: true,
                    allowCourseRequest: true,
                    allowSystemAssessment: true,
                    allowCourseComment: true
                }, function (err) {
                    if (err)
                        return handleInternalDBError(err, res);
                    return res.json({
                        success: true,
                        message: 'All configurations are reset'
                    });
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/system-configurations/update-smtp
     * operations:
     *   -  httpMethod: PUT
     *      summary: Admin update SMTP configurations in database
     *      notes: Return result
     *      nickname: Update SMTP configurations
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: service
     *          description: SMTP service
     *          paramType: form
     *          dataType: string
     *        - name: host
     *          description: SMTP host
     *          paramType: form
     *          dataType: string
     *        - name: port
     *          description: SMTP port
     *          paramType: form
     *          dataType: integer
     *        - name: user
     *          description: SMTP user
     *          paramType: form
     *          dataType: string
     *        - name: password
     *          description: SMTP password
     *          paramType: form
     *          dataType: string
     *        - name: sender
     *          description: SMTP sender
     *          paramType: form
     *          dataType: string
     */
    /* Update smtp (mailer) configurations */
    updateSMTP: function (req, res) {
        models.SystemConfiguration.findOne({
            creator: req.user._id
        }, function (err, sysConfiguration) {
            if (err)
                return handleInternalDBError(err, res);
            if (!sysConfiguration)
                return handleUserErrorWithCustomMessage(res, 'Configuration does not exist');
            return sysConfiguration.update({
                mailer: {
                    service: req.body.service || config.mailer.service,
                    host: req.body.host || config.mailer.host,
                    port: req.body.port || config.mailer.port,
                    auth: {
                        user: req.body.user || config.mailer.auth.user,
                        pass: req.body.password || config.mailer.auth.pass,
                        sender: req.body.sender || config.mailer.auth.sender
                    }
                }
            }, function (err) {
                if (err)
                    return handleInternalDBError(err, res);
                return res.json({
                    success: true,
                    message: 'SMTP configurations updated'
                });
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/system-configurations/enable-account-register
     * operations:
     *   -  httpMethod: PUT
     *      summary: Admin enable account register configuration
     *      notes: Return result
     *      nickname: Enable account register configuration
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Enable account register configuration */
    enableAccountRegister: function (req, res) {
        models.SystemConfiguration.findOne({
            creator: req.user._id
        }, function (err, sysConfiguration) {
            if (err)
                return handleInternalDBError(err, res);
            if (!sysConfiguration)
                return handleUserErrorWithCustomMessage(res, 'Configuration does not exist');
            if (sysConfiguration.allowAccountRegister)
                return handleUserErrorWithCustomMessage(res, 'Account register is already enabled');
            return sysConfiguration.update({
                allowAccountRegister: true
            }, function (err) {
                if (err)
                    return handleInternalDBError(err, res);
                return res.json({
                    success: true,
                    message: 'Account register enabled'
                });
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/system-configurations/disable-account-register
     * operations:
     *   -  httpMethod: PUT
     *      summary: Admin disable account register configuration
     *      notes: Return result
     *      nickname: Disable account register configuration
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Disable account register configuration */
    disableAccountRegister: function (req, res) {
        models.SystemConfiguration.findOne({
            creator: req.user._id
        }, function (err, sysConfiguration) {
            if (err)
                return handleInternalDBError(err, res);
            if (!sysConfiguration)
                return handleUserErrorWithCustomMessage(res, 'Configuration does not exist');
            if (!sysConfiguration.allowAccountRegister)
                return handleUserErrorWithCustomMessage(res, 'Account register is already disabled');
            return sysConfiguration.update({
                allowAccountRegister: false
            }, function (err) {
                if (err)
                    return handleInternalDBError(err, res);
                return res.json({
                    success: true,
                    message: 'Account register disabled'
                });
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/system-configurations/enable-course-request
     * operations:
     *   -  httpMethod: PUT
     *      summary: Admin enable course request configuration
     *      notes: Return result
     *      nickname: Enable course request configuration
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Enable course request configuration */
    enableCourseRequest: function (req, res) {
        models.SystemConfiguration.findOne({
            creator: req.user._id
        }, function (err, sysConfiguration) {
            if (err)
                return handleInternalDBError(err, res);
            if (!sysConfiguration)
                return handleUserErrorWithCustomMessage(res, 'Configuration does not exist');
            if (sysConfiguration.allowCourseRequest)
                return handleUserErrorWithCustomMessage(res, 'Course request is already enabled');
            return sysConfiguration.update({
                allowCourseRequest: true
            }, function (err) {
                if (err)
                    return handleInternalDBError(err, res);
                return res.json({
                    success: true,
                    message: 'Course request enabled'
                });
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/system-configurations/disable-course-request
     * operations:
     *   -  httpMethod: PUT
     *      summary: Admin disable course request configuration
     *      notes: Return result
     *      nickname: Disable course request configuration
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Disable course request configuration */
    disableCourseRequest: function (req, res) {
        models.SystemConfiguration.findOne({
            creator: req.user._id
        }, function (err, sysConfiguration) {
            if (err)
                return handleInternalDBError(err, res);
            if (!sysConfiguration)
                return handleUserErrorWithCustomMessage(res, 'Configuration does not exist');
            if (!sysConfiguration.allowCourseRequest)
                return handleUserErrorWithCustomMessage(res, 'Course request is already disabled');
            return sysConfiguration.update({
                allowCourseRequest: false
            }, function (err) {
                if (err)
                    return handleInternalDBError(err, res);
                return res.json({
                    success: true,
                    message: 'Course request disabled'
                });
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/system-configurations/enable-course-comment
     * operations:
     *   -  httpMethod: PUT
     *      summary: Admin enable course comment configuration
     *      notes: Return result
     *      nickname: Enable course comment configuration
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Enable course comment configuration */
    enableCourseComment: function (req, res) {
        models.SystemConfiguration.findOne({
            creator: req.user._id
        }, function (err, sysConfiguration) {
            if (err)
                return handleInternalDBError(err, res);
            if (!sysConfiguration)
                return handleUserErrorWithCustomMessage(res, 'Configuration does not exist');
            if (sysConfiguration.allowCourseComment)
                return handleUserErrorWithCustomMessage(res, 'Course comment is already enabled');
            return sysConfiguration.update({
                allowCourseComment: true
            }, function (err) {
                if (err)
                    return handleInternalDBError(err, res);
                return res.json({
                    success: true,
                    message: 'Course comment enabled'
                });
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/system-configurations/disable-course-comment
     * operations:
     *   -  httpMethod: PUT
     *      summary: Admin disable course comment configuration
     *      notes: Return result
     *      nickname: Disable course comment configuration
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Disable course comment configuration */
    disableCourseComment: function (req, res) {
        models.SystemConfiguration.findOne({
            creator: req.user._id
        }, function (err, sysConfiguration) {
            if (err)
                return handleInternalDBError(err, res);
            if (!sysConfiguration)
                return handleUserErrorWithCustomMessage(res, 'Configuration does not exist');
            if (!sysConfiguration.allowCourseComment)
                return handleUserErrorWithCustomMessage(res, 'Course comment is already disabled');
            return sysConfiguration.update({
                allowCourseComment: false
            }, function (err) {
                if (err)
                    return handleInternalDBError(err, res);
                return res.json({
                    success: true,
                    message: 'Course comment disabled'
                });
            });
        });
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