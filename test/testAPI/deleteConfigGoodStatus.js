'use strict';

require('../../app_config/environment').getEnvironmentVariables();

const testFunction = require('../utilities/testFunctions.js');
const request = require('request');
const serverOpts = require('./apiServerDefinitions');
const appConfig = require('../../app_config/config');
const configDB = require('../../app_api/models/configDB/configDB_Actions');
const mongo = require('../../app_api/models/mongoActions');
const schema = require('../../app_api/models/schemas/appConfiguration');
const mongoose = require('mongoose');

const apiCall = '/config/';
const testName = 'deleteConfigGoodStatus';

//============================================================================================
// DELETE /api/config/:configid good status
//============================================================================================

//open a connection to the mongo db
//create a new config object in the data base
//get the id of this new object
//save the id and update the expected body with the id information
//delete the config
//valdiate the body and status match expectations


module.exports.deleteConfigGoodStatus={

    testName: testName,
    root:serverOpts.apiOptions.root,
    method:serverOpts.DELETE+' '+serverOpts.apiOptions.path+apiCall+':configid',
    result: 'should return good status: '+serverOpts.GOOD_STATUS+' and configuration should be deleted',
    resultMsg: "Config update has been updated and good status recieved",
    expectedBody: {msg: appConfig.mongo.configObjectName + ': deleted doc: ' },
    expectedStatus: serverOpts.GOOD_STATUS,
    setupData: {
        assert:{},
        data: {},
    },
    requestOptions : {
        deleteConfig:{url: serverOpts.apiOptions.server + serverOpts.apiOptions.path + apiCall,
            method: serverOpts.DELETE,
            json: {},
            qs: {}
        },
        getConfig : {url: serverOpts.apiOptions.server + serverOpts.apiOptions.path + '/config',
            method: serverOpts.GET,
            json: {},
            qs: {}
        }
    },
    tests:{
        before : (testData, done)=>{

            //we need to open a connection to the data base. Remember the tests run outside of the the main applicaiton
            mongoose.connect(process.env.MONGO_URI+process.env.MONGO_DB_NAME,
                {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false}
                ).catch((reason)=>{testFunction.handleError(new Error(reason), done)});

            //check that there is currently only one config document in the database
            request(testData.requestOptions.getConfig, (err, response, body)=> {

                if (Array.isArray(body) && (body.length === 1)) {

                    //create a new config document
                    let configModel = mongo.getMongoObject(appConfig.mongo.configObjectName, schema.getSchema());
                    let configObject = new configModel(configDB.getConfig());

                    //save the new document
                    // noinspection JSIgnoredPromiseFromCall supress warning on promise not being caught. Adding .catch caused functional issues.
                    configObject.save((err, doc)=>{

                        //save id of new doc, update the expected body data and update the url for the delete request options
                        testData.setupData.data._id = doc._id;
                        testData.expectedBody.msg = testData.expectedBody.msg+doc._id;
                        testData.requestOptions.deleteConfig.url = testData.requestOptions.deleteConfig.url+testData.setupData.data._id;


                        //do the actual test
                        err ? testFunction.handleError(err, done) :
                        testData.tests.testAction(testData, done);

                    });

                }
                else {
                    testFunction.handleError(new Error('body is not an array of invalid body.length: '+body.length), done);
                }

            });

        },
        testAction: (testData, done)=>{

            //request the config delete
            request(testData.requestOptions.deleteConfig, (err, response, body)=>{

                //set up the assertion data
                testData.setupData.assert = [
                    {assertion: testData.tests.statusAssertion, actual:response.statusCode, expected:testData.expectedStatus, test:'response status'},
                    {assertion: testData.tests.bodyAssertion, actual:body, expected: testData.expectedBody, test: 'response body'}
                ];

                //do the test if there is no error from the request
                err ? testFunction.handleError(err, done) : testFunction.doAssertions(testData);

                //do the test clean up actions
                testData.tests.after(null, testData, done);

            });

        },
        after : (error, testData, done)=>{

            mongoose.connection.close((err)=>{

                error ? done(err): done();

            });

        },
        assertionMsg: testName+': Assertion failed for test on response object: ',
        statusAssertion : testFunction.generalAssertion,
        bodyAssertion: testFunction.generalAssertion,
    }

};
