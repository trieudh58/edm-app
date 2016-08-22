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
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: subjectId
     *          description: Subject id
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: expectedTime
     *          description: Expected time
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: reason
     *          description: Reason for request course
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
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!subject) {
                return res.status(400).json({
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
                    reason: req.body.reason,
                    courseInfo: {
                        subject: req.body.subjectId,
                        semester: semester,
                        expectedTime: req.body.expectedTime
                    },
                    status: 'Pending'
                }, function (err, courseRequest) {
                    if (err) {
                        return res.status(500).json({
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
                                return res.status(500).json({
                                    success: false,
                                    message: err
                                });
                            }
                            else {
                                return res.json({
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
     * path: /api/v1/course-requests/join
     * operations:
     *   -  httpMethod: PUT
     *      summary: Join one public Course request (created by other users)
     *      notes: Return result
     *      nickname: Join one public Course request
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: courseRequestId
     *          description: Course request id
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Return join result */
    join: function (req, res) {
        models.CourseRequest.findById(req.body.courseRequestId, function (err, cr) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!cr) {
                return res.status(400).json({
                    success: false,
                    message: 'Course request does not exist.'
                });
            }
            else if (cr.creator == req.user._id) {
                return res.status(400).json({
                    success: false,
                    message: 'Can not join Course request that created by your own.'
                });
            }
            else if (cr.status != 'Public') {
                return res.status(400).json({
                    success: false,
                    message: 'Course request is not public.'
                });
            }
            else {
                cr.update({
                    $push: {
                        joiners: {
                            joiner: req.user._id
                        }
                    }
                }, function (err) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err
                        });
                    }
                    else {
                        return res.json({
                            success: true,
                            message: 'Successfully join Course request.'
                        });
                    }
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/course-requests/undo-join
     * operations:
     *   -  httpMethod: PUT
     *      summary: Undo join one public Course request (created by other users)
     *      notes: Return result
     *      nickname: Undo join one public Course request
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: courseRequestId
     *          description: Course request id
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Return undo-join result */
    undoJoin: function (req, res) {
        models.CourseRequest.findById({
            _id: req.body.courseRequestId,
            joiners: {
                $elemMatch: {
                    joiner: req.user._id
                }
            }
        }, function (err, cr) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!cr) {
                return res.status(400).json({
                    success: false,
                    message: 'Course request does not exist or joiner is not match.'
                });
            }
            else if (cr.creator == req.user._id) {
                return res.status(400).json({
                    success: false,
                    message: 'Can not undo-join Course request that created by your own. Delete it instead'
                });
            }
            else if (cr.status != 'Public') {
                return res.status(400).json({
                    success: false,
                    message: 'Course request is not public.'
                });
            }
            else {
                cr.update({
                    $pull: {
                        joiners: {
                            joiner: req.user._id
                        }
                    }
                }, function (err) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err
                        });
                    }
                    else {
                        return res.json({
                            success: true,
                            message: 'Successfully undo-join Course request.'
                        });
                    }
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/course-requests/get-by-id
     * operations:
     *   -  httpMethod: GET
     *      summary: Get public/own Course request
     *      notes: Return public/own Course request
     *      nickname: Get public/own Course request
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: courseRequestId
     *          description: Course request id
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    /* Return one public/own Course request (by id) */
    getById: function (req, res) {
        models.CourseRequest.findById(req.query.courseRequestId).populate('courseInfo.subject', 'code name').populate('creator', 'email').exec(function (err, cr) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (cr.creator == req.user._id || cr.status == 'Public') {
                return res.json({
                    success: true,
                    data: cr
                });
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: 'Course request is not public or not created by you.'
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/course-requests/get-all-public
     * operations:
     *   -  httpMethod: GET
     *      summary: Get all public Course requests
     *      notes: Return all public Course requests
     *      nickname: Get all public Course requests
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return all public Course request created by all users */
    getAllPublicCRs: function (req, res) {
        models.CourseRequest.find({
            status: 'Public'
        }, '-__v').populate('courseInfo.subject', 'code name').populate('creator', 'email').sort({
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
     * path: /api/v1/course-requests/get-own-denied
     * operations:
     *   -  httpMethod: GET
     *      summary: Get denied Course requests
     *      notes: Return denied Course requests
     *      nickname: Get denied Course requests
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return denied Course request (by current user) */
    getOwnDeniedCRs: function (req, res) {
        models.CourseRequest.find({
            creator: req.user._id,
            status: 'Denied'
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
     * path: /api/v1/course-requests/delete-one
     * operations:
     *   -  httpMethod: DELETE
     *      summary: Delete one Course request
     *      notes: Return result
     *      nickname: Delete one Course request
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
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    /* Return delete result */
    deleteOne: function (req, res) {
        models.CourseRequest.findOne({
            _id: req.query.courseRequestId,
            creator: req.user._id
        }, function(err, cr) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!cr) {
                res.json({
                    success: false,
                    message: 'Course request does not exist or invalid user id.'
                });
            }
            else {
                cr.remove(function (err) {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            message: err
                        });
                    }
                    else {
                        res.json({
                            success: true,
                            message: 'Course request deleted.'
                        });
                    }
                });
            }
        });
    }
};