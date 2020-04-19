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

// A simple testing lock. Stop a new test from being started until this flag is true.
// This is in place because of the variences of running an external script and having
// to read results from a file.
//let testRunning = false;

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

        try {

            mongo.find({}, mongo.configProject, (err, doc) => {

                if ((err) || (doc.length === 0)) {

                    logger._error({filename: filename, methodname: methodname, message: err});

                    responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error, {msg: messages.mongo.cannot_find_object + mongo.configProject});

                } else {

                    let testFiles = doc[0].tests[0].directory !== undefined ?
                        doc[0].tests[0].directory :
                        logger._error({filename: filename, methodname: methodname, message: messages.api.object_undefined + 'doc[0].tests[0].directory'});

                    dbConfig.getTestRunning((err, doc)=>{

                        err ? responseFunctions(new Error('cannot get test flag'), filename, methodname, config.status.error) : executeTest(testFiles, doc, res);

                    });

                }

            });

        }
        catch(err){

            responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error);

        }

    }
    else{

        responseFunctions.sendJSONresponse(new Error(messages.db.not_available), res, filename, methodname, config.status.error);

    }

};

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

function executeTest(testFiles, doc, res){

    let methodname = 'executeTest';

    if ((fs.existsSync(testFiles)) && (!doc[0].mongo.testRunning)) {

        // noinspection JSUnresolvedVariable
        const testScript = doc[0].homeDir + config.tests[0].testScript;
        const executionDIR = doc[0].homeDir;
        const deployment = doc[0].deploymentMethod;
        const results = doc[0].homeDir + config.tests[0].results;
        const command = testScript + ' ' + executionDIR + ' ' + deployment + ' ' + testFiles + ' ' + results;

        try {

            //testRunning = true;
            dbConfig.setTestRunning(true, ()=>{

                //execute the shell script that will run the mocha tests
                const mocha = exec(command, (err, stdout, stderr) => {

                    let methodname = 'exec';

                    let message = err ? 'ERROR: ' + err + ': STDERR: ' + stderr : 'Started tests';

                    err ? logger._error({filename: __filename, methodname: methodname, message: message}) :
                        logger._info({filename: __filename, methodname: methodname, message: message});

                });

                //Handle the close event of Mocha
                mocha.on('close', (code) => {
                    const methodname = 'mocha.on(close)';

                    //do an async read of the results file and then respond
                    fs.readFile(doc[0].homeDir + config.tests[0].results, (err, data) => {

                        if (err) {

                            responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error);

                        } else {

                            //if mocha does not complete with an exit code of 0 or 1 then respond with an error
                            //Mocha will exit with a 1 when an error is found but this is reported in the JSON
                            //output where it will be captured in the response output.
                            if (code < 0) {

                                responseFunctions.sendJSONresponse((new Error('Mocha exited with code: ' + code)), res, filename, methodname, config.status.error, {msg: filename+'-'+methodname+': exit code: ' + code + ' data: ' + data});

                            } else {

                                //there should be a valid JSON file that can be parsed

                                let parsedData = null;

                                try {
                                    // noinspection JSCheckFunctionSignatures
                                    parsedData = JSON.parse(data);
                                } catch (err) {

                                    //testRunning = false;
                                    dbConfig.setTestRunning(false, ()=>{
                                        logger._error({filename: __filename, methodname: methodname, message: messages.cannot_parse_JSON_file});
                                        parsedData = null;
                                    });


                                } finally {

                                    dbConfig.setTestRunning(false, ()=>{

                                        parsedData === null ?
                                            responseFunctions.sendJSONresponse((new Error(messages.cannot_parse_JSON_file)), res, __filename, methodname, config.status.error) :
                                            responseFunctions.sendJSONresponse(null, res, __filename, methodname, config.status.good, getTestResults(parsedData));

                                        logger._info({filename: filename, methodname: methodname, message: messages.basic.child_process_completed + code});

                                    });

                                }

                            }

                        }

                    });

                });

            });

        } catch (err) {

            dbConfig.setTestRunning(false);
            responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error);

        }

    } else {
        //Test files were not found, log error and return appropriate status in response.

        dbConfig.getTestRunning((err, doc)=>{

            let errorMsg = doc[0].mongo.testRunning ? {msg: 'Test already running'} : {msg: 'Tests were running: testsRunning: '+doc[0].mongo.testRunning};


            err ?
                responseFunctions.sendJSONresponse(new Error(err.message), res, filename, methodname, config.status.error) :
                responseFunctions.sendJSONresponse(null, res, filename, methodname, config.status.good, errorMsg );

        });

    }

}


