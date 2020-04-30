/**
 * apiTests
 *
 * Created by Peter Whitehead March 2020
 *
 * Baseline application that serves an API and basic web pages
 *
 * Copyright Peter Whitehead @2020
 *
 * Licensed under Apache-2.0
 *
 */
'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//Get the test definitions and the test functions
const testData = require('./testData');
const testFunctions = require('../utilities/testFunctions');

!testData ? logger._error({filename: __filename, methodname: 'main', nessage: 'test data is missing'}): null;

//iterate through the array of test definitions: Assumes a JSON array object of test definitions
//TODO: put in type checking and error handling for case where json object is not formed correctly.

for(let index = 0; index < testData.testDefinitions.apiTests.length; index++){

    testFunctions.testFunction(testData.testDefinitions.apiTests[index]);

}