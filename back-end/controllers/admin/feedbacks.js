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
                handleInternalDBError(err, res);
            return res.json({
                success: true,
                data: feedbacks
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