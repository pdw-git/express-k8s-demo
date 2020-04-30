/**
 * appConfiguration
 *
 * Created by Peter Whitehead March 2018
 *
 * Baseline application that serves an API and basic web pages
 *
 * Copyright Peter Whitehead @2020
 *
 * Licensed under Apache-2.0
 */

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
        mongoName: {type: String, required: true},
        mongoURI: {type: String, required: true},
        mongoConfigObjectName: {type: String, required: true},
        encryptionEnabled: {type: String, required: true},
        certProvider: {type: String, required: true},
        keyStore: {type: String, required: true},
        key: {type: String, required: true},
        cert: {type: String, required: true},
        tests: [{
            area: {type: String, required: true},
            directory: {type: String, required: true}
        }],
        testResults: [{
            start: {type: String},
            end:  {type: String},
            results: [{

            }]

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



