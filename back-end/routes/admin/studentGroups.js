var express = require('express');
var router = express.Router();
var StudentGroupController = require('../../controllers/admin/studentGroups');
var authentication = require('../../middleware/authentication');

/* Get all groups */
router.get('/get-all', authentication, StudentGroupController.getAll);

module.exports = router;