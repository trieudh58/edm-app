var Notification = require('../models').Notification;

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
     *        - name: targetGroups
     *          description: Target group
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Return created notification */
    create: function (req, res) {
        if (!req.body.title || !req.body.body || !req.body.targetGroups) {
            res.json({
                success: false,
                message: 'Missing required fields.'
            });
        }
        else {
            var groups = req.body.targetGroups.split(',');
            Notification.create({
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
                        createdAt: Date(createdNotification.createdAt),
                        targetGroups: createdNotification.targetGroups,
                        isSent: createdNotification.isSent
                    }
                });
            });
        }
    },

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
        Notification.find({}, '-__v').populate('creator').sort({updatedAt: 'desc'}).exec(function (err, notifications) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            var dataToBeSent = [];
            for (var i = 0; i < notifications.length; i++) {
                var singleNoti = {};
                singleNoti._id = notifications[i]._id;
                singleNoti.createdAt = Date(notifications[i].createdAt);
                singleNoti.updatedAt = Date(notifications[i].updatedAt);
                singleNoti.title = notifications[i].title;
                singleNoti.body = notifications[i].body;
                singleNoti.creator = notifications[i].creator.email;
                singleNoti.isSent = notifications[i].isSent;
                singleNoti.targetGroups = notifications[i].targetGroups;
                dataToBeSent.push(singleNoti);
            }
            res.json({
                success: true,
                data: dataToBeSent
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
        Notification.findById(req.query.notificationId, '-__v').populate('creator').exec(function (err, selectedNotification) {
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
                    data: {
                        _id : selectedNotification._id,
                        createdAt : Date(selectedNotification.createdAt),
                        updatedAt : Date(selectedNotification.updatedAt),
                        title : selectedNotification.title,
                        body : selectedNotification.body,
                        creator : selectedNotification.creator.email,
                        isSent : selectedNotification.isSent,
                        targetGroups : selectedNotification.targetGroups
                    }
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
        Notification.findByIdAndRemove(req.body._id, function (err, removedNotification) {
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
                res.json({
                    success: true,
                    message: 'Notification deleted.',
                    data: removedNotification
                });
            }
        });
    }
};