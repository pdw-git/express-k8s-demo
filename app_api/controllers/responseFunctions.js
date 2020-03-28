'use strict';

const logger = require('../../app_utilities/logger');

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

        console.log('ERR: '+err);

        respondWithError(res, filename, methodname, {msg: err.msg, err: err });

    }
    else {

        res.status(status);
        res.json(jsonContent);

    }

};

/**
 * respondWithErrors
 * @param res
 * @param filename
 * @param methodname
 * @param json
 */
module.exports.respondWithError = function(res, filename, methodname, json){

    logger._error({filename: filename, functionName: methodname, msg: JSON.stringify(json)});

    sendJSONresponse(res, config.status.error, json);

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

    console.log('1. req: '+JSON.stringify(req.params));

    logger._debug({filename: filename, methodname: methodname, message: 'started'});

    plugin(req, res);

    logger._info({filename: filename, methodname: methodname, message: 'sent good status'});

    logger._debug({filename: filename, methodname: methodname, message: 'completed'});

};