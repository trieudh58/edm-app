var models = require('../models');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/notifications
     * description: Notifications apis
     */

    /**
     * @swagger
     * path: /api/v1/notifications/create
     * operations:
     *   -  httpMethod: POST
     *      summary: Admins create a new notification
     *      notes: Return created notification
     *      nickname: Create notification
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: title
     *          description: Notification title
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: body
     *          description: Notification body
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: targetGroupIds
     *          description: Target group ids (separated by comma)
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Return created notification */
    create: function (req, res) {
        if (!req.body.title || !req.body.body || !req.body.targetGroupIds) {
            res.json({
                success: false,
                message: 'Missing required fields.'
            });
        }
        else {
            // Remove all space in this query string.
            req.body.targetGroupIds = req.body.targetGroupIds.replace(/\s+/g, '');

            var parsedTargetGroups = req.body.targetGroupIds.split(',');
            var groups = [];
            for (var i = 0; i < parsedTargetGroups.length; i++) {
                groups.push({
                    group: parsedTargetGroups[i]
                });
            }
            models.Notification.create({
                title: req.body.title,
                body: req.body.body,
                creator: req.user._id,
                targetGroups: groups
            }, function (err, createdNotification) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: err
                    });
                }
                res.json({
                    success: true,
                    message: 'Notification created.',
                    data: {
                        title: createdNotification.title,
                        body: createdNotification.body,
                        creator: req.user.email,
                        createdAt: createdNotification.createdAt,
                        targetGroups: createdNotification.targetGroups,
                        isSent: createdNotification.isSent
                    }
                });
            });
        }
    },

    /**
     * @swagger
     * path: /api/v1/notifications/send-created-one
     * operations:
     *   -  httpMethod: POST
     *      summary: Admins send a created notification
     *      notes: Return sent notification
     *      nickname: Send notification
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
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Return sent notification */

    /**
     * @swagger
     * path: /api/v1/notifications/get-all
     * operations:
     *   -  httpMethod: GET
     *      summary: Get all notifications (newest-to-oldest order)
     *      notes: Return created notifications (newest-to-oldest order)
     *      nickname: Get all notifications (newest-to-oldest order)
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return all notifications (newest-to-oldest order) */
    getAll: function (req, res) {
        models.Notification.find({}, '-__v -body').populate('creator', 'email').populate('targetGroups.group', 'name').sort({updatedAt: 'desc'}).exec(function (err, notifications) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            res.json({
                data: notifications
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/notifications/get-one-by-id
     * operations:
     *   -  httpMethod: GET
     *      summary: Get one notification by id
     *      notes: Return selected notification
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
     *          description: Id of notification
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    /* Return selected notification */
    getOneById: function (req, res) {
        models.Notification.findById(req.query.notificationId, '-__v').populate({
            path: 'creator',
            select: 'email -_id'
        }).populate({
            path: 'targetGroups.group',
            select: 'name'
        }).exec(function (err, selectedNotification) {
            if (err) {
                res.status(500).json({
                    success:false,
                    message: err
                });
            }
            else if (!selectedNotification) {
                res.json({
                    success: false,
                    message: 'Notification does not exist.'
                });
            }
            else {
                res.json({
                    success: true,
                    data: selectedNotification
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/notifications/delete-one-by-id
     * operations:
     *   -  httpMethod: DELETE
     *      summary: Delete a notification by id
     *      notes: Return deleted notification
     *      nickname: Delete one notification
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: _id
     *          description: Notification id
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    deleteOneById: function (req, res) {
        models.Notification.findByIdAndRemove(req.body._id, function (err, removedNotification) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!removedNotification) {
                res.json({
                    success: false,
                    message: 'Notification does not exist.'
                });
            }
            else {
                models.User.update({
                    notificationStack: {
                        notification: removedNotification._id
                    }
                }, {
                    $pull: {
                        notificationStack: {
                            notification: removedNotification._id
                        }
                    }
                }, function (err, result) {
                    res.json({
                        success: true,
                        message: 'Notification deleted.'
                    });
                });
            }
        });
    }
};