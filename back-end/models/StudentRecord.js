var mongoose = require('mongoose');

var StudentRecordSchema = new mongoose.Schema({
    // Ma sinh vien
    studentCode: {
        type: String,
        required: true
    },
    // Ban ghi ket qua hoc tap
    record: [ new mongoose.Schema({
        subjectCode: String,
        score: Number,
        // Lan hoc thu may?
        attempt: Number
    }, {
        _id: false
    })]
}, {
    timestamps: true
});

module.exports = mongoose.model('StudentRecord', StudentRecordSchema);