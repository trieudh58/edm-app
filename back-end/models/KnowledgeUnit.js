var mongoose = require('mongoose');

var KnowledgeUnitSchema = new mongoose.Schema({
    kuCode: {
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