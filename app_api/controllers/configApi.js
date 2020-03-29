'use strict';

const logger = require('../../app_utilities/logger');
const config = require('../../app_config/config');
const mongo = require('../models/mongoActions');
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

        logger._info({filename: filename, methodname: methodname, message: 'do stuff'});

        responseFunctions.sendJSONresponse(null, res, filename, methodname, config.status.good, {msg: 'updateConfig'});

    });

};

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
        mongo.delete(mongo.configProject, id, (err,doc)=>{

            console.log(doc);

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


