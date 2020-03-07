/**

 Created 7th September 2018

 */

const express = require('express');
const router = express.Router();

const controller = require('../controllers/api');

router.get('/status', controller.getStatus);
router.get('/info', controller.getInfo);

module.exports = router;