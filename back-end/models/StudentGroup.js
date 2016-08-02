var mongoose = require('mongoose');

var StudentGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        require: true
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('StudentGroup', StudentGroupSchema);