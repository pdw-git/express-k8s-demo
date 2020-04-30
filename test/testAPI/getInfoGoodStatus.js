/**
 * getInfoGoodStatus
 *
 * Created by Peter Whitehead March 2020
 *
 * Baseline application that serves an API and basic web pages
 *
 * Copyright Peter Whitehead @2020
 *
 * Licensed under Apache-2.0
 *
 */
'use strict';

require('../../app_config/environment').getEnvironmentVariables();

const testFunction = require('../utilities/testFunctions.js');
const serverOpts = require('./apiServerDefinitions');


const apiCall = '/info';
const testName = 'getInfoGoodStatus';

const expectedBody = {
    author : "Peter Whitehead",
    email : "peter.whitehead@atos.net",
    applicationName : "express-api-app",
    version : process.env.EXP_API_API_VERSION,
    description : "A simple nodejs express based API server including an index page: NOT PRODUCTION CODE",
    GIT :{
        repo : "pdw-git/express-api",
        visibility : "private"
    },
    docker : {
        repo : "https://dockerhub.com/boselane6633/express-api",
        visibility : "private"
    },
    api: {
        getInfo : "GET application information",
        getStatus : "GET application status",
        getVersion :  "GET API version",
        getConfig : "GET config Data",
        postConfig : "POST config data update",
        deleteConfig: "DELETE config data"
    }
};

//============================================================================================
// GET /api/info returns body and Good status
//============================================================================================

module.exports.getInfoGoodStatus={

    testName: testName,
    root:serverOpts.apiOptions.root,
    method:serverOpts.GET+' '+serverOpts.apiOptions.path+apiCall,
    result: 'should return good status: '+serverOpts.GOOD_STATUS+' and an valid response body ',
    resultMsg: 'GET info returns with good status and valid body object',
    expectedStatus: serverOpts.GOOD_STATUS,
    expectedBody:expectedBody,
    setupData:{assert:{}},
    requestOptions : {
        getInfo : {url: serverOpts.apiOptions.server + serverOpts.apiOptions.path + apiCall,
            method: serverOpts.GET,
            json: {},
            qs: {}
        }
    },
    tests:{
        before: (testData, done)=>{

            testFunction.testStatusAndBody(testData, testData.requestOptions.getInfo, done);

        },
        testAction: (testData, done)=>{

            try {
                testFunction.doAssertions(testData);

                testData.tests.after(null, testData, done);


            }
            catch(err){

                testData.tests.after(err, testData, done);

            }

        },
        after : (err, testData, done)=>{err ? done(err) : done();},

        assertionMsg: testName+': Assertion failed for test on : ',
        statusAssertion : testFunction.generalAssertion,
        bodyAssertion: testFunction.generalAssertion,

    }

};
