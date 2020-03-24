'use strict';

//The following is required to suppress errors in testing due to the use of self signed certificates.

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const testData = require('./testData');
const testFunctions = require('./testFunctions');

testFunctions.testStatusAndBody(testData.getInfoExpectedGoodResults);
testFunctions.testStatusAndBody(testData.getStatusExpectedGoodResults);
testFunctions.testStatusAndBody(testData.getInvalidAPI_MethodExpectedPageNotFound);
testFunctions.testStatusAndBody(testData.getVersion_ExpectedGoodStatus);
//testFunctions.testStatusAndBody(testData.getTest_ExpectedGoodStatus);