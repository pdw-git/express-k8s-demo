'use strict';


require('../../app_config/environment').getEnvironmentVariables();

const testFunction = require('../utilities/testFunctions.js');
const serverOpts = require('./apiServerDefinitions');

const apiCall = '/config/';
const testName = 'postConfig-invalidConfigId';

const expectedBody = {
    "err": "Cast to ObjectId failed for value \"1234567\" at path \"_id\" for model \"configuration\"",
    "msg": "Configid is not valid"
};

//============================================================================================
// POST /api/config/:configid invalid id returns Error status
//============================================================================================

module.exports.postConfigConfigidInvalidErrorStatus={

    testName: testName,
    root:serverOpts.apiOptions.root,
    method:serverOpts.POST+' '+serverOpts.apiOptions.path+'/config/:configid',
    result: 'should return error status: '+serverOpts.ERROR_STATUS+' and an error message ',
    resultMsg: "POST to config with invalid ID fails with expected error and ERROR response status",
    expectedStatus: serverOpts.ERROR_STATUS,
    expectedBody: expectedBody,
    setupData:{assert:{}},
    requestOptions : {
        postConfig : {url: serverOpts.apiOptions.server + serverOpts.apiOptions.path + apiCall+"1234567",
            method: serverOpts.POST,
            json: {logLevel: "testValue" },
            qs: {}
        }
    },
    tests:{
        before: (testData, done)=>{

            testFunction.testStatusAndBody(testData, testData.requestOptions.postConfig, done);

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
        bodyAssertion: testFunction.generalAssertion
    }

};
