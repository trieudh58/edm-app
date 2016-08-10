var models = require('../../models');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/admin/course-requests
     * description: Course request apis (for admin)
     */

    /**
     * @swagger
     * path: /api/v1/admin/course-requests/get-all-public
     * operations:
     *   -  httpMethod: GET
     *      summary: Get all public Course requests
     *      notes: Return public Course requests
     *      nickname: Get public Course requests
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get all public Course requests */
    getAllPublic: function (req, res) {
        models.CourseRequest.find({
            status: 'Public'
        }, '-__v').populate('creator', 'email').populate('joiners.joiner', 'email').sort({
            createdAt: 'desc'
        }).exec(function (err, crs) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.json({
                    success: true,
                    data: crs
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/course-requests/public-one
     * operations:
     *   -  httpMethod: PUT
     *      summary: Public one pending Course request
     *      notes: Return result
     *      nickname: Public one pending Course request
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: courseRequestId
     *          description: Course request id
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Public one Course request */
    publicOne: function (req, res) {
        models.CourseRequest.findById(req.body.courseRequestId, function (err, cr) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!cr) {
                res.json({
                    success: false,
                    message: 'Course request does not exist.'
                });
            }
            else if (cr.status == 'Public') {
                res.json({
                    success: false,
                    message: 'Course request is already public.'
                });
            }
            else {
                cr.update({
                    status: 'Public'
                }, function (err) {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            message: err
                        });
                    }
                    else {
                        res.json({
                            success: true,
                            message: 'Course request is now public'
                        });
                    }
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/course-requests/add-to-pending
     * operations:
     *   -  httpMethod: PUT
     *      summary: Add a public Course request to pending
     *      notes: Return result
     *      nickname: Add a public Course request to pending
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: courseRequestId
     *          description: Course request id
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Add one Course request to pending */
    addToPending: function (req, res) {
        models.CourseRequest.findById(req.body.courseRequestId, function (err, cr) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!cr) {
                res.json({
                    success: false,
                    message: 'Course request does not exist.'
                });
            }
            else if (cr.status == 'Pending') {
                res.json({
                    success: false,
                    message: 'Course request is already pending.'
                });
            }
            else {
                cr.update({
                    status: 'Pending'
                }, function (err) {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            message: err
                        });
                    }
                    else {
                        res.json({
                            success: true,
                            message: 'Course request is now pending'
                        });
                    }
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/course-requests/deny-one
     * operations:
     *   -  httpMethod: PUT
     *      summary: Deny one pending request
     *      notes: Return result
     *      nickname: Deny one pending request
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: courseRequestId
     *          description: Course request id
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Deny one Course request */
    denyOne: function (req, res) {
        models.CourseRequest.findById(req.body.courseRequestId, function (err, cr) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!cr) {
                res.json({
                    success: false,
                    message: 'Course request does not exist.'
                });
            }
            else if (cr.status == 'Denied') {
                res.json({
                    success: false,
                    message: 'Course request is already denied.'
                });
            }
            else {
                cr.update({
                    status: 'Denied'
                }, function (err) {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            message: err
                        });
                    }
                    else {
                        res.json({
                            success: true,
                            message: 'Course request is now denied'
                        });
                    }
                });
            }
        });
    }
};