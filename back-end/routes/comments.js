var express = require('express');
var router = express.Router();
var CommentController = require('../controllers/comments');
var authentication = require('../middleware/authentication');
// var validation = require('../validation/comments');

/* Get comments of a subject */
router.get('/get-by-subject-code', authentication, CommentController.getComments);

/* Create a comment for a subject */
router.post('/create-one', authentication, CommentController.createOneComment);

module.exports = router;