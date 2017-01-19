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
                        user: config.mailer.user,
                        pass: config.mailer.pass,
                        sender: config.mailer.sender
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
                        user: config.mailer.user,
                        pass: config.mailer.pass,
                        sender: config.mailer.sender
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