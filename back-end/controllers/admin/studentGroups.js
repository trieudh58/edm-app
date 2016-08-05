var models = require('../../models/index');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/admin/student-groups
     * description: Student groups apis (for admin)
     */

    /**
     * @swagger
     * path: /api/v1/admin/student-groups/get-all
     * operations:
     *   -  httpMethod: GET
     *      summary: Get all student groups
     *      notes: Return student groups
     *      nickname: Get student groups
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return student groups */
    getAll: function (req, res) {
        models.StudentGroup.find({}, '-__v', function (err, groups) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else {
                res.json({
                    success: true,
                    data: groups
                });
            }
        });
    }
};