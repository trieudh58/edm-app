var lecturer = require('../models').lecturer;
module.exports={
    /**
     * @swagger
     * resourcePath: /api/v1/lecturer
     * description: Feedback apis
     */

    /**
     * @swagger
     * path: /api/v1/lecturer/get-all
     * operations:
     *   -  httpMethod: GET
     *      summary: Get list lecturer information
     *      notes: Return lecturer information
     *      nickname: get lecturer
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get lectuter info*/
    getLecturerInfo: function (req, res) {
        // lectuter.find({}, function (err, result) {
        //     if (err)
        //         return
        //     	res.status(500).json({
        //     		success:true,
        //     		message:err
        //     	})
        //     return res.json({
        //         success: true,
        //         lecturers: result
        //     });
        // });

        lecturers=[
        {
        	lecturerCode: 32,
        	name:"PGS.TS.Phan Xuan Hieu",
        	teachingSubjectCode:['PHI1004','PHI1005']
        },
        {
        	lecturerCode: 33,
        	name:"PGS.TS.Ha Quang Thuy",
        	teachingSubjectCode:['POL1001','HIS1002','PHI1004','PHI1005']
        },
        {
        	lecturerCode: 34,
        	name:"CN.Vuong Thi Hai Yen",
        	teachingSubjectCode:['PHI1004','PHI1005','INT1003','INT1006','FLF2101']
        },
        ]
        return res.json({
        	success:true,
        	lecturers:lecturers
        });
    }
};