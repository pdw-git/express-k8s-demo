/**
 * getConfigGoodStatus
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
const config = require('../../app_config/config');
const serverOpts = require('./apiServerDefinitions');


//create the test object
let tests = [{}];

for (let i=0; i < config.tests.length; i++){

    tests[i] = {area: config.tests[i].area, directory: process.env.EXP_API_APP_DIR+config.tests[i].directory+config.tests[i].area};

}

const apiCall = '/config';
const testName = 'getCongfigGoodStatus';

//set up the expected body object

const expectedBody = [{
    testRunning: true,
    inProduction: process.env.EXP_API_NODE_ENV_PRODUCTION,
    deploymentMethod: process.env.EXP_API_ENV_DEPLOYMENT,
    logLevel: process.env.EXP_API_LOGGING_LEVEL,
    homeDir: process.env.EXP_API_APP_DIR,
    ipAddress: process.env.EXP_API_APP_IP,
    indexRoute: process.env.EXP_API_INDEX_ROUTE,
    apiRoute: process.env.EXP_API_API_ROUTE,
    userRoute: process.env.EXP_API_USER_ROUTE,
    port: process.env.EXP_API_PORT,
    mongoName: process.env.EXP_API_MONGO_DB_NAME,
    mongoURI: process.env.EXP_API_MONGO_URI,
    mongoConfigObjectName: config.mongo.configObjectName,
    encryptionEnabled: process.env.EXP_API_HTTPS,
    certProvider: process.env.EXP_API_CERT_PROVIDER,
    keyStore: process.env.EXP_API_KEY_STORE,
    key: process.env.EXP_API_APP_KEY,
    cert: process.env.EXP_API_APP_CERT,
    tests: tests,
    __v: 0
}];

//============================================================================================
// GET /api/config returns body and Good status
//============================================================================================

module.exports.getConfigGoodStatus={

    testName: testName,
    root:serverOpts.apiOptions.root,
    method:serverOpts.GET+' '+serverOpts.apiOptions.path+apiCall,
    result: 'should return good status: '+serverOpts.GOOD_STATUS+' and an valid response body ',
    resultMsg: 'GET config returns with good status and valid body object',
    expectedStatus: serverOpts.GOOD_STATUS,
    expectedBody:expectedBody,
    setupData:{assert:{}},
    requestOptions : {
        getConfig : {url: serverOpts.apiOptions.server + serverOpts.apiOptions.path + apiCall,
            method: serverOpts.GET,
            json: {},
            qs: {}
        }
    },
    tests:{
        before: (testData, done)=>{

            testFunction.testStatusAndBody(testData, testData.requestOptions.getConfig, done);

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
        bodyAssertion: testFunction.assertMongoObject

    }

};
