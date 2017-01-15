var models = require('../models');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/comments
     * description: Comments apis
     */

    /**
     * @swagger
     * path: /api/v1/comments/get-by-subject-code
     * operations:
     *   -  httpMethod: GET
     *      summary: Get comments by subject code
     *      notes: Return comments
     *      nickname: Get comments
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: subjectCode
     *          description: Subject code
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    /* Return comments */
    getComments: function (req, res) {
      return models.Subject.findOne({
        code: req.query.subjectCode
      }, '_id name', function (err, subject) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err
          });
        }
        if (!subject) {
          return res.status(400).json({
            success: false,
            message: 'Invalid subject code'
          });
        }
        models.Comment.findOne({
          subject: subject._id
        }, '-_id -createdAt -updatedAt')
          .populate('subject', '-createdAt -updatedAt')
          .populate('comments.user', 'personalInfo.fullName personalInfo.className')
          .exec(function (err, record) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            });
          }
          return res.json({
            success: true,
            data: record
          });
        });
      });
    },

    /**
     * @swagger
     * path: /api/v1/comments/create-one
     * operations:
     *   -  httpMethod: POST
     *      summary: Create one comment
     *      notes: Return result
     *      nickname: Create one comment
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: subjectCode
     *          description: Subject code
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: commentBody
     *          description: Body of the comment
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Return creating result */
    createOneComment: function (req, res) {
      models.Subject.findOne({
        code: req.body.subjectCode
      }, '_id', function (err, subject) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err
          });
        }
        if (!subject) {
          return res.status(400).json({
            success: false,
            message: 'Invalid subject code'
          });
        }
        models.Comment.findOne({
          subject: subject._id
        }, function (err, record) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err
            });
          }
          if (!record) {
            return models.Comment.create({
              subject: subject._id,
              comments: [{
                user: req.user._id,
                commentBody: req.body.commentBody
              }]
            }, function (err, result) {
              if (err) {
                return res.status(500).json({
                  success: false,
                  message: err
                });
              }
              return res.json({
                success: true,
                message: 'Comment created'
              });
            });
          }
          // If the record for that subject already exists, push the comment in to comments array
          return models.Comment.update({
            subject: subject._id
          }, {
            $push: {
              comments: {
                user: req.user._id,
                commentBody: req.body.commentBody
              }
            }
          }, function (err, result) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err
              });
            }
            return res.json({
              success: true,
              message: 'Comment created'
            });
          });
        });
      });
    }
};