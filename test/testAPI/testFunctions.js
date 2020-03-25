'use strict';
/**
 * Test functions used to exercise the APIs in this solution
 *
 */

const assert = require('assert');
const request = require('request');

/**
 * Expected format of the test data JSON object with examples
 *
 *{
 *   testName: "nameOfTest",
 *   root:"testRootArea e.g api",
 *   method:"GET  https://127.0.0.1:3000/api/info",
 *   result: "should return info object and 200",
 *   expectedResultMsg: "status 200 and body with application name and version",
 *   requestObjectName: "key name in response JSON object to be used as actual value in assert call"
 *   body: {
 *       status: 200
 *       message: "this has worked"
 *   },
 *   status: 200,
 *   requestOptions: {
 *       url: 'https://127.0.0.1:3000/api/info",
 *       method: "GET",
 *       json: {},
 *       qs: {}
 *   },
 *   environment :{
 *       before: ()=>{},
 *       after: ()=>{},
 *       assertionMsg: 'message to post when assertion fires'
 *       assertion: (expected, actual, message)+>{}
 *   }
 *
 *}
 *
 */

/**
 * testWithAssertion
 *
 * completes a test utilising a single assertion
 *
 * @param testData object
 * @param testObjectName string
 */
module.exports.testWithAssertion = function(testData){

    describe(testData.root, function(){

        describe(testData.method, function(){

            describe(testData.result, function(){

                it(testData.expectedResultMsg, function(done){

                    testWithAssertion(testData, testData.requestTestObjectName, done);

                });

            });

        });

    });

};


/**
 * generalAssertion
 *
 * An assertion test
 *
 * @param actual
 * @param expected
 * @param msg
 */
module.exports.generalAssertion = function(actual, expected, msg){

    assert.deepEqual(actual, expected, msg);

};


/**
 * testWithAssertion
 *
 * @param testData
 * @param testObjectName
 * @param done
 */

function testWithAssertion(testData, testObjectName, done){


    request(testData.requestOptions, function(req, res){

        ((testData.environment.before !== undefined) || true) ? testData.environment.before(): null;

        //assert if the status code is not as expected
        try {

            testData.environment.assertion(res[testObjectName], testData[testObjectName], testData.environment.assertionMsg+testObjectName);

            ((testData.environment.after !== undefined) || true ) ? testData.environment.after() : null;

            done();
        }
        catch(err){

            ((testData.environment.after !== undefined) || true) ? testData.environment.after() : null;

            done(err);

        }

    });

}
