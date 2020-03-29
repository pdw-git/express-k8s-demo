'use strict';
/**
 * Created by Peter Whitehead on 28th March 2020
 */

const mongoose = require('mongoose');
const config = require('../../app_config/config');
const logger = require('../../app_utilities/logger');
const mongo = require('./mongoActions');
const messages = require('../../app_utilities/messages').messages;
const dotenv = require('dotenv');

dotenv.config();

//Create a schema for the config data

const configSchema = new mongoose.Schema(

    {
        inProduction: {type: Boolean, required: true},
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
            port: {type: Number, required: true},
            configObjectName: {type: String, required: true}
        },
        encryption: {
            enabled: {type: Boolean, required: true},
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


//Create a model for Mongoose from the defined schema
mongoose.model(config.mongo.configObjectName, configSchema);

//create the required test object for the configuration document

let tests = [{}];

for (let i=0; i < config.tests.length; i++){

    tests[i] = {area: config.tests[i].area, directory: process.env.APP_DIR+config.tests[i].directory+config.tests[i].area};

}

//Set up the configuration data that needs be stored in the database.

logger._info({filename: __filename, methodname: 'main', message: ' process.env.AAP_DIR: '+process.env.APP_DIR});

const baselineConfiguration = {
    inProduction: config.inProduction,
    logLevel: config.defaultLogLevel,
    homeDir: process.env.APP_DIR,
    ipAddress: config.ip,
    indexRoute: config.indexRoute,
    apiRoute: config.apiRoute,
    userRoute: config.userRoute,
    port: config.defaultPort,
    mongo : {
        name: 'mongodb',
        uri: config.mongo.uri,
        port: config.mongo.port,
        configObjectName: config.mongo.configObjectName
    },
    encryption: {
        enabled: config.encryption.enabled,
        certProvider: config.encryption.certProvider,
        store: config.encryption.store,
        key: config.encryption.key,
        cert: config.encryption.cert
    },
    tests: tests
};

//There should only be one configuration object for the application.
//Check if one exists, if it does do not update it.
//TODO: Change this logic so that if one is found the old one is deleted and a new one is created.

mongo.find({}, config.mongo.configObjectName, (err,doc)=>{
    if(err){
        logger._error({filename: __filename, methodname:'mongo.find', message: err.message});
    }
    else {

        doc.length > 0 ?
            logger._info({filename: __filename, methodname: 'mongo.find', message: messages.mongo.object_exists+config.mongo.configObjectName}) :
            mongo.create(config.mongo.configObjectName, baselineConfiguration);
    }

});



