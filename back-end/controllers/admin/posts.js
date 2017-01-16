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
    },

    /**
     * @swagger
     * path: /api/v1/admin/posts/update-header
     * operations:
     *   -  httpMethod: PUT
     *      summary: Admin update a post header
     *      notes: Return result
     *      nickname: Update post header
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: postId
     *          description: Post id
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: newHeader
     *          description: New post header
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Update a post header */
    updatePostHeader: function (req, res) {
        models.Post.findById(req.body.postId, function (err, post) {
            if (err)
                return handleInternalDBError(err, res);
            if (!post)
                return handleUserErrorWithCustomMessage(res, 'Invalid post id');
            return post.update({
                header: req.body.newHeader
            }, function (err) {
                if (err)
                    return handleInternalDBError(err, res);
                return res.json({
                    success: true,
                    message: 'Post header updated'
                });
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/posts/update-body
     * operations:
     *   -  httpMethod: PUT
     *      summary: Admin update a post body
     *      notes: Return result
     *      nickname: Update post body
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: postId
     *          description: Post id
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: newBody
     *          description: New post body
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Update a post body */
    updatePostBody: function (req, res) {
        models.Post.findById(req.body.postId, function (err, post) {
            if (err)
                return handleInternalDBError(err, res);
            if (!post)
                return handleUserErrorWithCustomMessage(res, 'Invalid post id');
            return post.update({
                body: req.body.newBody
            }, function (err) {
                if (err)
                    return handleInternalDBError(err, res);
                return res.json({
                    success: true,
                    message: 'Post body updated'
                });
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/posts/delete
     * operations:
     *   -  httpMethod: DELETE
     *      summary: Admin delete a post
     *      notes: Return result
     *      nickname: Delete post
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: postId
     *          description: Post id
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Delete a post */
    delete: function (req, res) {
        models.Post.findByIdAndRemove(req.body.postId, function (err, deletedPost) {
            if (err)
                return handleInternalDBError(err, res);
            if (!deletedPost)
                return handleUserErrorWithCustomMessage(res, 'Post does not exists');
            return res.json({
                success: true,
                message: 'Post deleted'
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