var config = require('../config')
    
module.exports= {
    /**
     * @swagger
     * resourcePath: /api/v1/upload
     * description: Users apis
     */

    /**
     * @swagger
     * path: /api/v1/upload/upload-image
     * operations:
     *   -  httpMethod: POST
     *      summary: Upload any image and get url
     *      notes: Return message
     *      nickname: Upload
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: image
     *          description: image
     *          paramType: formData
     *          required: true
     *          dataType: file
     */
    /* Upload image of a user. Return uploaded image url */
    uploadImage: function (req, res) {
        if (req.file) {
            return res.status(500).json({
                success: true,
                imageUrl:config.app.url + ':' + config.app.port + '/images/' + req.file.filename
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'Invalid file type or file size'
            });
        }
    },
    /**
     * @swagger
     * path: /api/v1/upload/upload-file
     * operations:
     *   -  httpMethod: POST
     *      summary: Upload file
     *      notes: Return message
     *      nickname: Upload
     *      consumes:
     *        - application/x-www-form-urlencoded
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: file
     *          description: file
     *          paramType: formData
     *          required: true
     *          dataType: file
     */
    /* Upload file of a user. Return uploaded file url */
    uploadFile: function (req, res) {
        if (req.file) {
            return res.status(500).json({
                success: true,
                fileUrl:config.app.url + ':' + config.app.port + '/files/' + req.file.filename
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'Invalid file type or file size'
            });
        }
    }
    
};