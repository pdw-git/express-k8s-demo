'use strict';
/**
 * Created by whitep on 26th March 2020
 */

const mongoose = require('mongoose');
const config = require('../../app_config/config');
const logger = require('../../app_utilities/logger');
const mongo = require('./mongoActions');
const messages = require('../../app_utilities/messages').messages;
const dotenv = require('dotenv');

dotenv.config();

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

mongoose.model('configuration', configSchema);

//initialise the project

let tests = [{}];

for (let i=0; i < config.tests.length; i++){

    tests[i] = {area: config.tests[i].area, directory: process.env.APP_DIR+config.tests[i].directory+config.tests[i].area};

}

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

//let configProject = mongoose.model('configuration');

//let cp = new configProject(baselineConfiguration);

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

//mongo.create(config.mongo.configObjectName, baselineConfiguration);

//cp.save((err, data)=>{
//    if(err){
//
//        logger._error({filename: __filename, methodname:'main', message: err.message});
//        logger._debug({filename: __filename, methodname:'main', message: JSON.parse(data)});
//
//    }
//    else {
//
//        logger._info({filename:__filename, methodname:'main', message: 'Successful config initialisation'});
//
//    }
//
//});


