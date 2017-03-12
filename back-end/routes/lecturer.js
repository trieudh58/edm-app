var authentication= require('../middleware/authentication');
var express = require('express');
var router = express.Router();
var lecturer = require('../controllers/lecturer');

router.get('/get-all',authentication,lecturer.getLecturerInfo);

module.exports = router
