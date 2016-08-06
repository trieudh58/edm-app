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
        var flag = false;
        for (var i = 0; i < req.user.notificationStack.length; i++) {
            if (req.query.notificationId == req.user.notificationStack[i].notification) {
                flag = true;
                break;
            }
        }
        if (!flag) {
            res.json({
                success: false,
                message: 'Notification does not exist or access denied.'
            });
        }
        else {
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
    },

    /**
     * @swagger
     * path: /api/v1/notifications/get-5-latest-titles
     * operations:
     *   -  httpMethod: GET
     *      summary: Get 5 latest notification titles owned by current user
     *      notes: Return 5 latest notification titles owned by current user
     *      nickname: Get 5 latest notification titles
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return 5 latest notification titles owned by current user */
    get5Latest: function(req, res) {
        models.User.findById(req.user._id, '-_id notificationStack').populate('notificationStack.notification', 'createdAt updatedAt title isHidden isRead').sort({
            createdAt: 'desc'
        }).limit(5).exec(function (err, stack) {
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
     * path: /api/v1/notifications/mark-all-as-read
     * operations:
     *   -  httpMethod: PUT
     *      summary: Mark all notifications as read
     *      notes: Return result
     *      nickname: Mark all notifications as read
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Mark all notifications as read */
    markAllAsRead: function (req, res) {
        var count = 0;
        for (var i = 0; i < req.user.notificationStack.length; i++) {
            console.log(req.user.notificationStack[i]);
            if (!req.user.notificationStack[i].isRead) {
                count++;
            }
        }
        try {
            for (var j = 0; j < count; j++) {
                models.User.findOneAndUpdate({
                    _id: req.user._id,
                    notificationStack: {
                        $elemMatch: {
                            isRead: false
                        }
                    }
                }, {
                    $set: {
                        'notificationStack.$.isRead': true
                    }
                }).exec();
            }
            res.json({
                success: true,
                message: 'All notifications marked as read.'
            });
        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: err
            });
        }
    }
};