var models = require('../models');

module.exports = {

    /**
     * @swagger
     * resourcePath: /api/v1/student-records
     * description: StudentRecords apis
     */

    /**
     * @swagger
     * path: /api/v1/student-records/get
     * operations:
     *   -  httpMethod: GET
     *      summary: Get student record
     *      notes: Require access token
     *      nickname: Get student record
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get student record */
    get: function (req, res) {
        models.StudentRecord.findOne({
            studentCode: req.user.studentCode
        }, function (err, studentRecord) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!studentRecord) {
                return res.status(400).json({
                    success: false,
                    message: 'Record does not exist.'
                });
            }
            // Fake data if record is empty
            else if (!studentRecord.length) {
                models.EPDetail.find({
                    epCode: 1
                }).sort({
                    kuCode: 'asc'
                }).exec(function (err, epDetail) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err
                        });
                    }
                    else if (!epDetail || !epDetail.length) {
                        return res.status(400).json({
                            success: false,
                            message: 'Invalid code.'
                        });
                    }
                    else {
                        var allSubjects = [];
                        for (var i = 0; i < epDetail.length; i++) {
                            allSubjects = allSubjects.concat(epDetail[i].subjects);
                        }
                        var semesters = [];
                        for (var j = 0; j < allSubjects.length; j++) {
                            var semester = j%8 + 1;
                            if (semester <= 3) {
                                semesters.push({
                                    subjectCode: allSubjects[j],
                                    attempt: [{
                                        score: (Math.random() * 9 + 1).toFixed(2),
                                        semester: semester
                                    }],
                                });
                            }
                        }
                        return res.json({
                            success: true,
                            data: {
                                studentCode: req.user.studentCode,
                                record: semesters
                            }
                        });
                    }
                });
            }
            else {
                return res.json({
                    success: true,
                    data: studentRecord
                });
            }
        });
    }
};