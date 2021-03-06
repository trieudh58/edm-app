var Subject = require('../models').Subject;

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/subjects
     * description: Subjects apis
     */

    /**
     * @swagger
     * path: /api/v1/subjects/get-names-and-credits
     * operations:
     *   -  httpMethod: GET
     *      summary: Get subject name and credit in list of subjects
     *      notes: Return array of subjects' names and credits
     *      nickname: Get subject names and credits
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return subjects' names and credits */
    getNamesAndCredits: function (req, res) {
        Subject.find({}, 'code name details.credits', function (err, subjects) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.json({
                    success: true,
                    subjects: subjects
                });
            }
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
     *        - name: Authorization
     *          description: Bearer [accessToken]
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
        }, '-updatedAt -createdAt', function (err, subj) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!subj) {
                return res.json({
                    success: false,
                    message: 'Subject does not exist.'
                });
            }
            else {
                return res.json({
                    success: true,
                    data: subj
                });
            }
        });
    }
};