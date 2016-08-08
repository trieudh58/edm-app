var models = require('../models');

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/course-requests
     * description: Course request apis
     */

    /**
     * @swagger
     * path: /api/v1/course-requests/create
     * operations:
     *   -  httpMethod: POST
     *      summary: Create new Course request
     *      notes: Return created Course request
     *      nickname: Create new Course request
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: x-access-token
     *          description: Your token
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Return created Course request */
    create: function (req, res) {

    }
};