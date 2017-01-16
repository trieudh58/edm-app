var models = require('../../models');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/admin/posts
     * description: Post apis (for admin only)
     */

    /**
     * @swagger
     * path: /api/v1/admin/posts/create
     * operations:
     *   -  httpMethod: POST
     *      summary: Admin create a post
     *      notes: Return result
     *      nickname: Create post
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: header
     *          description: Post header
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: body
     *          description: Post body (at least 20 chars)
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Create a post */
    create: function (req, res) {
        models.Post.create({
            creator: req.user._id,
            header: req.body.header,
            body: req.body.body
        }, function (err) {
            if (err)
                return handleInternalDBError(err, res);
            return res.json({
                success: true,
                message: 'Post created'
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