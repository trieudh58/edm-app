var mongoose = require('mongoose');

var EPDetailSchema = new mongoose.Schema({
    // Education program id
    epCode: {
        type: Number,
        unique: false,
        required: true
    },
    // Knowledge unit id
    kuCode: {
        type: Number,
        require: true
    },
    totalCreditsByKU: {
        type: Number,
        require: true
    },
    subjects: [{
        type: String
    }]
}, {
    timestamps: false,
    versionKey: false
});

module.exports = mongoose.model('EPDetail', EPDetailSchema);