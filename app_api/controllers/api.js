/**

 created 7th September 2018

 */

const logger = require('../../app_utilities/logger');
const config = require('../../app_config/config');
const messages= require('../../app_utilities/messages').messages;
const fs = require('fs');
const filename = "app_api/controllers/api.js";

/**
 * getStatus
 *
 * GET /api/status
 *
 * @param req
 * @param res
 */
module.exports.getStatus = function(req, res){

    const methodname = 'getStatus(req, res)';

    logger._debug({filename: filename, methodname: methodname, message: 'started'});

    res.status(config.status.good);

    res.json({
        status: config.status.good,
        msg: messages.api.good_status
    });

    logger._info({filename: filename, methodname: methodname, message: 'sent good status'});

    logger._debug({filename: filename, methodname: methodname, message: 'completed'});

};

/**
 * get info
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

    logger._debug({filename: filename, methodname: methodname, message: 'started'});

    res.status(config.status.good);

    res.json(info);

    logger._info({filename: filename, methodname: methodname, message: 'sent good status'});

    logger._debug({filename: filename, methodname: methodname, message: 'completed'});

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

    logger._debug({filename: filename, methodname: methodname, message: 'started'});

    res.status(config.status.good);

    res.json({
        version: config.apiVersion
    });

    logger._info({filename: filename, methodname: methodname, message: 'sent good status'});

    logger._debug({filename: filename, methodname: methodname, message: 'completed'});

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

    const methodname = 'getTest(req, res)';

    logger._debug({filename: filename, methodname: methodname, message: 'started'});

    //If the test files exist run the mocha tests and return a summary of the results
    if(fs.existsSync(config.home+config.tests.api) ){

        //Spawn a process for Mocha
        const { spawn } = require( 'child_process' );

        const mocha = spawn( 'mocha', [ '--reporter', 'JSON', config.home+config.tests.api ] );

        //Respond to the completion of the process
        mocha.stdout.on( 'data', data => {

            res.status(config.status.good);

            const parsedData = JSON.parse(data);

            res.json({
                stats: {
                    suites: parsedData.stats.suites,
                    tests: parsedData.stats.tests,
                    passes: parsedData.stats.passes,
                    pending: parsedData.stats.pending,
                    failures: parsedData.stats.failures,
                    start: parsedData.stats.start,
                    end: parsedData.stats.end,
                    duration:parsedData.stats.duration,
                    errors: getErrors(parsedData)
                }
            });
        });

        //Handle errors from Mocah process
        mocha.stderr.on( 'data', data => {

            logger._error({filename: filename, methodname: methodname, message: data});

        });

        //Handle the close event of Mocha
        mocha.on( 'close', code => {

            logger._info({filename: filename, methodname: methodname, message: `child process exited with code ${code}` });

        });

    }
    else {
        //Test files were not found, log error and return appropriate status in response.
        logger._error({filename: filename, methodname: methodname, message: messages.api.cannot_find_test_files+config.home+config.tests.api});

        res.status(config.status.error);

        res.json({message: messages.api.cannot_find_test_files+config.home+config.tests.api});

    }

    logger._info({filename: filename, methodname: methodname, message: 'sent good status'});

    logger._debug({filename: filename, methodname: methodname, message: 'completed'});

};

/**
 * getErrors
 *
 * Find the error objects in the Mocha results
 * @param jsonData
 * @returns {[{}]}
 */
function getErrors(jsonData){

    const methodname = 'getErrors(jsonData)';

    logger._debug({filename: filename, methodname: methodname, message: 'started'});

    const errors = [];

    if(jsonData.failures !== undefined){

        if(jsonData.failures.length > 0){

            for(let i = 0; i < jsonData.failures.length; i++){

                errors[i]={message: jsonData.failures[i].err.message};

            }

        }

    }

    logger._debug({filename: filename, methodname: methodname, message: 'completed'});

    return errors;

}

