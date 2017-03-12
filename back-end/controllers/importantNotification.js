var models = require('../models');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/important-notification
     * description: important-notification apis
     */

    /**
     * @swagger
     * path: /api/v1/important-notification/get-all
     * operations:
     *   -  httpMethod: GET
     *      summary: Get all important-notification (that is published)
     *      notes: Return all important-notification (that is published)
     *      nickname: Get all important-notification
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get all important-notification (that is published) */
    getAll: function (req, res) {
      models.Notification.find({
        isPublished: true
      }, function (err, importantNotification) {
        if (err)
          return handleInternalDBError(err, res);
        return res.json({
          success: true,
          data: importantNotification
        });
      });
    },

    /**
     * @swagger
     * path: /api/v1/important-notification/get-all-headers
     * operations:
     *   -  httpMethod: GET
     *      summary: Get all Notification headers
     *      notes: Return all Notification headers
     *      nickname: Get all Notification headers
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get all Notification headers */
    getAllNotificationHeaders: function (req, res) {
      models.Notification.find({
        isPublished: true
      }, '_id header sumary', function (err, importantNotification) {
        if (err)
          return handleInternalDBError(err, res);
        return res.json({
          success: true,
          data: importantNotification
        });
      });
    },

    /**
     * @swagger
     * path: /api/v1/important-notification/get-one-by-id
     * operations:
     *   -  httpMethod: GET
     *      summary: Get one Notification by id
     *      notes: Return one Notification
     *      nickname: Get one Notification by id
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
    /* Get one Notification by id */
    getOneById: function (req, res) {
      models.Notification.findOne({
      _id: req.query.notificationId,
      isPublished: true
    },'_id header body', function (err, Notification) {
        if (err)
          return handleInternalDBError(err, res);
        if (!Notification)
          return handleUserErrorWithCustomMessage(res, 'Invalid Notification id');
        return res.json({
          success: true,
          data: Notification
        });
      });
    }
};

function handleInternalDBError(err, res) {
    return res.status(500).json({
        success: false,
        message: err
    });
}

function handleUserErrorWithCustomMessage(res, customMessage) {
    return res.status(400).json({
        success: false,
        message: customMessage
    });
}