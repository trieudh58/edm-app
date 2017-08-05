var question = require('../../models').AssessmentQuestion;
var courseClassAssessmentRecord = require('../../models').courseClassAssessmentRecord;
var SystemAssessmentRecord = require('../../models').SystemAssessmentRecord;
var AssessmentQuestionSet = require('../../models').AssessmentQuestionSet;
var SystemAssessmentStatistic = require('../../models').SystemAssessmentStatistic;
var CourseClassAssessmentStatistic = require('../../models').CourseClassAssessmentStatistic;

module.exports = {
    /**
     * @swagger
     * resourcePath: /api/v1/admin/assessment-question
     * description: admin assessment question apis
     */

    /**
     * @swagger
     * path: /api/v1/admin/assessment-question/create-question
     * operations:
     *   -  httpMethod: POST
     *      summary: Create question for analysis user satisfaction
     *      notes: 
     *      nickname: Create question for analysis user satisfaction
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: content
     *          description: content
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: questionSetId
     *          description: id of question set which this question belong
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Create new question */
    createAssessmentQuestion: function (req, res) {
        AssessmentQuestionSet.findOne({_id:req.body.questionSetId},function(err,questionSet){
            if(err){
                return res.status(500).json({
                    success:false,
                    message:'server fail.'
                }) 
            }
            if(!questionSet){
                return res.status(500).json({
                    success:false,
                    message:'questionSet not exist.'
                }) 
            }
            else
                question.create({
                    content:req.body.content,
                    purpose:questionSet.purpose
                },function (err,createdQuestion) {
                    if(err){
                        return res.status(500).json({
                            success:false,
                            message:err
                        })
                    }
                    else{
                        questionSet.update({
                            $push: {
                                questionList: createdQuestion._id
                            }
                        },function(err){
                            if(err)
                                return res.status(500).json({
                                    success:false,
                                    message:'Server failure pushing question to questionSet'
                                })
                            return res.status(200).json({
                                success:true,
                                message:'create successfully a new question.'
                            })
                        })
                    }
                })
        })

    },
    /**
     * @swagger
     * path: /api/v1/admin/assessment-question/update-question
     * operations:
     *   -  httpMethod: PUT
     *      summary: update assessment question
     *      notes: 
     *      nickname: update assessment question
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: id
     *          description: id
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: content
     *          description: question
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* update the question */
    updateStudentAssessmentQuestion: function(req,res){
    	question.update({_id:req.body.id},{
    		content:req.body.content
    	},function (err) {
    		if(err){
    			return res.status(500).json({
    				success:false,
    				message:err
    			})
    		}
    		else{
    			return res.status(200).json({
    				success:true,
    				message:'update question successfully.'
    			})
    		}
    	})
    },

    /**
     * @swagger
     * path: /api/v1/admin/assessment-question/get-purposes
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
    /* Get question purposes */
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
     * path: /api/v1/admin/assessment-question/delete-question
     * operations:
     *   -  httpMethod: DELETE
     *      summary: delete question
     *      notes:
     *      nickname: delete assessment question
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: questionId
     *          description: question id
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    /* Delete questions */
    deleteAssessmentQuestion: function(req,res){
    	question.findOne({_id:req.query.questionId},function (err,object) {
    		if(err){
    			return res.status(500).json({
    				success:false,
    				message:err
    			})
    		}
    		else{
    			if(!object)
    				return res.status(400).json({
    					success:false,
    					message:'ID does not exist.'
    				})
    			else{
    				object.remove(function (err) {
    					if(err)
    						return res.status(500).json({
    							success:false,
    							message:'fail to delete question.'
    						})
    					else
    						return res.status(200).json({
    							success:true,
    							message:'success to delete.'
    						})
    				})
    			}
    		}
    	})
    },
    /**
     * @swagger
     * path: /api/v1/admin/assessment-question/get-all-system-questions
     * operations:
     *   -  httpMethod: GET
     *      summary: Get all questions for system assessment purpose
     *      notes:
     *      nickname: all question for system assessment purpose
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get questions */
    getAllSystemQuestions:function(req,res){
        question.find({purpose:'systemAssessment'},'_id content',function(err,questions){
            if(err)
                return res.status(500).json({
                    success:false,
                    message:err
                })
            else
                return res.json({
                    success:true,
                    data: questions
                })
        })
    },
    /**
     * @swagger
     * path: /api/v1/admin/assessment-question/get-all-course-class-questions
     * operations:
     *   -  httpMethod: GET
     *      summary: Get all questions for course-class assessment purpose
     *      notes:
     *      nickname: all question for course-class assessment purpose
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get questions */
    getAllCourseClassQuestions: function(req,res){
        question.find({purpose:'courseClassAssessment'},'_id content',function(err,questions){
            if(err)
                return res.status(500).json({
                    success:false,
                    message:err
                })
            else
                return res.json({
                    success:true,
                    data: questions
                })
        })
    },
    /**
     * @swagger
     * path: /api/v1/admin/assessment-question/get-list-system-assessment-set
     * operations:
     *   -  httpMethod: GET
     *      summary: Get system assessment question sets
     *      notes:
     *      nickname: Get system assessment question sets
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get system assessment question sets  */
    getListSystemAssessmentQuestionSet:function(req,res){
        AssessmentQuestionSet.find({purpose:'systemAssessment'},'_id name active',function(err,questionSetList){
            if(err)
                return res.status(500).json({
                    success:false,
                    message:err
                })
            else
                return res.json({
                    success:true,
                    data: questionSetList
                })
        })
    },
    /**
     * @swagger
     * path: /api/v1/admin/assessment-question/get-list-course-class-assessment-set
     * operations:
     *   -  httpMethod: GET
     *      summary: Get list of course-class assessment question-set
     *      notes:
     *      nickname: Get list of course-class assessment question-set
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* Get course class assessment question sets  */
    getListCourseClassAssessmentQuestionSet:function(req,res){
        AssessmentQuestionSet.find({purpose:'courseClassAssessment'},'_id name active',function(err,questionSetList){
            if(err)
                return res.status(500).json({
                    success:false,
                    message:err
                })
            else
                return res.json({
                    success:true,
                    data: questionSetList
                })
        })
    },
    /**
     * @swagger
     * path: /api/v1/admin/assessment-question/get-assessment-set-by-id
     * operations:
     *   -  httpMethod: GET
     *      summary: Get a assessment question-set
     *      notes:
     *      nickname: Get a assessment question-set
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: questionSetId
     *          description: id of question set
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    /* Get assessment question set  */
    getAssessmentQuestionSet: function(req,res){
        AssessmentQuestionSet.findOne({_id:req.query.questionSetId}).populate({
            path: 'questionList',
            select: 'content'
        })
        .exec(function(err,questionSet){
            if(err)
                return res.status(500).json({
                    success:false,
                    message:err
                })
            else
                return res.json({
                    success:true,
                    data: questionSet
                })
        })
    },

    /**
     * @swagger
     * path: /api/v1/admin/assessment-question/add-questions-to-question-set
     * operations:
     *   -  httpMethod: POST
     *      summary: add exist questions to created question set
     *      notes: 
     *      nickname: add exist questions to created question set
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: questionIdList
     *          description: list of question id in form id1,id2,id3
     *          paramType: form
     *          required: true
     *          dataType: string
     *        - name: questionSetId
     *          description: id of question set which those questions belong
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* add question */
    addAssessmentQuestionsToQuestionSet: function (req, res) {
        AssessmentQuestionSet.update({_id:req.body.questionSetId},{
                $push: {
                    questionList: {
                        $each:req.body.questionIdList.split(',')
                    }
                }
            },function(err,questionSet){
            if(err){
                return res.status(500).json({
                    success:false,
                    message:err
                }) 
            }
            else
                return res.status(200).json({
                    success:true,
                    message:'added successfully new questions to question set.'
                })
        })

    },
    /**
     * @swagger
     * path: /api/v1/admin/assessment-question/create-system-question-set
     * operations:
     *   -  httpMethod: POST
     *      summary: Create new question set for analysis system satisfaction 
     *      notes: 
     *      nickname: Create new question  set for analysis system satisfaction
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: name
     *          description: name of question set
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Create new question set */
    createSystemQuestionSet:function(req,res){
        AssessmentQuestionSet.create({name:req.body.name,questionList:[],purpose:'systemAssessment',active:false},function(err){
            if(err)
                return res.status(500).json({
                    success:false,
                    message:err
                })
            else
                return res.json({
                    success:true,
                    message: 'create successfully new system question set.'
                })
        })
    },
    /**
     * @swagger
     * path: /api/v1/admin/assessment-question/create-course-class-question-set
     * operations:
     *   -  httpMethod: POST
     *      summary: Create new question  set for analysis course-class satisfaction
     *      notes: 
     *      nickname: Create new question  set for analysis course-class satisfaction
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: name
     *          description: name of question set
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* Create new question set */
    createCourseClassQuestionSet: function(req,res){
        AssessmentQuestionSet.create({name:req.body.name,questionList:[],purpose:'courseClassAssessment',active:false},function(err){
            if(err)
                return res.status(500).json({
                    success:false,
                    message:err
                })
            else
                return res.json({
                    success:true,
                    message: 'create successfully new cource class question set.'
                })
        })
    },
    /**
     * @swagger
     * path: /api/v1/admin/assessment-question/delete-question-set
     * operations:
     *   -  httpMethod: DELETE
     *      summary: delete question set
     *      notes:
     *      nickname: delete assessment question set
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: questionSetId
     *          description: question set id
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    /* Delete question set */
    deleteAssessmentQuestionSet: function(req,res){
        AssessmentQuestionSet.findOne({_id:req.query.questionSetId},function (err,questionSet) {
            if(err){
                return res.status(500).json({
                    success:false,
                    message:err
                })
            }
            else{
                if(!questionSet)
                    return res.status(400).json({
                        success:false,
                        message:'ID does not exist.'
                    })
                else{
                    questionSet.remove(function (err) {
                        if(err)
                            return res.status(500).json({
                                success:false,
                                message:'fail to delete question set.'
                            })
                        else
                            return res.status(200).json({
                                success:true,
                                message:'success to delete.'
                            })
                    })
                }
            }
        })
    },
    /**
     * @swagger
     * path: /api/v1/admin/assessment-question/active-assessment-question-set
     * operations:
     *   -  httpMethod: PUT
     *      summary: update question set status as active
     *      notes: active 1 question set and deactive all other
     *      nickname: update question set status as active
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: questionSetId
     *          description: question set id
     *          paramType: form
     *          required: true
     *          dataType: string
     */
    /* system assessment question statistic */
    activeQuestionSet: function(req,res){
        AssessmentQuestionSet.find({_id:req.body.questionSetId},function(err,questionSet){
            if(err)
                return res.status(500).json({
                    success:false,
                    message:'fail to activate question set.'
                })
            else{
                AssessmentQuestionSet.update({active:true, purpose: questionSet.purpose},{$set:{active:false}}, {"multi": true},function(err){
                    if(err)
                        return res.status(500).json({
                            success: false,
                            message: err
                        })
                    else
                        AssessmentQuestionSet.update({_id:req.body.questionSetId},{active:true},function(err){
                            if(err)
                                return res.status(500).json({
                                    success:false,
                                    message:'fail to activate question set.'
                                })
                            else
                                return res.status(200).json({
                                    success:true,
                                    message:'success to activate.'
                                })
                    })
                });
            }    
        })
    },
    /**
     * @swagger
     * path: /api/v1/admin/assessment-question/get-system-assessment-statistic
     * operations:
     *   -  httpMethod: GET
     *      summary: get system statistic of active question set
     *      notes: get statistic of active question set
     *      nickname: get system statistic of active question set
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     */
    /* system assessment question statistic */
    getSystemAssessmentStatistic: function(req,res){
        AssessmentQuestionSet.findOne({active:true,purpose:'systemAssessment'},function(err,questionSet){
            if(err)
                return res.status(500).json({
                    success:false,
                    message:'server fail.'
                })
            else
                SystemAssessmentStatistic.findOne({questionSetId:questionSet._id},'_id statistic').populate({
                    path: 'statistic.questionId',
                    select: '_id content'
                }).exec(function(err,statistic){
                    if(err)
                        return res.status(500).json({
                            success:false,
                            message:'fail to get statistic.'
                        })
                    else
                        return res.status(200).json({
                            success:true,
                            data: statistic
                        })
                })
        })

    },
    /**
     * @swagger
     * path: /api/v1/admin/assessment-question/get-course-class-assessment-statistic
     * operations:
     *   -  httpMethod: GET
     *      summary: get course-class statistic of active question set
     *      notes: get statistic of active question set
     *      nickname: get course-class statistic of active question set
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Authorization
     *          description: Bearer [accessToken]
     *          paramType: header
     *          required: true
     *          dataType: string
     *        - name: subjectCode
     *          description: subjectCode
     *          paramType: query
     *          required: true
     *          dataType: string
     *        - name: lecturerCode
     *          description: lecturerCode
     *          paramType: query
     *          required: true
     *          dataType: string
     */
    /* system assessment question statistic */
    getCourseClassAssessmentStatistic: function(req,res){
        AssessmentQuestionSet.findOne({active:true,purpose:'courseClassAssessment'},function(err,questionSet){
            if(err)
                return res.status(500).json({
                    success:false,
                    message:'server fail.'
                })
            else
                CourseClassAssessmentStatistic.findOne({
                    questionSetId:questionSet._id,
                    lecturerCode:req.query.lecturerCode,
                    subjectCode:req.query.subjectCode},'_id statistic')
                .populate({
                    path: 'statistic.questionId',
                    select: '_id content'})
                .exec(function(err,statistic){
                    if(err)
                        return res.status(500).json({
                            success:false,
                            message:'fail to get statistic.'
                        })
                    else
                        return res.status(200).json({
                            success:true,
                            data: statistic
                        })
                })
        })
    }
};