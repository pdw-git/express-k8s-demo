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

require('../../app_config/environment').getEnvironmentVariables();

const testFunction = require('./testFunctions.js');
const config = require('../../app_config/config');

//Acceptable status codes
const GOOD_STATUS = 200;
const PAGE_NOT_FOUND = 404;
const ERROR_STATUS = 500;

//server definitions

const port = process.env.PORT;  //take environment variable over the default configuration.

const urlType = (process.env.HTTPS === 'yes') ? 'https://' : 'http://';

const apiOptions = {
    server: urlType+process.env.APP_IP+":"+port,
    path: process.env.API_ROUTE
};

let tests = [{}];

for (let i=0; i < config.tests.length; i++){

    tests[i] = {area: config.tests[i].area, directory: process.env.APP_DIR+config.tests[i].directory+config.tests[i].area};

}
const configExpectedBody = [{
    inProduction: process.env.NODE_ENV_PRODUCTION,
    deploymentMethod: process.env.NODE_ENV_DEPLOYMENT,
    logLevel: process.env.LOGGING_LEVEL,
    homeDir: process.env.APP_DIR,
    ipAddress: process.env.APP_IP,
    indexRoute: process.env.INDEX_ROUTE,
    apiRoute: process.env.API_ROUTE,
    userRoute: process.env.USER_ROUTE,
    port: process.env.PORT,
    mongo : {
        name: process.env.MONGO_DB_NAME,
        uri: process.env.MONGO_URI,
        port: process.env.MONGO_PORT,
        configObjectName: config.mongo.configObjectName
    },
    encryption: {
        enabled: process.env.HTTPS,
        certProvider: process.env.CERT_PROVIDER,
        store: process.env.KEY_STORE,
        key: process.env.APP_KEY,
        cert: process.env.APP_CERT
    },
    tests: tests,
    __v: 0
}];

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
            requestTestObjectName: 'statusCode',
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
            requestTestObjectName: 'body',
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
                assertionMsg: 'getInvalidAPI_MethodExpectedPageNotFound: Assertion failed for test on response object: ',
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

        },
        //============================================================================================
        // GET /api/config good status
        //============================================================================================
        {
            testName: "getGonfigExpectedGoodStatus",
            root:"api",
            method:"GET "+apiOptions.path+"/config",
            result: 'should return good status: '+GOOD_STATUS,
            expectedResultMsg: "Good status returned",
            requestTestObjectName: 'statusCode',
            body: {},
            statusCode: GOOD_STATUS,
            requestOptions: {
                url: apiOptions.server + apiOptions.path + "/config",
                method: "GET",
                json: {},
                qs: {}
            },
            environment:{
                before : ()=>{},
                after : ()=>{},
                assertionMsg: 'getGonfigExpectedGoodStatus: Assertion failed for test on response object: ',
                assertion : testFunction.generalAssertion
            }

        },
        //============================================================================================
        // GET /api/config Test Body
        //============================================================================================
        {
            testName: "getGonfigTestBody",
            root:"api",
            method:"GET "+apiOptions.path+"/config",
            result: 'should return good status: '+GOOD_STATUS,
            expectedResultMsg: "Correct body returned",
            requestTestObjectName: 'body',
            body:configExpectedBody,
            statusCode: GOOD_STATUS,
            requestOptions: {
                url: apiOptions.server + apiOptions.path + "/config",
                method: "GET",
                json: {},
                qs: {}
            },
            environment:{
                before : ()=>{},
                after : ()=>{},
                assertionMsg: 'getConfigTestBody: Assertion failed for test on response object: ',
                assertion : testFunction.assertMongoObject
            }

        },
        //============================================================================================
        // POST /api/config/:configid good status
        //============================================================================================
        {
            testName: "updateConfigExpectedErrortatus",
            root:"api",
            method:"POST "+apiOptions.path+"/config",
            result: 'should return good status: '+GOOD_STATUS,
            expectedResultMsg: "Error status returned, for bad id",
            requestTestObjectName: 'statusCode',
            body: {},
            statusCode: ERROR_STATUS,
            requestOptions: {
                url: apiOptions.server + apiOptions.path + "/config/1234567",
                method: "POST",
                json: {},
                qs: {}
            },
            environment:{
                before : ()=>{},
                after : ()=>{},
                assertionMsg: 'updateConfigExpectedGoodStatus: Assertion failed for test on response object: ',
                assertion : testFunction.generalAssertion
            }

        },
        //============================================================================================
        // POST /api/config/:configid test body
        //============================================================================================
        {
            testName: "updateConfigTestBodyExpectErrorStatus",
            root:"api",
            method:"POST "+apiOptions.path+"/config",
            result: 'should return good status: '+GOOD_STATUS,
            expectedResultMsg: "Error status returned for bad id ",
            requestTestObjectName: 'body',
            body: {
                "err": {
                    "message": "Cast to ObjectId failed for value \"1234567\" at path \"_id\" for model \"configuration\"",
                    "name": "CastError",
                    "stringValue": "\"1234567\"",
                    "value": "1234567",
                    "path": "_id",
                    "reason": {}
                }
            },
            statusCode: ERROR_STATUS,
            requestOptions: {
                url: apiOptions.server + apiOptions.path + "/config/1234567",
                method: "POST",
                json: {},
                qs: {}
            },
            environment:{
                before : ()=>{},
                after : ()=>{},
                assertionMsg: 'updateConfigTestBodyExpectErrorStatus: Assertion failed for test on response object: ',
                assertion : testFunction.generalAssertion
            }

        }
        //============================================================================================
        // DELETE /api/config good status
        //============================================================================================
//        {
//            testName: "deleteGonfigExpectedGoodStatus",
//            root:"api",
//            method:"DELETE "+apiOptions.path+"/config",
//            result: 'should return good status: '+GOOD_STATUS,
//            expectedResultMsg: "Good status returned",
//            requestTestObjectName: 'statusCode',
//            body: {},
//            statusCode: GOOD_STATUS,
//            requestOptions: {
//                url: apiOptions.server + apiOptions.path + "/config/1234567",
//                method: "DELETE",
//                json: {},
//                qs: {}
//            },
//            environment:{
//                before : ()=>{},
//                after : ()=>{},
//                assertionMsg: 'deleteConfigExpectedGoodStatus: Assertion failed for test on response object: ',
//                assertion : testFunction.generalAssertion
//            }
//
//        },
        //============================================================================================
        // DELETE /api/config test body
        //============================================================================================
//        {
//            testName: "deleteGonfigTestBody",
//            root:"api",
//            method:"DELETE "+apiOptions.path+"/config",
//            result: 'should return good status: '+GOOD_STATUS,
//            expectedResultMsg: "Good status returned",
//            requestTestObjectName: 'body',
//            body: {msg: 'deleteConfig'},
//            statusCode: GOOD_STATUS,
//            requestOptions: {
//                url: apiOptions.server + apiOptions.path + "/config/1234567",
//                method: "DELETE",
//                json: {},
//                qs: {}
//            },
//            environment:{
//                before : ()=>{},
//                after : ()=>{},
//                assertionMsg: 'deleteConfigTestBody: Assertion failed for test on response object: ',
//                assertion : testFunction.generalAssertion
//            }
//
//        },

    ]

};
