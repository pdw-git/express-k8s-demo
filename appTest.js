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

usage appTest.js <delay> <ipaddress:port> <test> <ignore testAlreadyRunning>

<test> can be one of info, status, version, config, test, random
<ingore testAlreadyRunning> can be true or false
random will pick a new API command for each request based on a simple random number choice.

node appTest.js 100 https://192.168.99.125:31024 info false
node appTest.jas 0 http:localhost:3000 random true

 */

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let request = require('request');
//Get input from the command line
let myArgs = process.argv.slice(2);

//The delay between request submissions
let delay = myArgs[0] ? myArgs[0] : 0;

//The ip Address of the application
let ipAddress = myArgs[1] ?  myArgs[1] : 'http://127.0.0.1:3000';

//The API call to be made
let apiCall = myArgs[2] ? myArgs[2] : status;

//ignore test running

let ingoreTestRunningError = myArgs[3] === 'true';

//The request options used when a specific test is chosen
let options = {
    url: ipAddress + "/api/"+apiCall,
    method: "get",
    json: {},
    qs: {}
};

//Options used when random testing is chose
let testOptions = [
    {
        url: ipAddress + '/api/info',
        method: "get",
        json: {},
        qs: {}
    },
    {
        url: ipAddress + '/api/status',
        method: "get",
        json: {},
        qs: {}
    },
    {
        url: ipAddress + '/api/version',
        method: "get",
        json: {},
        qs: {}
    },
    {
        url: ipAddress + '/api/config',
        method: "get",
        json: {},
        qs: {}
    },
    {
        url: ipAddress + '/api/test',
        method: "get",
        json: {},
        qs: {}
    }

];

const testAlreadyRunning = 'Test is already running';

console.log('Options: '+JSON.stringify(options));
console.log('Delay = '+delay);
console.log('ipAddress = '+ipAddress);
console.log('API: '+apiCall);

let increment = 1;
let start = Date.now();

console.log('start time: '+start);

//chose the correct options for the request
options = apiCall === 'random' ? getRandomTest() : options;

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

    options = apiCall === 'random' ? getRandomTest() : options;

    //send a client request to the API server after a delay
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

/**
 * responseReport
 * report on the outcome of the client request
 * @param res
 */
function responseReport(res){

    let LogMessage = increment + ': delay: ' + delay + ': duration: '+ String(Date.now() - start - delay) + 'ms : ';

    //validate that the data needed in the report is available
    //Do not report on errors that are due to a test already running if the API call is api/test
    (res.statusCode !== undefined)  ?

        //if there is a good status log the full response otherwise log the response and the associated error code
        res.statusCode === 200 ?
            logResults(LogMessage + JSON.stringify(res.body))
            : filterReporting(res,LogMessage + "ERROR: " + res.statusCode + ' ' + JSON.stringify(res.body))

        : console.log('ERROR: did not get a status from the client request');

}

/**
 * logResults
 *
 * send the message to the required output medium.
 * @param message
 */
function logResults(message){
    console.log(message);
}

/**
 * getRandomInt
 * @param max
 * @returns {number}
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

/**
 * getRandomTest
 * @returns {{qs: {}, method: string, json: {}, url: string}|{qs: {}, method: string, json: {}, url: string}|{qs: {}, method: string, json: {}, url: string}|{qs: {}, method: string, json: {}, url: string}|{qs: {}, method: string, json: {}, url: string}}
 */
function getRandomTest(){

    return testOptions[getRandomInt(testOptions.length)];

}

/**
 * filterReporting
 * @param res
 * @param message
 */
function filterReporting(res, message){

    //we can choose to ignore logging errors that are caused by responses failing because the api/test is running.
    //either log all failures or filter out those with a the defined err message.
    ingoreTestRunningError === true ?
        filter(res) ?
            logResults(message) : {}
        : logResults(message);

}

/**
 *
 * @param res
 * @returns {boolean}
 */
function filter(res){

    return res.body.err !== testAlreadyRunning;

}
