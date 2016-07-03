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
        score: String,
        semester: String,
        // Lan hoc thu may?
        attempt: Number
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('StudentRecord', StudentRecordSchema);