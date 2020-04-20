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

let testStarted = false;

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

    testStarted = true;

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

                        if(err) {

                            testStarted = false;

                            responseFunctions(new Error('cannot get test flag'), filename, methodname, config.status.error);

                        }
                        else{
                            executeTest(testFiles, doc, res);
                        }

                    });

                }

            });

        }
        catch(err){

            testStarted = false;

            responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error);

        }

    }
    else{

        testStarted = false;
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

    if(!doc[0].mongo.testRunning) {

        if (fs.existsSync(testFiles)) {

            try {
                dbConfig.setTestRunning(true, (err) => {

                    if (!err) {

                        // noinspection JSUnresolvedVariable
                        const testScript = doc[0].homeDir + config.tests[0].testScript;
                        const executionDIR = doc[0].homeDir;
                        const deployment = doc[0].deploymentMethod;
                        const results = doc[0].homeDir + config.tests[0].results;
                        const command = testScript + ' ' + executionDIR + ' ' + deployment + ' ' + testFiles + ' ' + results;

                        //execute the shell script that will run the mocha tests
                        //const mocha = exec(command, (err, stdout, stderr) => {

                        exec(command, (err, stdout, stderr) => {

                            let methodname = 'exec';

                            let message = err ? 'ERROR: ' + err + ': STDERR: ' + stderr : 'Started tests';

                            err ? logger._error({filename: __filename, methodname: methodname, message: message}) :
                                completeTest(results, res, 0);

                        });

                        //Handle the close event of Mocha
                        //mocha.on('close', (code) => {

                        //});

                    }
                    //There was an error in the setting of the mongo.testRunning flag
                    else {
                        responseFunctions.sendJSONresponse(null, res, filename, methodname, config.status.good, {msg: err.message});
                    }

                });
            }
            //Error caught in the whole test process. Catch all for any errors found once test started
            // that were not handled elsewhere.
            catch (err) {

                dbConfig.setTestRunning(false, () => {

                    testStarted = false;
                    responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error);

                });

            }

        } else {

            testStarted = false;
            responseFunctions.sendJSONresponse(new Error('Test files not found'), res, filename, methodname, config.status.error);

        }
    }
    else {

        responseFunctions.sendJSONresponse(null, res, filename, methodname, config.status.good, {msg: 'Test already running: testStarted: '+testStarted+' : mongo flag: '+doc[0].mongo.testRunning} );

    }

}

function completeTest(testDir, res, code){
    const methodname = 'mocha.on(close)';

    //do an async read of the results file and then respond
    fs.readFile(testDir, (err, data) => {

        if (err) {

            dbConfig.setTestRunning(false, () => {
                testStarted = false;
                responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error);
            });

        } else {

            //if mocha does not complete with an exit code of 0 or 1 then respond with an error
            //Mocha will exit with a 1 when an error is found but this is reported in the JSON
            //output where it will be captured in the response output.
            if (code < 0) {

                dbConfig.setTestRunning(false, () => {

                    testStarted = false;

                    responseFunctions.sendJSONresponse((new Error('Mocha exited with code: ' + code)), res, filename, methodname, config.status.error, {msg: filename + '-' + methodname + ': exit code: ' + code + ' data: ' + data});

                });

            }
            else {

                let parsedData = null;

                try {
                    // noinspection JSCheckFunctionSignatures
                    parsedData = JSON.parse(data);

                } catch (err) {

                    logger._error({filename: __filename, methodname: methodname, message: messages.cannot_parse_JSON_file+': testStarted: '+testStarted});
                    parsedData = null;

                } finally {


                    dbConfig.setTestRunning(false, () => {

                        parsedData === null ?
                            responseFunctions.sendJSONresponse((new Error(messages.cannot_parse_JSON_file+' testStarted: '+testStarted)), res, __filename, methodname, config.status.error) :
                            responseFunctions.sendJSONresponse(null, res, __filename, methodname, config.status.good, getTestResults(parsedData));

                        testStarted=false;

                        logger._info({filename: filename, methodname: methodname, message: messages.basic.child_process_completed + code});

                    });

                }

            }

        }

    });


}


