var mongoose = require('mongoose');

var StudentRecordSchema = new mongoose.Schema({
    // Ma sinh vien
    studentCode: {
        type: String,
        required: true
    },
    // Ban ghi ket qua hoc tap
    record: [{
        _id: false,
        subjectCode: String,
        attempt: [{
            _id: false,
            score: String,
            semester: String
        }]
    }]
}, {
    timestamps: false,
    versionKey: false
});

module.exports = mongoose.model('StudentRecord', StudentRecordSchema);