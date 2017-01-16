var models = require('../models');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/posts
     * description: Posts apis
     */

    /**
     * @swagger
     * path: /api/v1/posts/get-all
     * operations:
     *   -  httpMethod: GET
     *      summary: Get all posts
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
     * path: /api/v1/posts/get-all-post-headers
     * operations:
     *   -  httpMethod: GET
     *      summary: Get all post headers
     *      notes: Return all post headers
     *      nickname: Get all post headers
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get all post headers */
    getAllPostHeaders: function (req, res) {
      models.Post.find({}, '_id header', function (err, posts) {
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
     * path: /api/v1/posts/get-one-by-id
     * operations:
     *   -  httpMethod: GET
     *      summary: Get one post by id
     *      notes: Return one post
     *      nickname: Get one post by id
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
    /* Get one post by id */
    getOneById: function (req, res) {
      models.Post.findById(req.query.postId, function (err, post) {
        if (err)
          return handleInternalDBError(err, res);
        if (!post)
          return handleUserErrorWithCustomMessage(res, 'Invalid post id');
        return res.json({
          success: true,
          data: post
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