var Subject = require('../models').Subject;

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/subjects
     * description: Subjects apis
     */

    /**
     * @swagger
     * path: /api/v1/subjects/get-names
     * operations:
     *   -  httpMethod: GET
     *      summary: Get subject name in list of subjects
     *      notes: Return array of subjects' names
     *      nickname: Get subject names
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return subjects' names*/
    getName: function (req, res) {
        Subject.find({}, '-_id code name', function (err, subjects) {
            if (err) {
                res.status(500).json({
                    sucess: false,
                    message: err
                });
            }
            res.json({
                success: true,
                subjects: subjects
            });
        });
    },

    /**
     * @swagger
     * path: /api/v1/subjects/get-info
     * operations:
     *   -  httpMethod: GET
     *      summary: Get information of a specific subject
     *      notes: Return subject's detail
     *      nickname: Subject information
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: subjectCode
     *          description: Subject code
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    /* Return one subject's information */
    getInfo: function (req, res) {
        Subject.findOne({
            code: req.query.subjectCode
        }, '-_id -updatedAt -createdAt -__v', function (err, subj) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err
                });
            }
            res.json({
                success: true,
                data: subj
            });
        });
    }
};