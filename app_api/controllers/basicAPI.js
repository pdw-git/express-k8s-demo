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

        responseFunctions.sendJSONresponse( null, res, filename, methodname, config.status.good, {
            status: config.status.good,
            msg: messages.api.good_status
        });

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

    const info = require('../../info');

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

    mongo.find({},mongo.configProject, (err, doc)=>{

       if(err){

           logger._error({filename: filename, methodname: methodname, message: err});

           responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error, {msg:message.mongo.cannot_find_object+mongo.configProject });

       }
       else{

           let testFiles = doc[0].tests[0].directory !== undefined ?
               doc[0].tests[0].directory :
               logger._error({filename: filename, methodname: methodname, message: messages.api.object_undefined+'doc[0].tests[0].directory'});

           if(fs.existsSync(testFiles)){

               // noinspection JSUnresolvedVariable
               const testScript = doc[0].homeDir+config.tests[0].testScript;
               const executionDIR = doc[0].homeDir;
               const deployment = doc[0].deploymentMethod;
               const results = doc[0].homeDir+config.tests[0].results;
               const command = testScript + ' ' + executionDIR + ' ' + deployment + ' ' + testFiles + ' ' + results;

               try {

                   //execute the shell script that will run the mocha tests
                   const mocha = exec(command, ()=>{
                       logger._info({filename: __filename, methodname: methodname, messages: command});
                   });

                   //Handle the close event of Mocha
                   mocha.on('close', (code) => {
                       const methodname = 'mocha.on(close)';

                           //do an async read of the results file and then respond
                           fs.readFile(doc[0].homeDir + config.tests[0].results, (err, data)=>{

                           if(err){

                               responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error, {msg: messages.cannot_parse_JSON_file});

                           }
                           else{

                               const parsedData = JSON.parse(data);

                               responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.good, getTestResults(parsedData));

                               logger._info({filename: filename, methodname: methodname, message: messages.basic.child_process_completed+code});

                           }

                       });

                   });

               }
               catch(err){

                  responseFunctions.sendJSONresponse(err, res, filename, methodname, config.status.error,{msg: messages.basic.child_process_error+ err});

               }

          }

           else {
               //Test files were not found, log error and return appropriate status in response.

               responseFunctions.sendJSONresponse(null, res, filename, methodname, config.status.error, {message: messages.api.cannot_find_test_files+testFiles});

           }

       }

    });

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


