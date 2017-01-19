var models = require('../../models');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/admin/feedbacks
     * description: Feedback apis (for admin only)
     */

    /**
     * @swagger
     * path: /api/v1/admin/feedbacks/read-all
     * operations:
     *   -  httpMethod: GET
     *      summary: Admin reads all feedbacks in database
     *      notes: Return all feedback records
     *      nickname: Read all feedbacks
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Read all feedbacks */
    readAllFeedbacks: function (req, res) {
        models.Feedback.find({}, function (err, feedbacks) {
            if (err)
                return handleInternalDBError(err, res);
            return res.json({
                success: true,
                data: feedbacks
            });
        })
    },

    /**
     * @swagger
     * path: /api/v1/admin/feedbacks/delete-one-by-id
     * operations:
     *   -  httpMethod: DELETE
     *      summary: Admin deletes one feedback
     *      notes: Return result
     *      nickname: Delete one feedback by id
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: feedbackId
     *          description: Feedback id to be deleted
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Delete one feedback by id */
    deleteOneById: function (req, res) {
        models.Feedback.remove({
            _id: req.body.feedbackId
        }, function (err, deletedRecord) {
            if (err)
                return handleInternalDBError(err, res);
            if (!deletedRecord.result.n)
                return handleUserErrorWithCustomMessage(res, 'Invalid id. No feedback deleted');
            return res.json({
                success: true,
                message: 'Feedback deleted'
            });
        })
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