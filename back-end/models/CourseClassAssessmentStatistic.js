var mongoose = require('mongoose');
var CourseClassAssessmentStatisticSchema = new mongoose.Schema(
	{
		subjectCode:{
			type: String,
			require: true
		},
		lecturerCode: {
			type: String,
			require: true
		},
		questionSetId:{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'AssessmentQuestionSet',
			require:true
		},
		statistic:[
			{
				questionId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'AssessmentQuestion',
					require: true
				},
				firstSelection: Number,
				secondSelection: Number,
				thirdSelection: Number,
				fouthSelection: Number,
				fifthSelection: Number
			}
		]
	},
	{
		timeStamp:true,
		versionKey:false
	}
)

module.exports= mongoose.model('CourseClassAssessmentStatistic',CourseClassAssessmentStatisticSchema);