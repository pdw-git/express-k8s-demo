'use strict';

const logger = require('../../app_utilities/logger');
const config = require('../../app_config/config');

/**
 * sendJSONresponse
 * @param err
 * @param res
 * @param filename
 * @param methodname
 * @param status
 * @param jsonContent
 */
module.exports.sendJSONresponse = function(err, res, filename, methodname, status, jsonContent) {

    if (err) {

        let error = err.msg ? err.msg+ ': '+err : err;

        logger._error({filename: filename, methodname: methodname, message: 'msg: '+error});

        respond(res, filename, methodname, config.status.error,  {err: error });
    }
    else {

        respond(res, filename, methodname, status,  jsonContent);

    }

};


/**
 * defaultResponse
 * @param req
 * @param res
 * @param filename
 * @param methodname
 * @param plugin
 */
module.exports.defaultResponse = function(req, res, filename, methodname, plugin ){

    logger._debug({filename: filename, methodname: methodname, message: 'started'});

    plugin(req, res);

    logger._info({filename: filename, methodname: methodname, message: 'sent good status'});

    logger._debug({filename: filename, methodname: methodname, message: 'completed'});

};

/**
* respondWithErrors
* @param res
* @param filename
* @param methodname
* @param status
* @param json
*/
function respond(res, filename, methodname, status, json){

    res.status(status);
    res.json(json);

}