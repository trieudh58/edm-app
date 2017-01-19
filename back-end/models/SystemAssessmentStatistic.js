var mongoose =require('mongoose');
var SystemAssessmentStatistic = new mongoose.Schema(
	{
		questionSetId:{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'AssessmentQuestionSet',
			unique:true
		},
		statistic:[
			{
				questionId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'AssessmentQuestion',
					require:true
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
module.exports= mongoose.model('SystemAssessmentStatistic',SystemAssessmentStatistic)