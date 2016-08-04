var express = require('express');
var router = express.Router();
var UserController = require('../../controllers/users');
var authentication = require('../../middleware/authentication');
var adminPermission = require('../../middleware/adminPermission');

/* Create a user */
router.post('/create', authentication, adminPermission, UserController.create);

/* Delete a user. Admin permission required */
router.delete('/delete', authentication, adminPermission, UserController.delete);

module.exports = router;