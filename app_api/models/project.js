'use strict';
/**
 * Created by Peter Whitehead on 28th March 2020
 */

const mongoose = require('mongoose');
const config = require('../../app_config/config');
const logger = require('../../app_utilities/logger');
const mongo = require('./mongoActions');

//Create a schema for the config data

const configSchema = new mongoose.Schema(

    {
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


mongo.createModel(configSchema);

//create the required test object for the configuration document

let tests = [{}];

for (let i=0; i < config.tests.length; i++){

    tests[i] = {area: config.tests[i].area, directory: process.env.APP_DIR+config.tests[i].directory+config.tests[i].area};

}

//Set up the configuration data that needs be stored in the database.

logger._info({filename: __filename, methodname: 'main', message: ' process.env.AAP_DIR: '+process.env.APP_DIR});

const baselineConfiguration = {
    inProduction: process.env.NODE_ENV_PRODUCTION,
    deploymentMethod: process.env.NODE_ENV_DEPLOYMENT,
    logLevel: process.env.LOGGING_LEVEL,
    homeDir: process.env.APP_DIR,
    ipAddress: process.env.APP_IP,
    indexRoute: process.env.INDEX_ROUTE,
    apiRoute: process.env.API_ROUTE,
    userRoute: process.env.USER_ROUTE,
    port: process.env.PORT,
    mongo : {
        name: process.env.MONGO_DB_NAME,
        uri: process.env.MONGO_URI,
        configObjectName: config.mongo.configObjectName
    },
    encryption: {
        enabled: process.env.HTTPS,
        certProvider: process.env.CERT_PROVIDER,
        store: process.env.KEY_STORE,
        key: process.env.APP_KEY,
        cert: process.env.APP_CERT
    },
    tests: tests
};

mongo.createConfig(baselineConfiguration);



