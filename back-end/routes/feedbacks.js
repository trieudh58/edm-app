var express = require('express');
var router = express.Router();
var FeedbackController = require('../controllers/feedbacks');
var authentication = require('../middleware/authentication');
var validation = require('../validation/feedbacks');

/* Students create a feedback */
router.post('/create', validation.createFeedback, authentication, FeedbackController.createFeedback);

module.exports = router;