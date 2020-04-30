/*!
 * appTest
 *
 * Copyright(c) 2020 Peter Whitehead
 * Apache Licensed
 */

'use strict';

/*
Simple test application for GET requests supported in the express-api app.
Does not support POST/UPDATE/DELETE
 */

let request = require('request');
//Get input from the command line
let myArgs = process.argv.slice(2);

//The delay between request submissions
let delay = myArgs[0] ? myArgs[0] : 0;

//The ip Address of the application
let ipAddress = myArgs[1] ?  myArgs[1] : '127.0.0.1:3000';

//The API call to be made
let apiCall = myArgs[2] ? myArgs[2] : status;

//The request options
let options = {
    url: 'http://'+ipAddress + "/api/"+apiCall,
    method: "get",
    json: {},
    qs: {}
};

const testAlreadyRunning = 'Test is already running';

console.log('Options: '+JSON.stringify(options));
console.log('Delay = '+delay);
console.log('ipAddress = '+ipAddress);

let increment = 1;
let start = Date.now();

console.log('start time: '+start);

//Send the initial request
request(options, test);

/**
 * test
 *
 * A recursive function run periodically.
 * Send an http request and on completion print out the response body.
 * Ignore messages stating that there has been a clash between api/test requests.
 * Log any other errors.
 *
 * @param err
 * @param res
 */
function test(err, res){

    (err) ? handleErr(err) : responseReport(res);

    increment++;

    start = Date.now();

    setTimeout(()=>{request(options, test)},delay);

}

/**
 * handleErr
 * @param err
 */
function handleErr(err){

    console.log(increment+': ERROR: '+err)
    console.log('Exiting test application');
    process.exit(-1);

}

function responseReport(res){

    let LogHeader = increment + ': delay: ' + delay + ': duration: '+ String(Date.now() - start - delay) + 'ms : ';

    //validate that the data needed in the report is available
    //Do not report on errors that are due to a test already running if the API call is api/test
    ((res.statusCode !== undefined) && ((res.body.err !== testAlreadyRunning) && apiCall === 'test')) ?

        //if there is a good status log the full response otherwise log the response and the associated error code
        res.statusCode === 200 ?

            console.log(LogHeader + JSON.stringify(res.body)) :
            console.log(LogHeader + "ERROR: " + res.statusCode + ' ' + JSON.stringify(res.body))

        : {};

}