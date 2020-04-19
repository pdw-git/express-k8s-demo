'use strict';


require('../../app_config/environment').getEnvironmentVariables();

const testFunction = require('../utilities/testFunctions.js');
const config = require('../../app_config/config');
const serverOpts = require('./apiServerDefinitions');


//create the test object
let tests = [{}];

for (let i=0; i < config.tests.length; i++){

    tests[i] = {area: config.tests[i].area, directory: process.env.APP_DIR+config.tests[i].directory+config.tests[i].area};

}

const apiCall = '/config';
const testName = 'getCongfigGoodStatus';

//set up the expected body object

const expectedBody = [{
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
        configObjectName: config.mongo.configObjectName,
        testRunning: true
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
