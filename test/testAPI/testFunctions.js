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
 *   root:"testRootArea",
 *   method:"GET  https://127.0.0.1:3000/api/info",
 *   result: "should return info object and 200",
 *   expectedResultMsg: "status 200 and body with application name and version",
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
 *   }
 *
 *}
 *
 */

/**
 * testStatus
 *
 * Validate a request gets the expected response status
 *
 * @param testData - JSON object
 */
module.exports.testStatus = function(testData){

    describe(testData.root, function(){

        describe(testData.method, function(){

            describe(testData.result, function(){

                it(testData.expectedResultMsg, function(done){

                    testStatus(testData, done);

                });

            });

        });

    });

};

/**
 * testData
 *
 * Validate a request gets the expected body
 *
 * @param testData JSON Object
 */
module.exports.testBody = function(testData){

    describe(testData.root, function(){

        describe(testData.method, function(){

            describe(testData.result, function(){

                it(testData.expectedResultMsg, function(done){

                    testBody(testData, done);

                });

            });

        });

    });

};



/**
 * testStatus
 *
 * @param testData
 * @param done
 */
function testStatus(testData, done){

    request(testData.requestOptions, function(req, res){

        //assert if the status code is not as expected
        try {
            assert.equal(
                testData.status,
                res.statusCode,
                testData.testName + ': Did not get expected status code'
            );

            done();
        }
        catch(err){

            done(err);

        }

    });

}

/**
 * testBody
 *
 * @param testData
 * @param done
 */
function testBody(testData, done){

    request(testData.requestOptions, function(req, res){

        //assert if response body is not as expected
        try {
            if (testData.body != null) {

                assert.deepEqual(
                    testData.body,
                    res.body,
                    testData.testName + ': Did not get expected body'
                );

            }

            done();
        }
        catch(err){

            done(err);

        }


    });

}
