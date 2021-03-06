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
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return notification titles owned by current user */
    getTitles: function (req, res) {
        models.User.findById(req.user._id, '-_id notificationStack').populate({
            path: 'notificationStack.notification',
            select: 'createdAt updatedAt title creator',
            populate: {
                path: 'creator',
                select: 'email'
            }
        }).exec(function (err, stack) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!stack) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user.'
                });
            }
            else {
                var sortedStack = stack.notificationStack.sort(function(a, b) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                return res.json({
                    success: true,
                    data: sortedStack
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/notifications/get-unread-titles
     * operations:
     *   -  httpMethod: GET
     *      summary: Get unread notification titles owned by current user
     *      notes: Return unread notification titles owned by current user
     *      nickname: Get owned unread notification titles
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return unread notification titles owned by current user */
    getUnreadTitles: function (req, res) {
        models.User.findById(req.user._id, '-_id notificationStack').populate({
            path: 'notificationStack.notification',
            select: 'createdAt updatedAt title creator',
            populate: {
                path: 'creator',
                select: 'email'
            }
        }).exec(function (err, stack) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!stack) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user.'
                });
            }
            else {
                var importantStack = [];
                for (var i = 0; i < stack.notificationStack.length; i++) {
                    if (!stack.notificationStack[i].isRead) {
                        importantStack.push(stack.notificationStack[i]);
                    }
                }
                var sortedUnreadStack = importantStack.sort(function(a, b) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                return res.json({
                    success: true,
                    data: sortedUnreadStack
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/notifications/get-important-titles
     * operations:
     *   -  httpMethod: GET
     *      summary: Get important notification titles owned by current user
     *      notes: Return important notification titles owned by current user
     *      nickname: Get owned important notification titles
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return important notification titles owned by current user */
    getImportantTitles: function (req, res) {
        models.User.findById(req.user._id, '-_id notificationStack').populate({
            path: 'notificationStack.notification',
            select: 'createdAt updatedAt title creator',
            populate: {
                path: 'creator',
                select: 'email'
            }
        }).exec(function (err, stack) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!stack) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user.'
                });
            }
            else {
                var importantStack = [];
                for (var i = 0; i < stack.notificationStack.length; i++) {
                    if (stack.notificationStack[i].isImportant) {
                        importantStack.push(stack.notificationStack[i]);
                    }
                }
                var sortedImportantStack = importantStack.sort(function(a, b) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                return res.json({
                    success: true,
                    data: sortedImportantStack
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
            return res.status(400).json({
                success: false,
                message: 'Notification does not exist.'
            });
        }
        else {
            models.Notification.findById(req.query.notificationId).populate('creator', 'email').populate('targetGroups.group', 'name').exec(function (err, notification) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    });
                }
                else if (!notification || !notification.isSent) {
                    return res.status(400).json({
                        success: false,
                        message: 'Notification does not exist.'
                    });
                }
                else {
                    return res.json({
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
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return 5 latest notification titles owned by current user */
    get5Latest: function(req, res) {
        models.User.findById(req.user._id, '-_id notificationStack').populate({
            path: 'notificationStack.notification',
            select: 'createdAt updatedAt title creator',
            populate: {
                path: 'creator',
                select: 'email'
            }
        }).exec(function (err, stack) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!stack) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user.'
                });
            }
            else {
                var unread = 0;
                for (var j = 0; j < stack.notificationStack.length; j++) {
                    if (!stack.notificationStack[j].isRead) {
                        unread++;
                    }
                }
                var sortedStack = stack.notificationStack.sort(function(a, b) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                var arrOf5Latest = [];
                for (var i = 0; i < 5; i++) {
                    if (sortedStack[i]) {
                        arrOf5Latest.push(sortedStack[i]);
                    }
                    else {
                        break;
                    }
                }
                return res.json({
                    success: true,
                    data: {
                        latest: arrOf5Latest,
                        unread: unread
                    }
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
     *        - name: Authorization
     *          description: Bearer [accessToken]
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
            return res.json({
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
    },

    /**
     * @swagger
     * path: /api/v1/notifications/mark-one-as-read
     * operations:
     *   -  httpMethod: PUT
     *      summary: Mark one notification as read
     *      notes: Return result
     *      nickname: Mark one notification as read
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
    /* Mark one notification as read (by id) */
    markOneAsRead: function (req, res) {
        models.User.findOneAndUpdate({
            _id: req.user._id,
            notificationStack: {
                $elemMatch: {
                    notification: req.body.notificationId,
                    isRead: false
                }
            }
        }, {
            $set: {
                'notificationStack.$.isRead': true
            }
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
                    message: 'Notification marked as read.'
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/notifications/mark-one-as-unread
     * operations:
     *   -  httpMethod: PUT
     *      summary: Mark one notification as unread
     *      notes: Return result
     *      nickname: Mark one notification as unread
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
    /* Mark one notification as unread (by id) */
    markOneAsUnread: function (req, res) {
        models.User.findOneAndUpdate({
            _id: req.user._id,
            notificationStack: {
                $elemMatch: {
                    notification: req.body.notificationId,
                    isRead: true
                }
            }
        }, {
            $set: {
                'notificationStack.$.isRead': false
            }
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
                    message: 'Notification marked as unread.'
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/notifications/mark-one-as-important
     * operations:
     *   -  httpMethod: PUT
     *      summary: Mark one notification as important
     *      notes: Return result
     *      nickname: Mark one notification as important
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
    /* Mark one notification as important (by id) */
    markOneAsImportant: function (req, res) {
        models.User.findOneAndUpdate({
            _id: req.user._id,
            notificationStack: {
                $elemMatch: {
                    notification: req.body.notificationId,
                    isImportant: false
                }
            }
        }, {
            $set: {
                'notificationStack.$.isImportant': true
            }
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
                    message: 'Notification marked as important.'
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/notifications/mark-one-as-unimportant
     * operations:
     *   -  httpMethod: PUT
     *      summary: Mark one notification as unimportant
     *      notes: Return result
     *      nickname: Mark one notification as unimportant
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
    /* Mark one notification as unimportant (by id) */
    markOneAsUnimportant: function (req, res) {
        models.User.findOneAndUpdate({
            _id: req.user._id,
            notificationStack: {
                $elemMatch: {
                    notification: req.body.notificationId,
                    isImportant: true
                }
            }
        }, {
            $set: {
                'notificationStack.$.isImportant': false
            }
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
                    message: 'Notification marked as unimportant.'
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/notifications/delete
     * operations:
     *   -  httpMethod: DELETE
     *      summary: Delete one/many notification(s)
     *      notes: Return result
     *      nickname: Delete notification(s)
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: notificationIds
     *          description: Notification ids (separated by comma)
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    /* Delete notification(s) by ids */
    deleteNotifications: function (req, res) {
        req.query.notificationIds = req.query.notificationIds.replace(/\s+/g, '');
        var parsedNotificationIds = req.query.notificationIds.split(',');
        models.User.findByIdAndUpdate(req.user._id, {
            $pull: {
                notificationStack: {
                    notification: {
                        $in: parsedNotificationIds
                    }
                }
            }
        }, function (err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.json({
                    success: true,
                    message: 'Notifications deleted.'
                });
            }
        });
    }
};