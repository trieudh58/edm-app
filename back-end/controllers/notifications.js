var models = require('../models/index');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/notifications
     * description: Notifications apis (for common users)
     */

    /**
     * @swagger
     * path: /api/v1/notifications/get-notification-stack
     * operations:
     *   -  httpMethod: GET
     *      summary: Get notification stack
     *      notes: Return notification stack of request user
     *      nickname: Get notification stack
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return notification stack */
    getNotificationStack: function (req, res) {

    }
};