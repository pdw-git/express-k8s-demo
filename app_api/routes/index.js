/**

 Created 7th September 2018

 */

var express = require('express');
var router = express.Router();

var controller = require('../controllers/api');

router.get('/status', controller.getStatus);

module.exports = router;
