'use strict';

//Acceptable status codes
module.exports.GOOD_STATUS = 200;

//server definitions

const apiOptions = {server: "http://localhost:3000"};
const apiPath = "/api";

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
    method:"getInfo",
    result: "good status",
    expectedResultMsg: "status 200 and body with application name and version",
    body: {
        applicationName: "express-api-app",
        version: "1.0.0.0"
    },
    status: this.GOOD_STATUS,
    requestOptions: {
        url: apiOptions.server + apiPath + "/info",
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
    method:"getStatus",
    result: "good status",
    expectedResultMsg: "status 200 and body with status and status message",
    body: {
        status: this.GOOD_STATUS,
        msg: 'Sending good status'
    },
    status: this.GOOD_STATUS,
    requestOptions: {
        url: apiOptions.server + apiPath + "/status",
        method: "GET",
        json: {},
        qs: {}
    }

};
