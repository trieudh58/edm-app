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
            else {
                return res.json({
                    success: true,
                    data: studentRecord
                });
            }
        });
    }
};