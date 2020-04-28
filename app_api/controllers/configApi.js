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

        if(!db.dbConnected()) {

            responseFunctions.sendJSONresponse(new Error(messages.db.not_available), res, filename, methodname, config.status.error);

        }
        else {

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

                        if (typeof (req.body) !== "object") {

                            responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error)

                        }
                        else {

                            if (typeof (plugin) !== 'function') {

                                responseFunctions.sendJSONresponse(new Error(messages.mongo.typeof_plugin_error), res, filename, methodname, config.status.error);

                            } else {

                                plugin(res, doc, req.body, saveDoc);

                            }

                        }

                    }

                });

            }

        }

    });

};

/**
 * saveDoc
 * @param err
 * @param doc
 * @param res
 */
function saveDoc(err, doc, res){

    let methodname = 'saveDoc';

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

}

/**
 * updateConfig
 * @param res
 * @param doc
 * @param body
 * @param callback
 */
function updateConfig(res, doc, body, callback){

    let methodname = 'updateConfig';

    let err = null;

    if ((typeof (doc) !== 'object') || (typeof (body) != 'object')){

        err = new Error(messages.config.config_objects_undefined);

    }
    else {

        doc = updateMongooseDoc(doc, body);

        err = doc === null ? (new Error(messages.config.config_cannot_update_database)) : null;

    }

    typeof(callback) === 'function' ?callback(err, doc, res): responseFunctions.sendJSONresponse(new Error(messages.mongo.typeof_plugin_error), res, filename, methodname, config.status.error);

}


/**
 * updateMongooseDoc
 * @param doc
 * @param newData
 * @returns {*}
 */
function updateMongooseDoc(doc, newData){

    //Get the keys from the JSON object
    let keys = Object.keys(newData);

    let retVal = null;

    if (Array.isArray(keys)){

        keys.forEach((value) => {

            //set the path in the doc with the corresponding data from the source object.
            //doc.set ignores any paths that do not exist in the schema
            doc.set(value, newData[value]);

            retVal = doc;

        });

    }

    return retVal;

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


