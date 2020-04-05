'use strict';


require('../../app_config/environment').getEnvironmentVariables();

const testFunction = require('../utilities/testFunctions.js');
const request = require('request');
const serverOpts = require('./apiServerDefinitions');
const messages = require('../../app_utilities/messages').messages;

const apiCall = '/config/';

//============================================================================================
// POST /api/config/:configid good status
//============================================================================================

module.exports.postConfigConfigidValidUpdateSuccess={

    testName: 'postConfigConfigValidUpdateSuccess',
    root:serverOpts.apiOptions.root,
    method:serverOpts.POST+' '+serverOpts.apiOptions.path+apiCall+':configid',
    result: 'should return good status: '+serverOpts.GOOD_STATUS+' and configuration should be updated',
    resultMsg: "Config update has been updated and good status recieved",
    expectedBody: {msg: messages.config.config_updated},
    expectedStatus: serverOpts.GOOD_STATUS,
    setupData: {
        assert:{},
        data: {},
    },
    requestOptions : {
        getConfig:{url: serverOpts.apiOptions.server + serverOpts.apiOptions.path + apiCall,
            method: serverOpts.GET,
            json: {},
            qs: {}
        },
        postConfig : {url: serverOpts.apiOptions.server + serverOpts.apiOptions.path + apiCall,
            method: serverOpts.POST,
            json: {logLevel: "testValue" },
            qs: {}
        }
    },
    tests:{
        before : (testData, done)=>{

            //Retrieve the applications config inforamtion via the API
            request(testData.requestOptions.getConfig, (err, response, body)=>{

                if(err){

                    testFunction.handleError(err);

                }
                else{

                    //Save the logLevel and the _id from the config document
                    testData.setupData.data = {
                        logLevel: body[0].logLevel,
                        _id: body[0]._id
                    };

                    //set the URL so that it contains the :configid paramater for the API call
                    testData.requestOptions.postConfig.url = testData.requestOptions.postConfig.url+body[0]._id;

                    //Execute the required test
                    testData.tests.testAction(testData, done);

                }

            });

        },
        testAction: (testData, done)=>{

            request(testData.requestOptions.postConfig, (err, response, body)=>{ //no response or body to supress warnings

                if(err){
                    console.log(err);
                }
                else{

                    //Save the response status and json from the POST /api/config/:config
                    testData.setupData.assert = [
                        {assertion: testData.tests.statusAssertion, actual:response.statusCode, expected:testData.expectedStatus, test:'response status'},
                        {assertion: testData.tests.bodyAssertion, actual:body, expected: testData.expectedBody, test: 'response body'}
                    ];

                    request(testData.requestOptions.getConfig, (err, response, body)=>{

                        if(err) {

                            testFunction.handleError(err);

                        }
                        else{

                            //Get the updated value and save it in the assert test array for validation.
                            testData.setupData.assert.push({
                                assertion: testFunction.generalAssertion,
                                actual:body[0].logLevel,
                                expected: testData.requestOptions.postConfig.json.logLevel, test: 'database updated'
                            });

                            try{
                                testFunction.doAssertions(testData);
                                testData.tests.after(err, testData, done);
                            }
                            catch(err){
                                testData.tests.after(err, testData, done);
                            }



                        }

                    });

                }

            });

        },
        after : (error, testData, done)=>{

            testData.requestOptions.postConfig.json = {logLevel: testData.setupData.data.logLevel};

            request(testData.requestOptions.postConfig, (err)=>{

                (err) ? testFunction.handleError(err):{};

                error ? done(error): done();

            });

        },
        assertionMsg: this.testName+': Assertion failed for test on response object: ',
        statusAssertion : testFunction.generalAssertion,
        bodyAssertion: testFunction.generalAssertion,
    }

};
