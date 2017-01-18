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
                    total: students.length + 1,
                    status: {
                        active: numberOfActives,
                        inactive: students.length + 1 - numberOfActives,
                    },
                    gender: {
                        male: numberOfMales,
                        female: students.length + 1 - numberOfMales
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