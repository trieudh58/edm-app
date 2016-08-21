var mongoose = require('mongoose');

var SubjectSchema = new mongoose.Schema({
    // Ma mon hoc
    code: {
        type: String,
        unique: true,
        required: true
    },
    // Ten mon hoc
    name: {
        vi: {
            type: String,
            required: true
        },
        en: {
            type: String
        }
    },
    details: {
        // So luong tin chi
        credits: {
            type: Number,
            require: true
        },
        // So gio ly thuyet
        onClassHour: {
            type: Number
        },
        // So gio thuc hanh
        practiceHour: {
            type: Number
        },
        // So gio tu hoc
        selfTrainHour: {
            type: Number
        },
        // Mon hoc tien quyet
        prerequisites: [{
            type: String
        }]
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Subject', SubjectSchema);