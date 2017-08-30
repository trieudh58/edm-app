var models = require('../../models');
var config = require('../../config');
module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/admin/posts
     * description: Post apis (for admin only)
     */

    /**
     * @swagger
     * path: /api/v1/admin/posts/get-all
     * operations:
     *   -  httpMethod: GET
     *      summary: Admin get all posts
     *      notes: Return all posts
     *      nickname: Get all posts
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get all posts */
    getAll: function (req, res) {
        models.Post.find({}, function (err, posts) {
            if (err)
                return handleInternalDBError(err, res);
            return res.json({
                success: true,
                data: posts
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/posts/get-all-published
     * operations:
     *   -  httpMethod: GET
     *      summary: Admin get all published posts
     *      notes: Return all published posts
     *      nickname: Get all published posts
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get all published posts */
    getAllPublished: function (req, res) {
        models.Post.find({
            isPublished: true
        }, function (err, posts) {
            if (err)
                return handleInternalDBError(err, res);
            return res.json({
                success: true,
                data: posts
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/posts/get-all-unpublished
     * operations:
     *   -  httpMethod: GET
     *      summary: Admin get all unpublished posts
     *      notes: Return all unpublished posts
     *      nickname: Get all unpublished posts
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get all unpublished posts */
    getAllUnpublished: function (req, res) {
        models.Post.find({
            isPublished: false
        }, function (err, posts) {
            if (err)
                return handleInternalDBError(err, res);
            return res.json({
                success: true,
                data: posts
            });
        });
    },

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
     *        - name: coverImage
     *          description: cover picture
     *          paramType: formData
     *          required: true
     *          dataType: file
     */
    /* Create a post */
    create: function (req, res) {
        models.Post.create({
            creator: req.user._id,
            header: req.body.header,
            body: req.body.body,
            sumary: req.body.body.substring(0, 200) + '...',
            coverImage:config.app.url + ':' + config.app.port + '/images/' + req.file.filename
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
     * path: /api/v1/admin/posts/create-and-publish
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
     *        - name: coverImage
     *          description: cover picture
     *          paramType: formData
     *          required: true
     *          dataType: file
     */
    /* Create and publish a post */
    createAndPublish: function (req, res) {
        models.Post.create({
            creator: req.user._id,
            header: req.body.header,
            body: req.body.body,
            sumary: req.body.body.substring(0, 200) + '...',
            coverImage:config.app.url + ':' + config.app.port + '/images/' + req.file.filename,
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
     * path: /api/v1/admin/posts/publish-one
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
     * path: /api/v1/admin/posts/unpublish-one
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
     * path: /api/v1/admin/posts/publish-all
     * operations:
     *   -  httpMethod: PUT
     *      summary: Admin publish all posts
     *      notes: Return result
     *      nickname: Publish all posts
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Publish all posts */
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
                return handleUserErrorWithCustomMessage(res, 'All posts are already published');
            return res.json({
                success: true,
                message: 'All posts are now published'
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/posts/unpublish-all
     * operations:
     *   -  httpMethod: PUT
     *      summary: Admin unpublish all posts
     *      notes: Return result
     *      nickname: Unpublish all posts
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Unpublish all posts */
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
                return handleUserErrorWithCustomMessage(res, 'All posts are already unpublished');
            return res.json({
                success: true,
                message: 'All posts are now unpublished'
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
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    /* Delete a post */
    delete: function (req, res) {
        models.Post.findByIdAndRemove(req.query.postId, function (err, deletedPost) {
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