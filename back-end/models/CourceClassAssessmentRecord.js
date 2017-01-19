var mongoose = require('mongoose');
var CourseClassAssessmentRecordSchema= new mongoose.Schema({
		subjectCode:{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Subject',
			require: true
		},
		lecturerCode: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Lecturer',
			require: true
		},
		questionSetId:{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'AssessmentQuestionSet'
		},
		courseClassAssessmentRecords:[{
			userId: mongoose.Schema.Types.ObjectId,
			record: [
				{
					questionId:{
						type: mongoose.Schema.Types.ObjectId,
						ref:'StudentSurveyQuestion'
					},
					chosen:{
						type:Number,
						enum:[1,2,3,4,5]
					}
				}
			]
		}]
	},
	{
		timeStamp:true,
		versionKey:false
	}
);
module.exports = mongoose.model('CourseClassAssessmentRecord',CourseClassAssessmentRecordSchema);