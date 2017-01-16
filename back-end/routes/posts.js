var express = require('express');
var router = express.Router();
var PostController = require('../controllers/posts');
var authentication = require('../middleware/authentication');
var validation = require('../validation/posts');

/* Get all posts */
router.get('/get-all', authentication, PostController.getAll);

/* Get all post headers */
router.get('/get-all-post-headers', authentication, PostController.getAllPostHeaders);

/* Get one post by id */
router.get('/get-one-by-id', validation.getOneById, authentication, PostController.getOneById);

module.exports = router;