var models = require('../models');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/feedbacks
     * description: Feedback apis
     */

    /**
     * @swagger
     * path: /api/v1/feedbacks/create
     * operations:
     *   -  httpMethod: POST
     *      summary: Student could create and submit a feedback
     *      notes: Return result
     *      nickname: Create feedback
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: header
     *          description: Feedback header
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: body
     *          description: Feedback body (at least 20 chars)
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Create feedback */
    createFeedback: function (req, res) {
        models.Feedback.create({
            creator: req.user._id,
            header: req.body.header,
            body: req.body.body
        }, function (err, result) {
            if (err)
                return handleInternalDBError(err, res);
            return res.json({
                success: true,
                message: 'Feedback created'
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