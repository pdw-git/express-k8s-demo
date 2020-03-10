'use strict';

const testData = require('./testData');
const testFunctions = require('./testFunctions');

testFunctions.testStatusAndBody(testData.getInfoExpectedGoodResults);
testFunctions.testStatusAndBody(testData.getStatusExpectedGoodResults);
testFunctions.testStatusAndBody(testData.getInvalidAPI_MethodExpectedPageNotFound);

describe('end test', function(){

    it('should print a final message', function(done){

        console.log('got to the end');

        done();

    });

});