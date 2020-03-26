'use strict';

//The following is required to suppress errors in testing due to the use of self signed certificates.

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//Get the test definitions and the test functions
const testData = require('./testData');
const testFunctions = require('./testFunctions');

//iterate through the array of test definitions: Assumes a JSON array object of test definitions
//TODO: put in type checking and error handling for case where json object is not formed correctly.

for(let index = 0; index < testData.testDefinitions.assertionTests.length; index++){

    testFunctions.testWithAssertion(testData.testDefinitions.assertionTests[index]);

}

//testFunctions.testStatusWithBeforeAndAfter(testData.getTest_TestsDoNotExist);