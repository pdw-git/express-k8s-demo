'use strict';
/**
 * testData
 *
 * The file that provides the data used to test the API.
 *
 * The JSON objects holds descriptive information for each test along with expected results (request body and status)
 *
 * Each object is for a specific test and is exported from this module.
 *
 */

const testFunction = require('./testFunctions.js');
const  messages = require('../../app_utilities/messages').messages;
const config = require('../../app_config/config');

//Acceptable status codes
const GOOD_STATUS = 200;
const PAGE_NOT_FOUND = 404;
const ERROR_STATUS = 500;

//server definitions

const port = process.env.PORT || config.defaultPort;  //take environment variable over the default configuration.

const urlType = ((process.env.HTTPS === 'true') || (config.encryption.enabled)) ? 'https://' : 'http://';

const apiOptions = {
    server: urlType+config.ip+":"+port,
    path: config.apiRoute
};



//============================================================================================
// TEST DATA
//============================================================================================

//============================================================================================
// GET /api/info
//============================================================================================

module.exports.getInfoGoodStatus = {

    testName: "getInfoGoodStatus",
    root:"api",
    method:"GET "+apiOptions.path+"/info",
    result: "should return good status: "+GOOD_STATUS,
    expectedResultMsg: "Good status returned",
    requestTestObjectName: 'statusCode',
    body: {
    },
    statusCode: GOOD_STATUS,
    requestOptions: {
        url: apiOptions.server + apiOptions.path + "/info",
        method: "GET",
        json: {},
        qs: {}
    },
    environment:{
        before : ()=>{},
        after : ()=>{},
        assertionMsg: 'Assertion failed for test on response object: ',
        assertion : testFunction.generalAssertion
    }

};

module.exports.getInfoTestBody = {

    testName: "getInfoTestBody",
    root:"api",
    method:"GET "+apiOptions.path+"/info",
    result: "should return a body that matches expected results",
    expectedResultMsg: "Expected response body",
    requestTestObjectName: 'body',
    body: {
        "author" : "Peter Whitehead",
        "email" : "peter.whitehead@atos.net",
        "applicationName" : "express-api-app",
        "version" : "1.0.0.0",
        "description" : "A simple nodejs express based API server including an index page: NOT PRODUCTION CODE",
        "GIT" :{
            "repo" : "pdw-git/express-api",
            "visibility" : "private"
        },
        "docker" : {
            "repo" : "https://dockerhub.com/boselane6633/express-api",
            "visibility" : "private"
        },
        "api":  {
            "info" : "GET application information",
            "status" : "GET application status"
        }
    },
    statusCode: GOOD_STATUS,
    requestOptions: {
        url: apiOptions.server + apiOptions.path + "/info",
        method: "GET",
        json: {},
        qs: {}
    },
    environment:{
        before : ()=>{},
        after : ()=>{},
        assertionMsg: 'Assertion failed for test on response object: ',
        assertion : testFunction.generalAssertion
    }

};

//============================================================================================
// GET /api/status
//============================================================================================


module.exports.getStatusGoodstatus = {
    testName: "getStatusExpectedGoodResults",
    root:"api",
    method:"GET "+apiOptions.path+"/status",
    result: "Should return good status: "+GOOD_STATUS,
    expectedResultMsg: "Good status returned",
    body: {
    },
    statusCode: GOOD_STATUS,
    requestOptions: {
        url: apiOptions.server + apiOptions.path + "/status",
        method: "GET",
        json: {},
        qs: {}
    },
    environment:{
        before : ()=>{},
        after : ()=>{},
        assertionMsg: 'Assertion failed for test on response object: ',
        assertion : testFunction.generalAssertion
    }

};

module.exports.getStatusTestBody = {
    testName: "getStatusExpectedGoodResults",
    root:"api",
    method:"GET "+apiOptions.path+"/status",
    result: "Should return good status: "+GOOD_STATUS,
    expectedResultMsg: "Good status returned",
    body: {
        status: GOOD_STATUS,
        msg: 'Sending good status'
    },
    statusCode: GOOD_STATUS,
    requestOptions: {
        url: apiOptions.server + apiOptions.path + "/status",
        method: "GET",
        json: {},
        qs: {}
    },
    environment:{
        before : ()=>{},
        after : ()=>{},
        assertionMsg: 'Assertion failed for test on response object: ',
        assertion : testFunction.generalAssertion
    }

};

//============================================================================================
// GET /api/invalidMethod
//============================================================================================

//Expected good results for GET /api/invalidMethod
module.exports.getApiPageNotFound = {
    testName: "getInvalidAPI_MethodExpectedPageNotFound",
    root:"api",
    method:"GET invalid method name",
    result: "should receive a Page Not Found Status",
    expectedResultMsg: "Status 404",
    body: {},
    statusCode: PAGE_NOT_FOUND,
    requestTestObjectName: 'statusCode',
    requestOptions: {
        url: apiOptions.server + apiOptions.path + "/invalidMethod",
        method: "GET",
        json: {},
        qs: {}
    },
    environment:{
        before : ()=>{},
        after : ()=>{},
        assertionMsg: 'Assertion failed for test on response object: ',
        assertion : testFunction.generalAssertion
    }

};

//============================================================================================
// GET /api/version
//============================================================================================

module.exports.getVersionGoodStatus= {
    testName: "getAPI_VersionExpectedGoodStatus",
    root:"api",
    method:"GET "+apiOptions.path+"/version",
    result: 'should return good status: '+GOOD_STATUS,
    expectedResultMsg: "Good status returned",
    requestTestObjectName: 'statusCode',
    body: {},
    statusCode: GOOD_STATUS,
    requestOptions: {
        url: apiOptions.server + apiOptions.path + "/version",
        method: "GET",
        json: {},
        qs: {}
    },
    environment:{
        before : ()=>{},
        after : ()=>{},
        assertionMsg: 'Assertion failed for test on response object: ',
        assertion : testFunction.generalAssertion
    }

};

module.exports.getVersionTestBody= {
    testName: "getAPI_VersionExpectedGoodStatus",
    root:"api",
    method:"GET "+apiOptions.path+"/version",
    result: "should return a body that matches expected results",
    expectedResultMsg: "Expected response body",
    requestTestObjectName: 'body',
    body: {
        version: "1.0.0"
    },
    statusCode: GOOD_STATUS,
    requestOptions: {
        url: apiOptions.server + apiOptions.path + "/version",
        method: "GET",
        json: {},
        qs: {}
    },
    environment:{
        before : ()=>{},
        after : ()=>{},
        assertionMsg: 'Assertion failed for test on response object: ',
        assertion : testFunction.generalAssertion
    }

};

//============================================================================================
// GET /api/test
//============================================================================================

//Expected failure for GET /api/test
module.exports.getTest_TestsDoNotExist= {
    testName: "getAPI_TestFileDoesNotExist",
    root:"api",
    method:"GET "+apiOptions.path+"/test",
    result: "should receive error on response: "+ERROR_STATUS,
    expectedResultMsg: messages.api.cannot_find_test_files,
    body: {
        message: messages.api.cannot_find_test_files+config.home+config.tests.api
    },
    statusCode: ERROR_STATUS,
    requestOptions: {
        url: apiOptions.server + apiOptions.path + "/test",
        method: "GET",
        json: {},
        qs: {}
    },
    environment:{
        before : ()=>{config.tests.api = '/invalidDirectory'},
        after : ()=>{config.tests.api = config.home+'/test/apiTests.js'},
        assertionMsg: 'Assertion failed on object: ',
        assertion : testFunction.generalAssertion
    }

};



