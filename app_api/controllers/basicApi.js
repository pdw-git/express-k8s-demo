/**
 * basicApi
 *
 * Created by Peter Whitehead March 2020
 *
 * Baseline application that serves an API and basic web pages
 *
 * Copyright Peter Whitehead @2020
 *
 * Licensed under Apache-2.0
 */

'use strict';

const logger = require('../../app_utilities/logger');
const config = require('../../app_config/config');
const messages= require('../../app_utilities/messages').messages;
const fs = require('fs');
const responseFunctions = require('./responseFunctions');
const mongo = require('../models/mongoActions');
const { exec } = require('child_process');
const db = require('../models/db');
const configDB = require('../models/configDB/configDB_Actions');
const info = require('../../info');
const mq = require('../../app_utilities/messaging/messageQ');

const filename = __filename;

/**
 * getStatus
 *
 * GET /api/status
 *
 * @param req
 * @param res
 */
module.exports.getStatus = function(req, res){

    const methodname = 'getStatus';

    responseFunctions.defaultResponse(req, res, filename, methodname, (req, res)=> {

        let responseMsg =
            {
                logLevel: logger.getLogLevel(),
                inProduction: process.env.EXP_API_IN_PRODUCTION,
                dataBase: {
                  location: db.getURI(),
                  connected: db.dbConnected(),
                },
                messageBus:{
                    subscribed: mq.configTopic,
                    recvClient: mq.getmsgRX().state,
                    sendClient: mq.getMsgTX().state

                }

            };


        responseFunctions.sendJSONresponse( null, res, filename, methodname, config.status.good, responseMsg);

    });

};

/**
 * getInfo
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

    info.version = process.env.EXP_API_API_VERSION;

    responseFunctions.defaultResponse(req, res, filename, methodname, (req, res)=> {

        responseFunctions.sendJSONresponse(null, res, filename, methodname, config.status.good, info);

    });

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

    responseFunctions.defaultResponse(req, res, filename, methodname, (req, res)=> {

        responseFunctions.sendJSONresponse( null, res, filename, methodname, config.status.good, {version: process.env.EXP_API_API_VERSION});

    });

};

/**
 * getTest
 *
 * Execute the mocha tests for this server and return the results
 *
 * GET /api/test
 *
 * @param req
 * @param res
*/
module.exports.getTest = function(req, res){

    const methodname = 'getTest';

    logger._debug({filename: filename, methodname: methodname, message: 'started'});

    if(db.dbConnected()) {

        mongo.find({}, mongo.configProject, (err, doc) => {

            if ((err)) {

                responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error);

            } else if(doc[0].testRunning) {

                responseFunctions.sendJSONresponse((new Error('Test is already running')), res, filename, methodname, config.status.error);

            }else{

                doc[0].tests[0].directory !== undefined ?
                    executeTest(doc[0].tests[0].directory, doc, res):
                    responseFunctions.sendJSONresponse((new Error('Missing test directory')), res, filename, methodname, config.status.error);

            }

        });

   }
    else{

        responseFunctions.sendJSONresponse(new Error(messages.db.not_available), res, filename, methodname, config.status.error);

    }

};



/**
 * getErrors
 *
 * Find the error objects in the Mocha results
 * @param jsonData
 * @returns {[{}]}
 */
function getErrors(jsonData){

    const methodname = 'getErrors';

    logger._debug({filename: filename, methodname: methodname, message: 'started'});

    const errors = [];

    if(jsonData.failures !== undefined){

        if(jsonData.failures.length > 0){

            for(let i = 0; i < jsonData.failures.length; i++){

                // noinspection JSUnresolvedVariable
                errors[i]={
                    message: jsonData.failures[i].err.message,
                    actual: jsonData.failures[i].err.actual,
                    expected: jsonData.failures[i].err.expected
                };

            }

        }

    }

    return errors;

}


/**
 * executeTest
 *
 * @param testFiles
 * @param doc
 * @param res
 */
function executeTest(testFiles, doc, res){

    let methodname = 'executeTest';

    configDB.setTestRunning(true, (err, doc) => {

        //doc here is the version of configuration before the atomic update was attempted.

        if (err) {

            responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error);
        }
        else if(doc.testRunning) {

            responseFunctions.sendJSONresponse(new Error('Tests were running before atomic update attempted'), res, filename, methodname, config.status.error);

        } else {

            // noinspection JSUnresolvedVariable
            const testScript = doc.homeDir + config.tests[0].testScript;
            const executionDIR = doc.homeDir;
            const deployment = doc.deploymentMethod;
            const results = doc.homeDir + config.tests[0].results;
            const command = testScript + ' ' + executionDIR + ' ' + deployment + ' ' + testFiles + ' ' + results;

            exec(command, (err, stdout) => { //removed stderr to supress warnings

                let methodname = 'exec';

                if ((err) && (err.code < 0)) {

                    configDB.setTestRunning(false, () => {

                        logger._error({filename: __filename, methodname: methodname, message: 'err.code: ' + err.code + ': ' + doc[0].mongo.testRunning + ': ' + doc[0].mongo.testRunning + ': ' + err.message + ': STDOUT : ' + stdout});
                        responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error);

                    });

                } else {

                    completeTest(results, res);

                }

            });

        }

    });

}

/**
 * completeTest
 *
 * @param testDir
 * @param res
 */
function completeTest(testDir, res){

    const methodname = 'completeTest';

    //do an async read of the results file and then respond
    fs.readFile(testDir, (err, data) => {

        if (err) {

            configDB.setTestRunning(false, () => {
                responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error);
            });

        } else {

            let parsedData = null;

            try {
                // noinspection JSCheckFunctionSignatures
                parsedData = JSON.parse(data);

            } catch (err) {

                logger._error({filename: __filename, methodname: methodname, message: messages.cannot_parse_JSON_file+err.message});
                parsedData = null;

            } finally {

                parsedData === null ?
                    responseFunctions.sendJSONresponse(new Error(messages.cannot_parse_JSON_file), res, __filename, methodname, config.status.error):
                    responseFunctions.sendJSONresponse(null, res, __filename, methodname, config.status.good, getTestResults(parsedData));

                configDB.setTestRunning(false, () => {

                    logger._info({filename: filename, methodname: methodname, message: messages.basic.child_process_completed});

                });

            }

        }

    });

}

/**
 * getTestResults
 * @param results
 * @returns {{}}
 */
function getTestResults(results){

    const methodname = 'getTestResults';

    logger._debug({filename: filename, methodname: methodname, message: 'started'});

    let returnVal = {msg: messages.api.object_undefined+': results'};

    if(typeof(results) !== 'object'){
        logger._error({filename: __filename, methodName: methodname, message: returnVal.msg});
    }
    else{

        returnVal = {
            stats: {
                suites: results.stats.suites,
                tests: results.stats.tests,
                passes: results.stats.passes,
                pending: results.stats.pending,
                failures: results.stats.failures,
                start: results.stats.start,
                end: results.stats.end,
                duration: results.stats.duration,
                errors: getErrors(results)
            }

        };

    }

    return returnVal

}


