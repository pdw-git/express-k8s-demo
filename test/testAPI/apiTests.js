'use strict';

const testData = require('./testData');
const testFunctions = require('./testFunctions');

testFunctions.testStatusAndBody(testData.getInfoExpectedGoodResults);
testFunctions.testStatusAndBody(testData.getStatusExpectedGoodResults);
testFunctions.testStatusAndBody(testData.getInvalidAPI_MethodExpectedPageNotFound);
testFunctions.testStatusAndBody(testData.getVersion_ExpectedGoodStatus);