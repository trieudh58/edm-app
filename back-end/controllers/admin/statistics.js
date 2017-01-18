var models = require('../../models');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/admin/statistics
     * description: Statistics apis (for admin only)
     */

    /**
     * @swagger
     * path: /api/v1/admin/statistics/student-accounts
     * operations:
     *   -  httpMethod: GET
     *      summary: Admin could get student accounts
     *      notes: Return student accounts
     *      nickname: Get student accounts
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get statistics of student accounts */
    getStudentAccounts: function (req, res) {
        models.User.find({
            studentCode: {
                $ne: null
            }
        }, function (err, students) {
            if (err)
                return handleInternalDBError(err, res);
            var numberOfActives = 0,
                numberOfMales = 0;
            for (var i = 0; i < students.length; i++) {
                if (students[i].isActive)
                    numberOfActives++;
                if (students[i].personalInfo.gender)
                    numberOfMales++;
            }
            return res.json({
                success: true,
                studentAccountStatistics: {
                    total: students.length,
                    status: {
                        active: numberOfActives,
                        inactive: students.length - numberOfActives,
                    },
                    gender: {
                        male: numberOfMales,
                        female: students.length- numberOfMales
                    }
                }
            });
        });
    },
    
    /**
     * @swagger
     * path: /api/v1/admin/statistics/student-quantity-grouped-by-management-class
     * operations:
     *   -  httpMethod: GET
     *      summary: Admin could get student quantity grouped by management class
     *      notes: Return student quantity grouped by management class
     *      nickname: Get student quantity grouped by management class
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get statistics of student quantity grouped by management class */
    getStudentQuantityGroupedByManagementClass: function (req, res) {
        models.User.aggregate([
            {
                $match: {
                    isAdmin: false
                }
            },
            {
                $group: {
                    _id: '$personalInfo.className',
                    count: { $sum: 1 }
                }
            }
        ], function (err, result) {
            if (err)
                return handleInternalDBError(err, res);
            var managementClasses = [];
            for (var i = 0; i < result.length; i++) {
                managementClasses.push({
                    className: result[i]._id,
                    numberOfStudents: result[i].count
                });
            }
            return res.json({
                success: true,
                data: managementClasses
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/statistics/student-quantity-grouped-by-academic-year
     * operations:
     *   -  httpMethod: GET
     *      summary: Admin could get student quantity grouped by academic year
     *      notes: Return student quantity grouped by academic year
     *      nickname: Get student quantity grouped by academic year
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get statistics of student quantity grouped by academic year */
    getStudentQuantityGroupedByAcademicYear: function (req, res) {
        models.User.aggregate([
            {
                $match: {
                    isAdmin: false
                }
            },
            {
                $group: {
                    _id: '$personalInfo.className',
                    count: { $sum: 1 }
                }
            }
        ], function (err, result) {
            if (err)
                return handleInternalDBError(err, res);
            var academicYears = [];
            for (var i = 0; i < result.length; i++) {
                academicYears.push({
                    academicYear: result[i]._id.split('/')[0],
                    numberOfStudents: result[i].count
                });
            }
            academicYears.forEach(function (el, idx) {
                for (var i = idx + 1; i < academicYears.length; i++) {
                    if (academicYears[i].academicYear === el.academicYear) {
                        el.numberOfStudents = parseInt(el.numberOfStudents) + parseInt(academicYears[i].numberOfStudents);
                        academicYears.splice(i, 1);
                    }
                }
            });
            return res.json({
                success: true,
                data: academicYears
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/admin/statistics/notification-quantity
     * operations:
     *   -  httpMethod: GET
     *      summary: Admin could get notification quantity
     *      notes: Return notification quantity
     *      nickname: Get notification quantity
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get statistics of notification quantity */
    getNotificationQuantity: function (req, res) {
        models.Notification.find({}, 'isSent', function (err, notifications) {
            if (err)
                return handleInternalDBError(err, res);
            var sentNotifications = 0;
            notifications.forEach(function (el) {
                if (el.isSent)
                    sentNotifications++;
            });
            return res.json({
                success: true,
                notificationStatistics: {
                    total: notifications.length,
                    isSent: sentNotifications,
                    isUnsent: notifications - sentNotifications
                }
            })
        })
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