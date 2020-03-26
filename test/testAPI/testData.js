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
//const  messages = require('../../app_utilities/messages').messages;
const config = require('../../app_config/config');

//Acceptable status codes
const GOOD_STATUS = 200;
const PAGE_NOT_FOUND = 404;
//const ERROR_STATUS = 500;

//server definitions

const port = process.env.PORT || config.defaultPort;  //take environment variable over the default configuration.

const urlType = ((process.env.HTTPS === 'true') || (config.encryption.enabled)) ? 'https://' : 'http://';

const apiOptions = {
    server: urlType+config.ip+":"+port,
    path: config.apiRoute
};


module.exports.testDefinitions={
    assertionTests: [
        //============================================================================================
        // GET /api/info good status
        //============================================================================================
        {
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
                assertionMsg: 'getInfoGoodStatus: Assertion failed for test on response object: ',
                assertion : testFunction.generalAssertion
            }

        },
        //============================================================================================
        // GET /api/info test body content
        //============================================================================================
        {

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
                assertionMsg: 'getInfoTestBody: Assertion failed for test on response object: ',
                assertion : testFunction.generalAssertion
            }

        },
        //============================================================================================
        // GET /api/status good status
        //============================================================================================
        {
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
                assertionMsg: 'getStatusExpectedGoodResults: Assertion failed for test on response object: ',
                assertion : testFunction.generalAssertion
            }

        },
        //============================================================================================
        // GET /api/status test body
        //============================================================================================
        {
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
                assertionMsg: 'getStatusExpectedGoodResults: Assertion failed for test on response object: ',
                assertion : testFunction.generalAssertion
            }

        },
        //============================================================================================
        // GET /api/invalidMethod
        //============================================================================================
        {
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
                assertionMsg: 'etInvalidAPI_MethodExpectedPageNotFound: Assertion failed for test on response object: ',
                assertion : testFunction.generalAssertion
            }

        },
        //============================================================================================
        // GET /api/version good status
        //============================================================================================
        {
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
                assertionMsg: 'getAPI_VersionExpectedGoodStatus: Assertion failed for test on response object: ',
                assertion : testFunction.generalAssertion
            }

        },
        //============================================================================================
        // GET /api/version test body content
        //============================================================================================
        {
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
                assertionMsg: 'getAPI_VersionExpectedGoodStatus: Assertion failed for test on response object: ',
                assertion : testFunction.generalAssertion
            }

        }

    ]

};
