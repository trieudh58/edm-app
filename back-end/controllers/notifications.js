var models = require('../models');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/notifications
     * description: Notifications apis (for common users)
     */

    /**
     * @swagger
     * path: /api/v1/notifications/get-titles
     * operations:
     *   -  httpMethod: GET
     *      summary: Get notification titles owned by current user
     *      notes: Return notification titles owned by current user
     *      nickname: Get owned notification titles
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return notification titles owned by current user */
    getTitles: function (req, res) {
        models.User.findById(req.user._id, '-_id notificationStack').populate('notificationStack.notification', 'createdAt updatedAt title isHidden isRead').exec(function (err, stack) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.json({
                    success: true,
                    data: stack
                });
            }
        });
    },


    /**
     * @swagger
     * path: /api/v1/notifications/get-by-id
     * operations:
     *   -  httpMethod: GET
     *      summary: Get notification by id owned by current user
     *      notes: Return notification by id owned by current user
     *      nickname: Get notification by id
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: notificationId
     *          description: Notification id
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    /* Return notification by id owned by current user */
    getById: function (req, res) {
        models.Notification.findById(req.query.notificationId, '-__v').populate('creator', '-_id email').populate('targetGroups.group', '-_id name').exec(function (err, notification) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!notification || !notification.isSent) {
                res.json({
                    success: false,
                    message: 'Notification does not exist.'
                });
            }
            else {
                res.json({
                    success: true,
                    data: notification
                });
            }
        });
    }
};