var express = require('express');
var router = express.Router();
var EducationProgramController = require('../controllers/educationPrograms');
var authentication = require('../middleware/authentication');
var validation = require('../validation/educationPrograms');

/* Get education program information */
router.get('/get-eps', authentication, EducationProgramController.getEPs);

/* Get knowledge unit information */
router.get('/get-kus', authentication, EducationProgramController.getKUs);

/* Get education program detail */
router.get('/get-ep-detail-by-code', validation.getEPDetailByCode, authentication, EducationProgramController.getEPDetailByCode);

module.exports = router;