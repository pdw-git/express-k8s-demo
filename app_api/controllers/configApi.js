'use strict';

const logger = require('../../app_utilities/logger');
const config = require('../../app_config/config');
const mongo = require('../models/mongoActions');
const messages = require('../../app_utilities/messages').messages;
const responseFunctions = require('./responseFunctions');
const db = require('../models/db');
const configDB = require('../models/configDB/configDB_Actions');
const filename = __filename;


/**
 * postConfig
 * @param req
 * @param res
 */
module.exports.postConfig = function(req,res){

    const methodname = 'postConfig';

    responseFunctions.defaultResponse(req, res, filename, methodname, (req, res)=> {

        if(db.dbConnected()) {
            // noinspection JSUnresolvedVariable
            if (!req.params.configid) {
                responseFunctions.sendJSONresponse(null, res, filename, methodname, config.status.error, {msg: messages.req_params_not_found + 'req.params.config'});

            } else {
                // noinspection JSUnresolvedVariable
                mongo.update(config.mongo.configObjectName, {_id: req.params.configid}, updateConfig, (err, doc) => {

                    let plugin = updateConfig;

                    if (err) {
                        responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error, {msg: messages.mongo.invalid_id});

                    } else {

                        if (typeof (req.body) === "object") {

                            if (typeof (plugin) !== 'function') {

                                responseFunctions.sendJSONresponse(new Error(messages.mongo.typeof_plugin_error), res, filename, methodname, config.status.error);

                            } else {

                                plugin(doc, req.body, (err, doc) => {

                                    if (err) {

                                        responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error);

                                    } else {

                                        doc.save().then(() => { //removed product to remove warning

                                            logger.emitter.emit('level');
                                            responseFunctions.sendJSONresponse(null, res, filename, methodname, config.status.good, {msg: messages.config.config_updated});

                                        }).catch((reason) => {

                                            responseFunctions.sendJSONresponse(reason, res, filename, methodname, config.status.error);

                                        });

                                    }

                                });

                            }

                        } else {

                            responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error);
                        }

                    }

                });

            }

        }
        else{

            responseFunctions.sendJSONresponse(new Error(messages.db.not_available), res, filename, methodname, config.status.error);

        }

    });

};

/**
 * postConfig
 * @param doc
 * @param body
 * @param callback
 */
function updateConfig(doc, body, callback){

    let err = null;

    if (doc.logLevel) {

        if(logger.validate(body.logLevel)) {
            doc.logLevel = body.logLevel ? body.logLevel : 'undefined';

        }
        else{
            err = new Error(messages.config.config_invalid_logLevel+body.logLevel);
        }

    }
    else {
        err = new Error(messages.config.config_doc_logLevel_undefined)

    }

    callback(err, doc);

}

/**
 * getConfig
 * @param req
 * @param res
 */
module.exports.getConfig = function(req,res){

    const methodname = 'getConfig';

    responseFunctions.defaultResponse(req, res, filename, methodname, (req, res)=>{

        if (db.dbConnected()) {

            mongo.find({_id: configDB.getID()}, mongo.configProject, (err, doc) => {

                responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.good, doc);

            });
        }
        else {

            responseFunctions.sendJSONresponse(new Error(messages.db.not_available), res, filename, methodname, config.status.error);

        }

    });

};

/**
 * deleteConfig
 * @param req
 * @param res
 */
module.exports.deleteConfig = function (req, res) {

    const methodname = 'deleteConfig';

    responseFunctions.defaultResponse(req, res, filename, methodname, (req,res)=>{

        // noinspection JSUnresolvedVariable
        let id = req.params.configid;

        try {

            if (db.dbConnected()) {
                // noinspection JSUnresolvedVariable
                mongo.delete(mongo.configProject, id, (err) => { //removed doc to supress warning

                    if (err) {

                        responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error);

                    } else {
                        // noinspection JSUnresolvedVariable
                        responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.good, {msg: mongo.configProject + ': deleted doc: ' + id});

                        logger._info({filename: __filename, methodname: methodname, message: mongo.configProject + ': deleted doc: ' + id});

                    }

                });

            } else {

                responseFunctions.sendJSONresponse(new Error(messages.db.not_available), res, filename, methodname, config.status.error);

            }
        }
        catch(err){

            responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error);

        }

    });

};


