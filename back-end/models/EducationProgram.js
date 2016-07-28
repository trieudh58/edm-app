var mongoose = require('mongoose');

var EducationProgramSchema = new mongoose.Schema({
    code: {
        type: Number,
        unique: true,
        required: true
    },
    name: {
        type: String,
        require: true
    },
    totalCredits: {
        type: Number,
        require: true
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('EducationProgram', EducationProgramSchema);