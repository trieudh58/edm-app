var mongoose = require('mongoose');
var lecturerSchema = new mongoose.Schema(
	{
		lecturerCode:String,
		name:String,
		teachingSubjectCode: [mongoose.Schema.Types.ObjectId]
	}
)
module.exports = mongoose.model('Lecturer',lecturerSchema);