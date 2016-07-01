var mongoose = require('mongoose');

var SubjectSchema = new mongoose.Schema({
    // Ma mon hoc
    code: {
        type: String,
        unique: true,
        required: true,
    },
    // Ten mon hoc
    name: {
        type: String,
        required: true
    },
    details: {
        // So luong tin chi
        credits: {
            type: Number
        },
        // Chuyen nganh. VD: CNTT
        major: {
            type: String
        },
        // Loai mon hoc. VD: Khoi kien thuc chung
        type: {
            type: String
        },
        // So gio ly thuyet
        onClassHour: {
            type: Number
        },
        // So gio thuc hanh
        practiceHour: {
            type: Number
        },
        // Mon hoc tien quyet
        prerequisite: {
            type: mongoose.Schema.Types.ObjectId
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Subject', SubjectSchema);