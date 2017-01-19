var mongoose = require('mongoose');

var SystemConfigurationSchema = new mongoose.Schema({
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true
    },
    mailer: {
      service: {
        type: String,
        require: true
      },
      user: {
        type: String,
        require: true
      },
      pass: {
        type: String,
        require: true
      },
      sender: {
        type: String,
        require: true
      }
    },
    allowAccountRegister: {
      type: Boolean,
      default: true
    },
    allowCourseRequest: {
      type: Boolean,
      default: true
    },
    allowSystemAssessment: {
      type: Boolean,
      default: true
    },
    allowCourseComment: {
      type: Boolean,
      default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('SystemConfiguration', SystemConfigurationSchema);