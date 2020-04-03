'use strict';

const logger = require('../../app_utilities/logger');
const config = require('../../app_config/config');
const mongo = require('../models/mongoActions');
const messages = require('../../app_utilities/messages').messages;
const responseFunctions = require('./responseFunctions');
const filename = __filename;


/**
 * updateConfig
 * @param req
 * @param res
 */
module.exports.updateConfig = function(req,res){

    const methodname = 'updateConfig';

    responseFunctions.defaultResponse(req, res, filename, methodname, (req, res)=> {

        // noinspection JSUnresolvedVariable
        if(!req.params.configid){

            responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error, {msg: messages.req_params_not_found+'req.params.config'});

        }
        else {
             // noinspection JSUnresolvedVariable
            mongo.update(config.mongo.configObjectName,{_id: req.params.configid}, (err, doc) => {

                if (err) {

                    responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error, {msg: err.msg});

                } else {

                    if (typeof (req.body) === "object"){

                        updateConfig(doc, req.body);

                        doc.save().then((product)=>{

                            logger._debug({filename: __filename, methodname: methodname, message: product});

                            responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.good, {msg: messages.config.config_updated});

                        }).catch((reason)=>{

                            responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error, {msg: 'error saving document: '+reason });

                        });

                    }
                    else{

                        responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error, {msg: 'req.body.doc is not an Array' });
                    }

                }

            });

        }

    });

};

/**
 * updateConfig
 * @param doc
 * @param body
 */
function updateConfig(doc, body){

    doc.logLevel = body.logLevel ? body.logLevel : 'undefined';

}

/**
 * getConfig
 * @param req
 * @param res
 */
module.exports.getConfig = function(req,res){

    const methodname = 'getConfig';

    responseFunctions.defaultResponse(req, res, filename, methodname, (req, res)=>{

        mongo.find({},mongo.configProject, (err, doc)=>{

            responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.good, doc);

        });

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

        // noinspection JSUnresolvedVariable
        mongo.delete(mongo.configProject, id, (err)=>{ //removed doc to supress warning

            if(err){

                responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error, {err: err.msg});
            }
            else {
                // noinspection JSUnresolvedVariable
                responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.good, {msg: mongo.configProject + ': deleted doc: ' +id});

            }

        });

        logger._info({filename: __filename, methodname: 'deleteConfig', message: 'id: '+id});


    });

};


