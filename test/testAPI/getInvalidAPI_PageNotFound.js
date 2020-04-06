'use strict';


require('../../app_config/environment').getEnvironmentVariables();

const testFunction = require('../utilities/testFunctions.js');
const serverOpts = require('./apiServerDefinitions');
const request = require('request');


const apiCall = '/invalidRoute';

const expectedBody = {
};

//============================================================================================
// GET /api/info returns body and Good status
//============================================================================================

module.exports.getInvalidAPI_PageNotFound={

    testName: "getInvalidAPI_PageNotFound",
    root:serverOpts.apiOptions.root,
    method:serverOpts.GET+' '+serverOpts.apiOptions.path+apiCall,
    result: 'should return Page Not Found status',
    resultMsg: 'GET invalid API call returns Page Not Found status',
    expectedStatus: serverOpts.PAGE_NOT_FOUND,
    expectedBody:expectedBody,
    setupData:{assert:{}},
    requestOptions : {
        getOptions : {url: serverOpts.apiOptions.server + serverOpts.apiOptions.path + apiCall,
            method: serverOpts.GET,
            json: {},
            qs: {}
        }
    },
    tests:{
        before: (testData, done)=>{

            request(testData.requestOptions.getOptions, (err, response)=>{

                if(err)  testFunction.handleError();

                else {
                    testData.setupData.assert = [
                        {assertion: testData.tests.statusAssertion, actual: response.statusCode, expected: testData.expectedStatus, test: 'response status'}
                    ];

                    testData.tests.testAction(testData, done);
                }
            });

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

        assertionMsg: ': Assertion failed for test on : ',
        statusAssertion : testFunction.generalAssertion,
        bodyAssertion: testFunction.generalAssertion,

    }

};
