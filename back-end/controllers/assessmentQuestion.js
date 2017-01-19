var question = require('../models').AssessmentQuestion;
var systemAssessmentRecord =require('../models').systemAssessmentRecord;
var SystemAssessmentStatistic =require('../models').SystemAssessmentStatistic;
var CourseClassAssessmentStatistic =require('../models').CourseClassAssessmentStatistic;
var AssessmentQuestionSet = require('../models').AssessmentQuestionSet;
module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/assessment-question
     * description: assessment question apis
     */

    /**
     * @swagger
     * path: /api/v1/assessment-question/get-question-list-by-purpose
     * operations:
     *   -  httpMethod: GET
     *      summary: Get list of question for paticular such as system assessment or lecture assessment ...
     *      notes: Return array of question
     *      nickname: Get question based on purpose
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: purpose
     *          description: question purpose
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Return question  list */
    getQuestionSetOnPurpose: function (req, res) {
        AssessmentQuestionSet.find({purpose:req.body.purpose,active:true}, function (err, questions) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            }
            else {
                return res.json({
                    success: true,
                    questions: questions
                });
            }
        });
    },
    /**
     * @swagger
     * path: /api/v1/assessment-question/get-assessment-question-purpose-list
     * operations:
     *   -  httpMethod: GET
     *      summary: Get purpose of assessment question type
     *      notes:
     *      nickname: Get supported question purposes
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /*return question purpose  list */
    getStudentAssessmentQuestionSetType: function(req,res){
        try{
            var questionTypes = AssessmentQuestionSet.schema.path('purpose').enumValues;
            return res.status(200).json({
                success:true,
                data:questionTypes
            })
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:err
            })
        }
    },
        /**
     * @swagger
     * path: /api/v1/assessment-question/submit-system-assessment
     * operations:
     *   -  httpMethod: POST
     *      summary: submit assessment
     *      notes: 
     *      nickname: 
     *      consumes:
     *        - text/htmlf
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: answerList
     *          description: json form of a list which contains questionId and chosen in range 1-5
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* submit system assessment*/
 	submitSystemAssessment: function(req,res){
        var systemAssessmentRecord = JSON.parse(req.body.answerList);
        var scoredict={}
        for(var i=0;i<systemAssessmentRecord.length;i++){
            scoredict[systemAssessmentRecord[i].questionId]=systemAssessmentRecord[i].chosen
        }
        var fieldmap={
            1:'firstSelection',
            2:'secondSelection',
            3:'thirdSelection',
            4:'fouthSelection',
            5:'fifthSelection',
        }
        AssessmentQuestionSet.findOne({active:true,purpose:'systemAssessment'},function(err,questionSet){
            if(err||!questionSet){
                return res.status(500).json({
                    success:false,
                    message:'server fail.'
                })
            }
            else{
                SystemAssessmentStatistic.findOne({questionSetId:questionSet._id},function (err,assessmentStatistic){
                    if(err)
                        return res.status(500).json({
                        success:false,
                        message:'server fail.'
                    })
                    if(!assessmentStatistic){
                        SystemAssessmentStatistic.create({questionSetId:questionSet._id,statistic:[]},function (err, createdStatistic) {
                            if(err){
                                return res.status(500).json({
                                    success:false,
                                    message:'server fail.'
                                })
                            }
                            var questionIdList=questionSet.questionList
                            var statistic =[]
                            for(var i=0;i<questionIdList.length;i++){
                                statistic.push({
                                        questionId:questionIdList[i],
                                        firstSelection: 0,
                                        secondSelection: 0,
                                        thirdSelection: 0,
                                        fouthSelection: 0,
                                        fifthSelection: 0
                                    })
                            }
                            createdStatistic.statistic=statistic
                            for(var i =0;i<createdStatistic.statistic.length;i++){
                                var score = scoredict[createdStatistic.statistic[i].questionId]
                                if(fieldmap[score])
                                    createdStatistic.statistic[i][fieldmap[score]]+=1
                            }
                            createdStatistic.save(function(err,us){
                                return res.status(200).json({
                                    success:true,
                                    message:'submited.'
                                })
                            })
                        })
                    }
                    else{
                        for(var i = 0;i<assessmentStatistic.statistic.length;i++){
                            var score = scoredict[assessmentStatistic.statistic[i].questionId]
                            if(fieldmap[score])
                                assessmentStatistic.statistic[i][fieldmap[score]]+=1
                        }
                        return res.status(200).json({
                            success:true,
                            message:'submited.'
                        })
                    }
                })
            }
        })   
    },
    /**
     * @swagger
     * path: /api/v1/assessment-question/submit-cource-class-assessment
     * operations:
     *   -  httpMethod: POST
     *      summary: submit assessment
     *      notes: 
     *      nickname: 
     *      consumes:
     *        - text/htmlf
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: answerList
     *          description: json form of a list which contains questionId and chosen in range 1-5
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: subjectCode
     *          description: subjectCode
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: lecturerCode
     *          description: lecturerCode
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* course class assessment*/
    submitCourseClassAssessment: function(req,res){
        var AssessmentRecord = JSON.parse(req.body.answerList);
        var scoredict={}
        for(var i=0;i<AssessmentRecord.length;i++){
            scoredict[AssessmentRecord[i].questionId]=AssessmentRecord[i].chosen
        }
        var fieldmap={
            1:'firstSelection',
            2:'secondSelection',
            3:'thirdSelection',
            4:'fouthSelection',
            5:'fifthSelection',
            }
        AssessmentQuestionSet.findOne({active:true,purpose:'courseClassAssessment'},function(err,questionSet){
            if(err||!questionSet){
                return res.status(500).json({
                    success:false,
                    message:'server fail or not have active question set.'
                })
            }
            else{
                CourseClassAssessmentStatistic.findOne({
                    questionSetId:questionSet._id,
                    subjectCode:req.body.subjectCode,
                    lecturerCode:req.body.lecturerCode
                },function (err,assessmentStatistic){
                    if(err)
                        return res.status(500).json({
                        success:false,
                        message:err
                    })
                    if(!assessmentStatistic){
                        CourseClassAssessmentStatistic.create({
                            questionSetId:questionSet._id,
                            subjectCode:req.body.subjectCode,
                            lecturerCode:req.body.lecturerCode,
                            statistic:[]
                        },function (err, createdStatistic) {
                            if(err){
                                return res.status(500).json({
                                    success:false,
                                    message:err
                                })
                            }
                            var questionIdList=questionSet.questionList
                            var statistic =[]
                            for(var i=0;i<questionIdList.length;i++){
                                statistic.push({
                                        questionId:questionIdList[i],
                                        firstSelection: 0,
                                        secondSelection: 0,
                                        thirdSelection: 0,
                                        fouthSelection: 0,
                                        fifthSelection: 0
                                    })
                            }
                            createdStatistic.statistic=statistic
                            for(var i =0;i<createdStatistic.statistic.length;i++){
                                var score = scoredict[createdStatistic.statistic[i].questionId]
                                if(fieldmap[score])
                                    createdStatistic.statistic[i][fieldmap[score]]+=1
                            }
                            createdStatistic.save(function(err,us){
                                return res.status(200).json({
                                    success:true,
                                    message:'submited.'
                                })
                            })
                        })
                    }
                    else{
                        for(var i = 0;i<assessmentStatistic.statistic.length;i++){
                            var score = scoredict[assessmentStatistic.statistic[i].questionId]
                            if(fieldmap[score])
                                assessmentStatistic.statistic[i][fieldmap[score]]+=1
                        }
                        return res.status(200).json({
                            success:true,
                            message:'submited.'
                        })
                    }
                })
            }
        })
    }
};