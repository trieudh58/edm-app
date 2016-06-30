var express = require('express');
var router = express.Router();

/* User-related routes */
router.use('/users', require('./users'));

module.exports = router;