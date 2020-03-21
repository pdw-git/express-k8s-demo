'use strict';

const assert = require('assert');
const request = require('request');

module.exports.testStatusAndBody = function(testData){

    describe(testData.root, function(){

        describe(testData.method, function(){

            describe(testData.result, function(){

                it(testData.expectedResultMsg, function(done){

                    testStatusAndBody(testData);

                    done();

                });

            });

        });

    });

};

/**
 * Function testStatusAndBody
 *
 * Function to be called to test the expected results of a http request
 *
 * Will validate the results of a request against the status and body
 * information in the testData JSON object. If testData.body === null
 * only response status will be validated
 *
 * @param testData =
 * {
 *    root: api root
 *    method: name of api method
 *    result: expected result
 *    expectedResultMessage: description of expected result
 *    body: {
 *       expected body object
 *    },
 *    status: expected Status, t
 *    testName: name of test
 *    requestOptions: {
 *       url: apiOptions.server + apiPath + "/info",
 *       method: "GET",
 *       json: {},
 *       qs: {}
 *    }
 * }
 *
 *
 */

function testStatusAndBody(testData){

    request(testData.requestOptions, function(err, res, body){

        //assert if there was an error with the request
        assert.ifError(err);

        //assert if the status code is not as expected
        assert.equal(
            testData.status,
            res.statusCode,
            testData.testName+': Did not get expected status code'
        );

        //assert if response body is not as expected
        if (testData.body != null) {

            assert.deepEqual(
                testData.body,
                body,
                testData.testName + ': Did not get expected body'
            );

        }

    });

}