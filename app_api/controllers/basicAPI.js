/**

 created 28th March 2020

 */

const logger = require('../../app_utilities/logger');
const config = require('../../app_config/config');
const messages= require('../../app_utilities/messages').messages;
const fs = require('fs');
const filename = __filename;
const responseFunctions = require('./responseFunctions');
const mongo = require('../models/mongoActions');
const { exec } = require('child_process');
const db = require('../models/db');
const dbConfig = require('../models/config');
const info = require('../../info');


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

        let responseMsg = db.dbConnected() ? {mongo: db.getURI(), connected: true, logLevel: logger.getLogLevel()} : {mongo: db.getURI(), connected: false, logLevel: logger.getLogLevel()};

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

    info.version = process.env.API_VERSION;

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

        responseFunctions.sendJSONresponse( null, res, filename, methodname, config.status.good, {version: process.env.API_VERSION});

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

            } else if(doc[0].mongo.testRunning) {

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

    dbConfig.setTestRunning(true, (err) => {

        if (err) {

            responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error);

        } else {

            // noinspection JSUnresolvedVariable
            const testScript = doc[0].homeDir + config.tests[0].testScript;
            const executionDIR = doc[0].homeDir;
            const deployment = doc[0].deploymentMethod;
            const results = doc[0].homeDir + config.tests[0].results;
            const command = testScript + ' ' + executionDIR + ' ' + deployment + ' ' + testFiles + ' ' + results;

            exec(command, (err, stdout) => { //removed stderr to supress warnings

                let methodname = 'exec';

                if ((err) && (err.code < 0)) {

                    dbConfig.setTestRunning(false, () => {

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

            dbConfig.setTestRunning(false, () => {
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

                dbConfig.setTestRunning(false, () => {

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


