'use strict';

//The following is required to suppress errors in testing due to the use of self signed certificates.

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const testData = require('./testData');
const testFunctions = require('./testFunctions');

testFunctions.testStatus(testData.getInfoExpectedGoodResults);
testFunctions.testStatus(testData.getStatusExpectedGoodResults);
testFunctions.testStatus(testData.getInvalidAPI_MethodExpectedPageNotFound);
testFunctions.testStatus(testData.getVersion_ExpectedGoodStatus);
testFunctions.testBody(testData.getInfoExpectedGoodResults);
testFunctions.testBody(testData.getStatusExpectedGoodResults);
testFunctions.testBody(testData.getVersion_ExpectedGoodStatus);