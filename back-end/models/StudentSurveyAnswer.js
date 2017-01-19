var mongoose = require('mongoose');

var StudentSurveyAnswerSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref:'User',
			require:true,
			unique:true
		},
		answerList: [
			{
				questionId:{
					type: mongoose.Schema.Types.ObjectId,
					ref:'StudentSurveyQuestion',
					require:true
				},
				chosenAnswers:[String]
			}
		]
	},
	{
		timeStamp:true,
		versionKey:false
	}
);

module.exports = mongoose.model('StudentSurveyAnswer',StudentSurveyAnswerSchema);