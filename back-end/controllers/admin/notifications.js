var models = require('../../models');

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
     *        - name: Authorization
     *          description: Bearer [accessToken]
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
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.json({
                    success: true,
                    message: 'Notification created.',
                    data: createdNotification
                });
            }
        });
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
     *        - name: Authorization
     *          description: Bearer [accessToken]
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
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!notification) {
                return res.status(400).json({
                    success: false,
                    message: 'Notification does not exist.'
                });
            }
            else if (notification.isSent) {
                return res.status(400).json({
                    success: false,
                    message: 'Notification is already sent.'
                });
            }
            else {
                models.User.find({}, 'notificationStack personalInfo.groups', function (err, users) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err
                        });
                    }
                    else {
                        var targetGroups = [];
                        for (var k = 0; k < notification.targetGroups.length; k++) {
                            if (typeof notification.targetGroups[k].group != 'undefined') {
                                targetGroups.push(notification.targetGroups[k].group.toString());
                            }
                        }
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
                                                return res.status(500).json({
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
                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });
                            }
                            else {
                                return res.json({
                                    success: true,
                                    message: 'Notification is sent.'
                                });
                            }
                        });
                    }
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/notifications/create-and-send
     * operations:
     *   -  httpMethod: POST
     *      summary: Admins create and send a new notification
     *      notes: Return sent notification
     *      nickname: Create and send notification
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
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
    /* Return sent notification */
    createAndSend: function (req, res) {
        // Remove all space in this query string.
        req.body.targetGroupIds = req.body.targetGroupIds.replace(/\s+/g, '');

        var parsedTargetGroups = req.body.targetGroupIds.split(',');
        var validGroups = [];
        models.StudentGroup.find({}, '_id', function (err, groups) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else {
                groups.forEach(function (group) {
                    var matchAt = parsedTargetGroups.indexOf(group._id.toString());
                    if (matchAt != -1) {
                        validGroups.push({
                            group: parsedTargetGroups[matchAt]
                        });
                    }
                });
                if (validGroups.length == 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid group id(s).'
                    });
                }
                else {
                    models.Notification.create({
                        title: req.body.title,
                        body: req.body.body,
                        creator: req.user._id,
                        targetGroups: validGroups
                    }, function (err, createdNotification) {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: err
                            });
                        }
                        else {
                            models.User.find({}, 'notificationStack personalInfo.groups', function (err, users) {
                                if (err) {
                                    return res.status(500).json({
                                        success: false,
                                        message: err
                                    });
                                }
                                else {
                                    var targetGroups = [];
                                    for (var i = 0; i < createdNotification.targetGroups.length; i++) {
                                        if (typeof createdNotification.targetGroups[i].group != 'undefined') {
                                            targetGroups.push(createdNotification.targetGroups[i].group.toString());
                                        }
                                    }
                                    for (var k = 0; k< users.length; k++) {
                                        if (users[k].personalInfo.groups.length) {
                                            for (var j = 0; j < users[k].personalInfo.groups.length; j++) {
                                                if (targetGroups.indexOf(users[k].personalInfo.groups[j].group.toString()) != -1) {
                                                    users[k].update({
                                                        $push: {
                                                            notificationStack: {
                                                                notification: createdNotification._id
                                                            }
                                                        }
                                                    }, function (err) {
                                                        if (err) {
                                                            return res.status(500).json({
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
                                    createdNotification.update({
                                        isSent: true
                                    }).exec(function (err) {
                                        if (err) {
                                            return res.status(500).json({
                                                success: false,
                                                message: err
                                            });
                                        }
                                        else {
                                            return res.json({
                                                success: true,
                                                message: 'Notification is sent.'
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
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
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return all notifications (newest-to-oldest order) */
    getAll: function (req, res) {
        models.Notification.find({}, '-body').populate('creator', 'email').populate('targetGroups.group', 'name').sort({updatedAt: 'desc'}).exec(function (err, notifications) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.json({
                    success: true,
                    data: notifications
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/notifications/get-all-sent
     * operations:
     *   -  httpMethod: GET
     *      summary: Get all sent notifications (newest-to-oldest order)
     *      notes: Return sent notifications (newest-to-oldest order)
     *      nickname: Get all sent notifications (newest-to-oldest order)
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return all sent notifications (newest-to-oldest order) */
    getAllSent: function (req, res) {
        models.Notification.find({
            isSent: true
        }, '-body').populate('creator', 'email').populate('targetGroups.group', 'name').sort({updatedAt: 'desc'}).exec(function (err, notifications) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.json({
                    success: true,
                    data: notifications
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/notifications/get-all-unsent
     * operations:
     *   -  httpMethod: GET
     *      summary: Get all unsent notifications (newest-to-oldest order)
     *      notes: Return unsent notifications (newest-to-oldest order)
     *      nickname: Get all unsent notifications (newest-to-oldest order)
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return all unsent notifications (newest-to-oldest order) */
    getAllUnsent: function (req, res) {
        models.Notification.find({
            isSent: false
        }, '-body').populate('creator', 'email').populate('targetGroups.group', 'name').sort({updatedAt: 'desc'}).exec(function (err, notifications) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.json({
                    success: true,
                    data: notifications
                });
            }
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
     *        - name: Authorization
     *          description: Bearer [accessToken]
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
        models.Notification.findById(req.query.notificationId).populate({
            path: 'creator',
            select: 'email -_id'
        }).populate({
            path: 'targetGroups.group',
            select: 'name'
        }).exec(function (err, selectedNotification) {
            if (err) {
                return res.status(500).json({
                    success:false,
                    message: err
                });
            }
            else if (!selectedNotification) {
                return res.status(400).json({
                    success: false,
                    message: 'Notification does not exist.'
                });
            }
            else {
                return res.json({
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
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: notificationId
     *          description: Notification id
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    deleteOneById: function (req, res) {
        models.Notification.findById(req.query.notificationId, 'isSent', function (err, notification) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!notification) {
                return res.status(400).json({
                    success: false,
                    message: 'Notification does not exist.'
                });
            }
            else if (!notification.isSent) {
                notification.remove(function (err) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err
                        });
                    }
                    else {
                        return res.json({
                            success: true,
                            message: 'Notification deleted.'
                        });
                    }
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
                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });
                            }
                        });
                    }
                    notification.remove(function (err) {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: err
                            });
                        }
                        else {
                            return res.json({
                                success: true,
                                message: 'Notification deleted.'
                            });
                        }
                    });
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/notifications/delete-by-ids
     * operations:
     *   -  httpMethod: DELETE
     *      summary: Delete one or many notification by ids
     *      notes: Return result
     *      nickname: Delete notifications
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: notificationIds
     *          description: Notification ids (separated by comma)
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    deleteByIds: function (req, res) {
        var idArr = req.query.notificationIds.replace(/\s+/g, '').split(',');
        try {
            for (var i = 0; i < idArr.length; i++) {
                models.Notification.findById(idArr[i], 'isSent', function (err, notification) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err
                        });
                    }
                    else if (!notification) {
                        return res.status(400).json({
                            success: false,
                            message: 'Notification does not exist.'
                        });
                    }
                    else if (!notification.isSent) {
                        notification.remove(function (err) {
                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });
                            }
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
                                        return res.status(500).json({
                                            success: false,
                                            message: err
                                        });
                                    }
                                });
                            }
                            notification.remove(function (err) {
                                if (err) {
                                    return res.status(500).json({
                                        success: false,
                                        message: err
                                    });
                                }
                            });
                        });
                    }
                });
            }
            return res.json({
                success: true,
                message: 'Notifications deleted.'
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: err
            });
        }
    }
};