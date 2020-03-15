/**

 created 7th September 2018

 */

const logger = require('../../app_utilities/logger');
const config = require('../../app_config/config');
const messages= require('../../app_utilities/messages').messages;

const filename = "app_api/controllers/api.js";

/**
 * getStatus
 *
 * GET /api/status
 *
 * @param req
 * @param res
 */
module.exports.getStatus = function(req, res){

    const methodname = 'getStatus(req, res)';

    logger._debug({filename: filename, methodname: methodname, message: 'started'});

    res.status(config.status.good);

    res.json({
        status: config.status.good,
        msg: messages.api.good_status
    });

    logger._info({filename: filename, methodname: methodname, message: 'sent good status'});

    logger._debug({filename: filename, methodname: methodname, message: 'completed'});

};

/**
 * get info
 *
 * GET aip/info
 *
 * Returns information relating to the running application.
 *
 * @param req
 * @param res
 */
module.exports.getInfo = function(req, res){

    const methodname = 'getInfo(req,res)';

    const info = require('../../info');

    logger._debug({filename: filename, methodname: methodname, message: 'started'});

    res.status(config.status.good);

    res.json(info);


    logger._info({filename: filename, methodname: methodname, message: 'sent good status'});

    logger._debug({filename: filename, methodname: methodname, message: 'completed'});

};

/**
 * getVersion
 *
 * GET /api/version
 *
 * @param req
 * @param res
 */
module.exports.getVersion = function(req, res){

    const methodname = 'getVersion(req, res)';

    logger._debug({filename: filename, methodname: methodname, message: 'started'});

    res.status(config.status.good);

    res.json({
        version: config.apiVersion
    });

    logger._info({filename: filename, methodname: methodname, message: 'sent good status'});

    logger._debug({filename: filename, methodname: methodname, message: 'completed'});

};

