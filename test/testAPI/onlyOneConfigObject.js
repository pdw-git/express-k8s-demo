'use strict';


require('../../app_config/environment').getEnvironmentVariables();

const testFunction = require('../utilities/testFunctions.js');
const config = require('../../app_config/config');
const request = require('request');
const serverOpts = require('./apiServerDefinitions');


//create the test object
let tests = [{}];

for (let i=0; i < config.tests.length; i++){

    tests[i] = {area: config.tests[i].area, directory: process.env.EXP_API_APP_DIR+config.tests[i].directory+config.tests[i].area};

}

const apiCall = '/config';
const testName = 'onlyOneConfigObject';

//set up the expected body object

const expectedBody = {};

//============================================================================================
// GET /api/config check number of config objects
//============================================================================================

module.exports.onlyOneConfigObject={

    testName: testName,
    root:serverOpts.apiOptions.root,
    method:serverOpts.GET+' '+serverOpts.apiOptions.path+apiCall,
    result: 'should return good status: '+serverOpts.GOOD_STATUS+' and an valid response body ',
    resultMsg: 'GET config returns with good status and there should only be one config object',
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

            request(testData.requestOptions.getConfig, (err, res, body)=>{

                if (err) {
                    testFunction.handleError(err)
                }else {
                    testData.setupData.assert = [
                        {
                            assertion: testData.tests.bodyAssertion,
                            actual: body.length,
                            expected: 1,
                            test: 'is there only one config object?'
                        }
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
        assertionMsg: testName+': Assertion failed for test on : ',
        statusAssertion : testFunction.generalAssertion,
        bodyAssertion: testFunction.generalAssertion

    }

};
