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
 * @type {number}
 */
//Acceptable status codes
const GOOD_STATUS = 200;
const PAGE_NOT_FOUND = 404;

const config = require('../../app_config/config');

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

//Expected good results for GET /api/info
module.exports.getInfoExpectedGoodResults = {

    testName: "getInfoExpectedGoodResults",
    root:"api",
    method:"GET "+apiOptions.path+"/info",
    result: "should return info object and 200",
    expectedResultMsg: "status 200 and body with application name and version",
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
    status: GOOD_STATUS,
    requestOptions: {
        url: apiOptions.server + apiOptions.path + "/info",
        method: "GET",
        json: {},
        qs: {}
    }

};

//============================================================================================
// GET /api/status
//============================================================================================

//Expected good results for GET /api/status
module.exports.getStatusExpectedGoodResults = {
    testName: "getStatusExpectedGoodResults",
    root:"api",
    method:"GET "+apiOptions.path+"/status",
    result: "should return status object and 200",
    expectedResultMsg: "status 200 and body with status and status message",
    body: {
        status: GOOD_STATUS,
        msg: "Sending good status"
    },
    status: GOOD_STATUS,
    requestOptions: {
        url: apiOptions.server + apiOptions.path + "/status",
        method: "GET",
        json: {},
        qs: {}
    }

};

//============================================================================================
// GET /api/invalidMethod
//============================================================================================

//Expected good results for GET /api/invalidMethod
module.exports.getInvalidAPI_MethodExpectedPageNotFound = {
    testName: "getInvalidAPI_MethodExpectedPageNotFound",
    root:"api",
    method:"GET invalid method name",
    result: "should receive a Page Not Found Status",
    expectedResultMsg: "status 404",
    body: null,
    status: PAGE_NOT_FOUND,
    requestOptions: {
        url: apiOptions.server + apiOptions.path + "/invalidMethod",
        method: "GET",
        json: {},
        qs: {}
    }

};

//============================================================================================
// GET /api/version
//============================================================================================

//Expected good results for GET /api/version
module.exports.getVersion_ExpectedGoodStatus= {
    testName: "getAPI_VersionExpectedGoodStatus",
    root:"api",
    method:"GET "+apiOptions.path+"/version",
    result: "should receive a version object and 200",
    expectedResultMsg: "Good Status",
    body: {
        version: "1.0.0"
    },
    status: GOOD_STATUS,
    requestOptions: {
        url: apiOptions.server + apiOptions.path + "/version",
        method: "GET",
        json: {},
        qs: {}
    }

};

