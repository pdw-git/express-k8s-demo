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
// POST /api/config/:configid good status
//============================================================================================

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


            mongoose.connect(process.env.MONGO_URI+process.env.MONGO_DB_NAME,
                {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false}
                ).catch((reason)=>{testFunction.handleError(new Error(reason), done)});

            request(testData.requestOptions.getConfig, (err, response, body)=> {

                if (Array.isArray(body) && (body.length === 1)) {

                    let configModel = mongo.getMongoObject(appConfig.mongo.configObjectName, schema.getSchema());
                    let configObject = new configModel(configDB.getConfig());

                    configObject.save((err, doc)=>{

                        testData.setupData.data._id = doc._id;

                        err ? testFunction.handleError(err, done) :
                        testData.tests.testAction(testData, done);

                    }).catch((reason)=>{testFunction.handleError(new Error(reason), done)});

                }
                else {
                    testFunction.handleError(new Error('body is not an array of invalid body.length: '+body.length), done);
                }

            });

        },
        testAction: (testData, done)=>{

            testData.requestOptions.deleteConfig.url = testData.requestOptions.deleteConfig.url+testData.setupData.data._id;

            request(testData.requestOptions.deleteConfig, (err)=>{

                err ? testFunction.handleError(err, done) : testData.tests.after(null, testData, done);

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
