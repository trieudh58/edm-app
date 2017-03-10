var SuggestionAndWarning = require('../models').SuggestionAndWarning;
module.exports = {
	/**
     * @swagger
     * resourcePath: /api/v1/suggestion-and-warning
     * description: suggestion and warning graduation condition and current performance
     */

    /**
     * @swagger
     * path: /api/v1/suggestion-and-warning/current-performance
     * operations:
     *   -  httpMethod: GET
     *      summary: get suggestion and warning about performance
     *      notes: return array of messages
     *      nickname: performace suggestion and warning
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
    getPerformanceSuggestion: function (req, res) {
        // SuggestionAndWarning.findOne({user:req.user._id}, 'currentPerformance', function (err, suggestions) {
        //     if (err) {
        //         return res.status(500).json({
        //             success: false,
        //             message: err
        //         });
        //     }
        //     else {
        //         return res.json({
        //             success: true,
        //             subjects: suggestions
        //         });
        //     }
        // });
        suggestions=[
        {
            _id:'324fshf32432h324g23',
            content:"ban da gan tieu chuan co the tot nghiep loai gioi hay co gang mot so mon nhu INT2204 va INT 4343 vao ky toi",
            createAt:Date.now()
        },
        {
            _id:'324fshf32432h324g24',
            content:"ban da gan tieu chuan co the tot nghiep loai xuat sac hay co gang hoc cai thien mot so mon vao nhu HIS1023 vao ky toi",
            createAt:Date.now()
        },
        {
            _id:'324fshf32432h324g25',
            content:"ban da gan tieu chuan co the tot nghiep loai gioi hay co gang mot so mon nhu INT2204 va INT 4343 vao ky toi",
            createAt:Date.now()
        },
        {
            _id:'324fshf32432h324g26',
            content:"ban da gan tieu chuan co the tot nghiep loai gioi hay co gang mot so mon nhu INT2204 va INT 4343 vao ky toi",
            createAt:Date.now()
        },
        ]
        return res.json({
            success:true,
            suggestions:suggestions
        })
    },
    /**
     * @swagger
     * path: /api/v1/suggestion-and-warning/graduation-condition
     * operations:
     *   -  httpMethod: GET
     *      summary: get suggestion and warning about graduation condition
     *      notes: return array of messages
     *      nickname: graduation condition suggestion and warning
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
    getGraduationConditionSuggestion: function (req, res) {
        // SuggestionAndWarning.findOne({user:req.user._id}, 'graduationCondition', function (err, suggestions) {
        //     if (err) {
        //         return res.status(500).json({
        //             success: false,
        //             message: err
        //         });
        //     }
        //     else {
        //         return res.json({
        //             success: true,
        //             suggestions: suggestions
        //         });
        //     }
        // });
        suggestions=[
        {
            _id:'324fshf32432h324g23',
            content:"ban dang thieu 2 hoc phan the duc de du dieu kien tot nghiep vao ky toi",
            createAt:Date.now()
        },
        {
            _id:'324fshf32432h324g24',
            content:"ban con thieu mot mon tu chon 3 tin chi de du dieu kien tot nghiep",
            createAt:Date.now()
        },
        {
            _id:'324fshf32432h324g25',
            content:"diem hien tai cua ban khong du de tot nghiep, ban can phai cham chi hon o ky toi",
            createAt:Date.now()
        },
        {
            _id:'324fshf32432h324g26',
            content:"ban da gan tieu chuan co the tot nghiep loai gioi hay co gang mot so mon nhu INT2204 va INT 4343 vao ky toi",
            createAt:Date.now()
        },
        ]
        return res.json({
            success:true,
            suggestions:suggestions
        })
    },
};