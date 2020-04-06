'use strict';

const logger = require('../../app_utilities/logger');
const config = require('../../app_config/config');
const messages = require('../../app_utilities/messages').messages;

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

        let no_additional_info = 'no additional info';

        let error = {
            msg: jsonContent ?
                jsonContent.msg ?
                    jsonContent.msg
                    : no_additional_info
                : no_additional_info,
            err: err.msg ?
                err.msg+ ': '+err
                : err
        };

        logger._error({filename: filename, methodname: methodname, message: 'msg: '+JSON.stringify(error)});

        respond(res, filename, methodname, config.status.error,  error);

    }
    else {

        (jsonContent) ?
            respond(res, filename, methodname, status, jsonContent) :
            respond(res,filename,methodname,status, {msg: messages.no_res_json});

        logger._info({filename: filename, methodname: methodname, message: messages.http_response_sent+status});

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

    logger._debug({filename: filename, methodname: methodname, message: messages.started});

    plugin(req, res);


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