'use strict';
/**
 * Test functions used to exercise the APIs in this solution
 *
 */

const assert = require('assert');
const request = require('request');

const skipMongoObjects = ['_id'];

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
 * assertList
 * @param actual
 * @param expected
 * @param msg
 */
module.exports.assertionList = function(actual, expected, msg){

   for(let i = 0; i < expected.length; i++){

       assert.deepEqual(actual[0][expected[i].key], expected[i].expected, msg+' - '+expected[i].key);

   }

};

/**
 * assertMongoObject
 * @param actual
 * @param expected
 * @param msg
 */
module.exports.assertMongoObject = function (actual, expected, msg){

    iterateObj(actual, expected, skipMongoObjects, msg, simpleAssert);

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

        ((testData.environment.before !== undefined) || true) ? testData.environment.before(testData): null;

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

/**
 * iterateObject
 *
 * iterated over an object and
 * @param obj1
 * @param obj2
 * @param skipOjbs
 * @param msg
 * @param test
 */
function iterateObj(obj1, obj2, skipOjbs, msg, test){

    let keys1 = Object.keys(obj1);

    if (keys1.length>0) {

        for (let keyIndex = 0; keyIndex < keys1.length; keyIndex++) {

            let key1 = keys1[keyIndex];

            if (typeof (obj1[key1]) !== "object") {

                if(!checkIfObjectShouldBeSkipped(skipOjbs, key1)){

                    let expected = obj1[key1];
                    let actual = obj2[key1];

                    test(expected, actual, msg);
                }

            } else {

                iterateObj(obj1[key1], obj2[key1], skipOjbs, msg, simpleAssert);

            }

        }

    }

}


/**
 * simpleAssert
 * @param actual
 * @param expected
 * @param msg
 */
function simpleAssert(actual, expected, msg){

    assert.deepEqual(actual,expected, msg);
}

/**
 * checkIfObjectsShouldBeSkipped
 * @param objectNames
 * @param name
 * @returns {boolean}
 */
function checkIfObjectShouldBeSkipped(objectNames, name){

    let returnVal = false;

    for(let index = 0; index < objectNames.length; index++){

        returnVal = (name === objectNames[index]);

    }

    return returnVal;

}
