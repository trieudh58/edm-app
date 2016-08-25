var models = require('../models');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/science-research-directions
     * description: Science research directions apis
     */

    /**
     * @swagger
     * path: /api/v1/science-research-directions/get-list
     * operations:
     *   -  httpMethod: GET
     *      summary: Get science research directions list
     *      notes: Get science research directions list
     *      nickname: Get science research directions list
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get science research directions list */
    getList: function (req, res) {
        models.SRDirection.find({}).sort({
            workplace: 'asc'
        }).exec(function (err, SRDirections) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.json({
                    success: true,
                    data: SRDirections
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/science-research-directions/get-by-lecturer
     * operations:
     *   -  httpMethod: GET
     *      summary: Get science research direction by lecturer
     *      notes: Get science research direction by lecturer
     *      nickname: Get science research direction by lecturer
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: lecturer
     *          description: Lecturer name
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    /* Get science research direction by lecturer */
    getByLecturer: function (req, res) {
        models.SRDirection.findOne({
            lecturer: req.query.lecturer
        }).sort({
            workplace: 'asc'
        }).exec(function (err, SRDirection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else if (!SRDirection) {
                return res.status(400).json({
                    success: false,
                    message: 'Lecturer does not exist.'
                });
            }
            else {
                return res.json({
                    success: true,
                    data: SRDirection
                });
            }
        });
    },

    /**
     * @swagger
     * path: /api/v1/science-research-directions/get-by-workplace
     * operations:
     *   -  httpMethod: GET
     *      summary: Get science research direction by workplace
     *      notes: Get science research direction by workplace
     *      nickname: Get science research direction by workplace
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: workplace
     *          description: Workplace name
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    /* Get science research direction by lecturer */
    getByWorkplace: function (req, res) {
        models.SRDirection.find({
            workplace: req.query.workplace
        }).sort({
            lecturer: 'asc'
        }).exec(function (err, SRDirections) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.json({
                    success: true,
                    data: SRDirections
                });
            }
        });
    }
};