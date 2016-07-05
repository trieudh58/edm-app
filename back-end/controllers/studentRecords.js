var StudentRecord = require('../models').StudentRecord;

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
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get student record */
    get: function (req, res) {
        StudentRecord.findOne({
            studentCode: req.user.studentCode
        }, function (err, studentRecord) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!studentRecord) {
                res.json({
                    success: false,
                    message: 'Record does not exist.'
                });
            }
            else {
                res.json({
                    success: true,
                    data: studentRecord
                });
            }
        });
    }
}