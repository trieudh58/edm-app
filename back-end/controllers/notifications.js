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
     *      summary: Get all notifications created
     *      notes: Return created notifications
     *      nickname: Get all notifications
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return all notifications */
    getAll: function (req, res) {
        Notification.find({}, '-__v').populate('creator').exec(function (err, notifications) {
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
    }
};