var express = require('express');
var router = express.Router();
var suggestionAndWarning = require('../controllers/suggestionAndWarning');
var authentication = require('../middleware/authentication');

router.get('/current-performance',authentication,suggestionAndWarning.getPerformanceSuggestion);

router.get('/graduation-condition',authentication,suggestionAndWarning.getGraduationConditionSuggestion);

module.exports = router;