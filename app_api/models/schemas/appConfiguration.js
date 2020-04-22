'use strict';

const mongoose = require('mongoose');

module.exports.getSchema = getSchema;

const configSchema = new mongoose.Schema(

    {
        testRunning:{type: Boolean},
        inProduction: {type: String, required: true},
        deploymentMethod: {type: String},
        logLevel: {type: String},
        homeDir: {type: String, required: true},
        ipAddress: {type: String, required: true},
        indexRoute: {type: String, required: true},
        apiRoute: {type: String, required: true},
        userRoute: {type: String, required: true},
        port: {type: Number, required: true},
        mongo : {
            name: {type: String, required: true},
            uri: {type: String, required: true},
            configObjectName: {type: String, required: true}
        },
        encryption: {
            enabled: {type: String, required: true},
            certProvider: {type: String, required: true},
            store: {type: String, required: true},
            key: {type: String, required: true},
            cert: {type: String, required: true}
        },
        tests: [{
            area: {type: String, required: true},
            directory: {type: String, required: true}
        }],
        testResults: [{
            start: {type: String},
            end:  {type: String},
            results: {
                suites: {type: Number},
                tests: {type: Number},
                passes: {type: Number},
                pending: {type: Number},
                failures: {type: Number},
                errors: [{type: String}]

            }
        }]

    }

);

/**
 * getSchema
 * @returns {Schema}
 */
function getSchema(){

    return configSchema;

}



