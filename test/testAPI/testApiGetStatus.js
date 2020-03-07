'use strict';

const testData = require('../testData');
const assert = require('assert');
const request = require('request');
const logger = require('../testLog.js');
const apiOptions = {server: "http://localhost:3000"};
const apiPath = "/api";

const path = require('path');
const scriptName = path.basename(__filename);

const requestOptions = {
    url: apiOptions.server + apiPath + "/status",
    method: "GET",
    json: {},
    qs: {}
};

const GOOD_STATUS = testData.GOOD_STATUS;

const getStatusGoodExpectedResults = {

    body: {
        status: GOOD_STATUS,
        msg: 'Sending good status'
    },
    status: GOOD_STATUS

};

/**
 * Mocha Unit test
 * api.getStatus
 * Checks the responses from GET /api/status
 */
describe('api', function(){
    describe('getStatus', function(){
        describe('good status', function(){
            it('should be status: 200 and body'+ getStatusGoodExpectedResults.body.msg
                , function(done){

                request(requestOptions, function(err, res, body){

                    //assert if there was an error with the request

                    assert.ifError(err);

                    //assert if the status code is not as expected
                    assert.equal(
                        getStatusGoodExpectedResults.status,
                            res.statusCode,
                            'Did not get expected status code'
                    );

                    logger.log(scriptName, "res.statusCode OK");

                    //assert if the status in the response body is not as expected
                    assert.equal(
                        getStatusGoodExpectedResults.body.status,
                        body.status,
                        'Did not get expected status code in body'
                    );

                    logger.log(scriptName, 'body.status OK');

                    //assert if the msg in the body is not as expected
                    assert.equal(
                        getStatusGoodExpectedResults.body.msg,
                        body.msg,
                        'Did not get expected msg in body'
                    );

                    logger.log(scriptName, "body.msg OK");

                    done();

                });

            });

        });

    });

});

