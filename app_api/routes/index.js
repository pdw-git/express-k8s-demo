/**

 Created 7th September 2018

 */

const express = require('express');
const router = express.Router();

const controller = require('../controllers/api');

router.get('/status', controller.getStatus);
router.get('/info', controller.getInfo);
router.get('/version', controller.getVersion);
router.get('/test', controller.getTest);
router.delete('/config/:configid',controller.deleteConfig);
router.post('/config/:configid', controller.postConfig);
router.get('/config', controller.getConfig);


module.exports = router;