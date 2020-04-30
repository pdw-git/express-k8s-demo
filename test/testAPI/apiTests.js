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
const logger = require('../../app_utilities/logger');

//if there is valid test data iterate through the tests defined in testData
!testData ?
    logger._error({filename: __filename, methodname: 'main', nessage: 'test data is missing'})
    : testData.testDefinitions.apiTests.forEach((value)=>{testFunctions.testFunction(value);});