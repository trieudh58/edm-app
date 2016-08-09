var models = require('../models');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/course-requests
     * description: Course request apis
     */

    /**
     * @swagger
     * path: /api/v1/course-requests/create
     * operations:
     *   -  httpMethod: POST
     *      summary: Create new Course request
     *      notes: Return created Course request
     *      nickname: Create new Course request
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: subjectId
     *          description: Subject id
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Return created Course request */
    create: function (req, res) {
        models.Subject.findOne({
            _id: req.body.subjectId
        }, 'code', function (err, subject) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!subject) {
                res.json({
                    success: false,
                    message: 'Invalid subject id.'
                });
            }
            else {
                var semester = '';
                var systemTime = new Date();
                if (systemTime.getMonth() >= 5 && systemTime.getMonth() <= 10) {
                    semester += '1.' + systemTime.getFullYear().toString() + '-' + (systemTime.getFullYear() + 1).toString();
                }
                else {
                    semester += '2.' + (systemTime.getFullYear() - 1).toString() + '-' + systemTime.getFullYear().toString();
                }
                models.CourseRequest.create({
                    creator: req.user._id,
                    courseInfo: {
                        subject: req.body.subjectId,
                        semester: semester
                    },
                    status: 'Pending'
                }, function (err, courseRequest) {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            message: err
                        });
                    }
                    else {
                        courseRequest.update({
                            $push: {
                                joiners: {
                                    joiner: req.user._id
                                }
                            }
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
                                    message: 'Course request created.'
                                });
                            }
                        });
                    }
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/course-requests/get-own-created
     * operations:
     *   -  httpMethod: GET
     *      summary: Get created Course requests
     *      notes: Return created Course requests (by current user only)
     *      nickname: Get created Course requests
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return created Course request (by current user) */
    getOwnCreatedCRs: function (req, res) {
        models.CourseRequest.find({
            creator: req.user._id
        }, '-creator -__v').populate('courseInfo.subject', 'code name').sort({
            updatedAt: 'desc'
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
     * path: /api/v1/course-requests/get-own-public
     * operations:
     *   -  httpMethod: GET
     *      summary: Get public Course requests
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
    /* Return public Course request (by current user) */
    getOwnPublicCRs: function (req, res) {
        models.CourseRequest.find({
            creator: req.user._id,
            status: 'Public'
        }, '-__v').populate('courseInfo.subject', 'code name').sort({
            updatedAt: 'desc'
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
     * path: /api/v1/course-requests/get-own-pending
     * operations:
     *   -  httpMethod: GET
     *      summary: Get pending Course requests
     *      notes: Return pending Course requests
     *      nickname: Get pending Course requests
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return pending Course request (by current user) */
    getOwnPendingCRs: function (req, res) {
        models.CourseRequest.find({
            creator: req.user._id,
            status: 'Pending'
        }, '-__v').populate('courseInfo.subject', 'code name').sort({
            updatedAt: 'desc'
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
    }
};