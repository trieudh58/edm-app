var mongoose = require('mongoose');

var SRDirectionSchema = new mongoose.Schema({
    lecturer: {
        type: String,
        require: true
    },
    degree: {
        type: String,
        require: true
    },
    workplace: {
        type: String
    },
    teach: [{
        type: String
    }],
    study: [{
        type: String
    }],
    thesisGuide: [{
        type: String
    }]
}, {
    timestamps: false,
    versionKey: false
});

module.exports = mongoose.model('SRDirection', SRDirectionSchema);