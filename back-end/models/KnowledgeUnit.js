var mongoose = require('mongoose');

var KnowledgeUnitSchema = new mongoose.Schema({
    code: {
        type: Number,
        unique: true,
        required: true
    },
    name: {
        type: String,
        require: true
    }
}, {
    timestamps: false,
    versionKey: false
});

module.exports = mongoose.model('KnowledgeUnit', KnowledgeUnitSchema);