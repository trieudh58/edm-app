var models = require('../../models/index');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/admin/notifications
     * description: Notifications apis (for admin)
     */

    /**
     * @swagger
     * path: /api/v1/admin/notifications/create
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
    createNew: function (req, res) {
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
                else {
                    res.json({
                        success: true,
                        message: 'Notification created.',
                        data: {
                            _id: createdNotification._id,
                            title: createdNotification.title,
                            body: createdNotification.body,
                            creator: req.user.email,
                            createdAt: createdNotification.createdAt,
                            targetGroups: createdNotification.targetGroups,
                            isSent: createdNotification.isSent
                        }
                    });
                }
            });
        }
    },

    /**
     * @swagger
     * path: /api/v1/admin/notifications/send-created
     * operations:
     *   -  httpMethod: PUT
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
    sendCreated: function (req, res) {
        models.Notification.findById(req.body.notificationId, 'targetGroups', function (err, notification) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!notification) {
                res.json({
                    success: false,
                    message: 'Notification does not exist.'
                });
            }
            else if (notification.isSent) {
                res.json({
                    success: false,
                    message: 'Notification is already sent.'
                });
            }
            else {
                var targetGroups = [];
                for (var i = 0; i < notification.targetGroups.length; i++) {
                    if (typeof notification.targetGroups[i].group != 'undefined') {targetGroups.push(notification.targetGroups[i].group.toString());}
                }
                models.User.find({}, 'notificationStack personalInfo.groups', function (err, users) {
                    for (var i = 0; i< users.length; i++) {
                        if (users[i].personalInfo.groups.length) {
                            for (var j = 0; j < users[i].personalInfo.groups.length; j++) {
                                if (targetGroups.indexOf(users[i].personalInfo.groups[j].group.toString()) != -1) {
                                    users[i].update({
                                        $push: {
                                            notificationStack: {
                                                notification: notification._id
                                            }
                                        }
                                    }, function (err) {
                                        if (err) {
                                            res.status(500).json({
                                                success: false,
                                                message: err
                                            });
                                        }
                                    });
                                    break;
                                }
                            }
                        }
                    }
                    notification.update({
                        isSent: true
                    }).exec(function (err) {
                        if (err) {
                            res.status(500).json({
                                success: false,
                                message: err
                            });
                        }
                        res.json({
                            success: true,
                            message: 'Notification is sent.'
                        });
                    });
                });
            }

        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/notifications/get-all
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
     * path: /api/v1/admin/notifications/get-one-by-id
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
     * path: /api/v1/admin/notifications/delete-one-by-id
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
     *        - name: notificationId
     *          description: Notification id
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    deleteOneById: function (req, res) {
        models.Notification.findById(req.body.notificationId, 'isSent', function (err, notification) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!notification) {
                res.json({
                    success: false,
                    message: 'Notification does not exist.'
                });
            }
            else if (!notification.isSent) {
                notification.remove(function (err) {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            message: err
                        });
                    }
                    res.json({
                        success: true,
                        message: 'Notification deleted.'
                    });
                });
            }
            else {
                models.User.find({
                    notificationStack: {
                        $elemMatch: {
                            notification: notification._id
                        }
                    }
                }, function (err, users) {
                    for (var i = 0; i < users.length; i++) {
                        users[i].update({
                            $pull: {
                                notificationStack: {
                                    notification: notification._id
                                }
                            }
                        }).exec(function (err) {
                            if (err) {
                                res.status(500).json({
                                    success: false,
                                    message: err
                                });
                            }
                        });
                    }
                    notification.remove(function (err) {
                        if (err) {
                            res.status(500).json({
                                success: false,
                                message: err
                            });
                        }
                        res.json({
                            success: true,
                            message: 'Notification deleted.'
                        });
                    });
                });
            }
        });
    }
};