var express = require('express');
var router = express.Router();
var TokenController = require('../controllers/tokens');

/* Refresh token */
router.get('/refresh', TokenController.refresh);

module.exports = router;