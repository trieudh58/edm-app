var models = require('../models');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/education-programs
     * description: Education programs apis
     */

    /**
     * @swagger
     * path: /api/v1/education-programs/get-eps
     * operations:
     *   -  httpMethod: GET
     *      summary: Get information about education programs
     *      notes: Return information about education programs
     *      nickname: Get education program information
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return education program information */
    getEPs: function (req, res) {
        models.EducationProgram.find({}, function (err, eps) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.json({
                    success: true,
                    data: eps
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/education-programs/get-kus
     * operations:
     *   -  httpMethod: GET
     *      summary: Get information about knowledge units
     *      notes: Return information about knowledge units
     *      nickname: Get knowledge unit information
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return knowledge unit information */
    getKUs: function (req, res) {
        models.KnowledgeUnit.find({}, function (err, kus) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.json({
                    success: true,
                    data: kus
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/education-programs/get-ep-detail-by-code
     * operations:
     *   -  httpMethod: GET
     *      summary: Get education program detail
     *      notes: Return education program detail
     *      nickname: Get education program detail
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: epCode
     *          description: Education program code (from 1 to 6)
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    /* Return education program detail (by code) */
    getEPDetailByCode: function (req, res) {
        models.EPDetail.find({
            epCode: req.query.epCode
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
                return res.json({
                    success: true,
                    data: epDetail
                });
            }
        });
    }
};