'use strict';


require('../../app_config/environment').getEnvironmentVariables();

const testFunction = require('../utilities/testFunctions.js');
const serverOpts = require('./apiServerDefinitions');

const apiCall = '/status';
const expectedBody = {
    "status": 200,
    "msg": "Sending good status"
};

//============================================================================================
// GET /api/version returns body and Good status
//============================================================================================

module.exports.getStatusGoodStatus={

    testName: "getStatusGoodStatus",
    root:serverOpts.apiOptions.root,
    method:serverOpts.GET+' '+serverOpts.apiOptions.path+apiCall,
    result: 'should return good status: '+serverOpts.GOOD_STATUS+' and an valid response body ',
    resultMsg: 'GET version returns with good status and valid body object',
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
        assertionMsg: this.testName+': Assertion failed for test on : ',
        statusAssertion : testFunction.generalAssertion,
        bodyAssertion: testFunction.generalAssertion,

    }

};
