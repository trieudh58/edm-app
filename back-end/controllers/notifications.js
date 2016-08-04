var models = require('../models');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/notifications
     * description: Notifications apis (for common users)
     */

    /**
     * @swagger
     * path: /api/v1/notifications/get-owned-notification-titles
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
    getOwnedNotificationTitles: function (req, res) {
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
    }
};