'use strict';
/**
 * Test functions used to exercise the APIs in this solution
 *
 */

const assert = require('assert');
const request = require('request');

const skipMongoObjects = ['_id'];


module.exports.handleError = error;


module.exports.testStatusAndBody = function(testData, options,  done){

    //Retrieve the applications config inforamtion via the API}

    request(options, (err, response, body)=> {

        if (err) {

            testFunction.handleError(err);
        } else {

            testData.setupData.assert = [
                {assertion: testData.tests.statusAssertion, actual: response.statusCode, expected: testData.expectedStatus, test: 'response status'},
                {assertion: testData.tests.bodyAssertion, actual: body, expected: testData.expectedBody, test: 'response body'}
            ];

            //Execute the required test
            testData.tests.testAction(testData, done);

        }

    });

};

module.exports.doAssertions = function(testData){

    testData.setupData.assert ?
        testData.setupData.assert.forEach((item)=>{
            try {
                item.assertion(item.actual, item.expected, testData.testName+testData.tests.assertionMsg + item.test);
            }
            catch(err){
                throw(err);
            }
        })
        : error({msg: 'setupData.assert is not defined'});

};


module.exports.testFunction = function(testData){

    describe(testData.root, function(){

        describe(testData.method, function(){

            describe(testData.result, function(){

                it(testData.resultMsg, function(done){

                    testData.tests.before(testData, done);

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
 * assertMongoObject
 * @param actual
 * @param expected
 * @param msg
 */
module.exports.assertMongoObject = function (actual, expected, msg){

    iterateObj(actual, expected, skipMongoObjects, msg, simpleAssert);

};

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

            if (typeof (obj1[key1]) !== 'object') {

                if(!checkIfObjectShouldBeSkipped(skipOjbs, key1)){

                    let expected = obj1[key1];
                    let actual = obj2[key1];

                    test(expected, actual, msg+': '+key1);
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

    assert.deepEqual(actual, expected, msg);
}

/**
 * handle Error
 * @param err
 * @param callback (err)=>{}
 */
function error(err, callback){

    console.log('Error has been detected: ');
    console.log('full error: '+err);

    callback ? callback(err) : {};
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


