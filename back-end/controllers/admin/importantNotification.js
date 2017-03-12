var models = require('../../models');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/admin/important-notification
     * description: Post apis (for admin only)
     */

    /**
     * @swagger
     * path: /api/v1/admin/important-notification/get-all
     * operations:
     *   -  httpMethod: GET
     *      summary: Admin get all important-notification
     *      notes: Return all important-notification
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
    /* Get all important-notification */
    getAll: function (req, res) {
        models.Post.find({}, function (err, importantNotification) {
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
     * path: /api/v1/admin/important-notification/get-all-published
     * operations:
     *   -  httpMethod: GET
     *      summary: Admin get all published important-notification
     *      notes: Return all published important-notification
     *      nickname: Get all published important-notification
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get all published important-notification */
    getAllPublished: function (req, res) {
        models.Post.find({
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
     * path: /api/v1/admin/important-notification/get-all-unpublished
     * operations:
     *   -  httpMethod: GET
     *      summary: Admin get all unpublished important-notification
     *      notes: Return all unpublished important-notification
     *      nickname: Get all unpublished important-notification
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get all unpublished important-notification */
    getAllUnpublished: function (req, res) {
        models.Post.find({
            isPublished: false
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
     * path: /api/v1/admin/important-notification/create
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
            sumary: req.body.body.substring(0, 200) + '...',
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
     * path: /api/v1/admin/important-notification/create-and-publish
     * operations:
     *   -  httpMethod: POST
     *      summary: Admin create and publish a post
     *      notes: Return result
     *      nickname: Create and publish post
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
    /* Create and publish a post */
    createAndPublish: function (req, res) {
        models.Post.create({
            creator: req.user._id,
            header: req.body.header,
            sumary: req.body.body.substring(0, 200) + '...',
            body: req.body.body,
            isPublished: true
        }, function (err) {
            if (err)
                return handleInternalDBError(err, res);
            return res.json({
                success: true,
                message: 'Post created and published'
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/important-notification/update-header
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
     * path: /api/v1/admin/important-notification/update-body
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
                body: req.body.newBody,
                sumary: req.body.newBody.substring(0, 200) + '...',
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
     * path: /api/v1/admin/important-notification/publish-one
     * operations:
     *   -  httpMethod: PUT
     *      summary: Admin publish a post
     *      notes: Return result
     *      nickname: Publish a post
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
    /* Publish a post */
    publishOne: function (req, res) {
        models.Post.findById(req.body.postId, function (err, post) {
            if (err)
                return handleInternalDBError(err, res);
            if (!post)
                return handleUserErrorWithCustomMessage(res, 'Invalid post id');
            if (post.isPublished)
                return handleUserErrorWithCustomMessage(res, 'Post is already published');
            return post.update({
                isPublished: true
            }, function (err) {
                if (err)
                    return handleInternalDBError(err, res);
                return res.json({
                    success: true,
                    message: 'Post is now published'
                });
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/important-notification/unpublish-one
     * operations:
     *   -  httpMethod: PUT
     *      summary: Admin unpublish a post
     *      notes: Return result
     *      nickname: Unpublish a post
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
    /* Unpublish a post */
    unpublishOne: function (req, res) {
        models.Post.findById(req.body.postId, function (err, post) {
            if (err)
                return handleInternalDBError(err, res);
            if (!post)
                return handleUserErrorWithCustomMessage(res, 'Invalid post id');
            if (!post.isPublished)
                return handleUserErrorWithCustomMessage(res, 'Post is already unpublished');
            return post.update({
                isPublished: false
            }, function (err) {
                if (err)
                    return handleInternalDBError(err, res);
                return res.json({
                    success: true,
                    message: 'Post is now unpublished'
                });
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/important-notification/publish-all
     * operations:
     *   -  httpMethod: PUT
     *      summary: Admin publish all important-notification
     *      notes: Return result
     *      nickname: Publish all important-notification
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Publish all important-notification */
    publishAll: function (req, res) {
        models.Post.update({
            $or: [
                { isPublished: false },
                { isPublished: null }
            ]
        }, {
            isPublished: true
        }, {
            multi: true
        }, function (err, result) {
            if (err)
                return handleInternalDBError(err, res);
            if (!result.nModified)
                return handleUserErrorWithCustomMessage(res, 'All important-notification are already published');
            return res.json({
                success: true,
                message: 'All important-notification are now published'
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/important-notification/unpublish-all
     * operations:
     *   -  httpMethod: PUT
     *      summary: Admin unpublish all important-notification
     *      notes: Return result
     *      nickname: Unpublish all important-notification
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Unpublish all important-notification */
    unpublishAll: function (req, res) {
        models.Post.update({
            isPublished: true
        }, {
            isPublished: false
        }, {
            multi: true
        }, function (err, result) {
            if (err)
                return handleInternalDBError(err, res);
            if (!result.nModified)
                return handleUserErrorWithCustomMessage(res, 'All important-notification are already unpublished');
            return res.json({
                success: true,
                message: 'All important-notification are now unpublished'
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/important-notification/delete
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