'use strict';

//The following is required to suppress errors in testing due to the use of self signed certificates.

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const testData = require('./testData');
const testFunctions = require('./testFunctions');

testFunctions.testWithAssertion(testData.getInfoGoodStatus);
testFunctions.testWithAssertion(testData.getInfoTestBody);
testFunctions.testWithAssertion(testData.getStatusGoodstatus);
testFunctions.testWithAssertion(testData.getStatusTestBody);
testFunctions.testWithAssertion(testData.getApiPageNotFound);
testFunctions.testWithAssertion(testData.getVersionGoodStatus);
testFunctions.testWithAssertion(testData.getVersionTestBody);

//testFunctions.testStatusWithBeforeAndAfter(testData.getTest_TestsDoNotExist);