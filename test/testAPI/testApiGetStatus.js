'use strict';

const testData = require('../testData');
const testFunctions = require('../testFunctions');
//const apiGetStatusTestData = testData.getStatusExpectedGoodResults;

testFunctions.testStatusAndBody(testData.getStatusExpectedGoodResults);
