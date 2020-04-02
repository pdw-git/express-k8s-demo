'use strict';
/**
 * Created by Peter Whitehead on 28th March 2020
 */

const mongoose = require('mongoose');
const config = require('../../app_config/config');
const logger = require('../../app_utilities/logger');
const mongo = require('./mongoActions');
const messages = require('../../app_utilities/messages').messages;

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
            port: {type: Number, required: true},
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
        port: process.env.MONGO_PORT,
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

//There should only be one configuration object for the application.
//Check if one exists, if it does do not update it.

mongo.find({}, config.mongo.configObjectName, (err,doc)=>{
    if(err){
        logger._error({filename: __filename, methodname:'mongo.find', message: err.message});
    }
    else {

        switch(doc.length){

            //Nothing found: create the config data object
            case 0 :
                logger._debug({filename: __filename, methodname: 'mongo.find.create', message: 'create new config object'});
                mongo.create(config.mongo.configObjectName, baselineConfiguration);
                logger._info({filename: __filename, methodname: 'mongo.find.create', message: messages.mongo.object_exists+config.mongo.configObjectName});
                break;

            //There is a config object: delete it and create a new one
            case 1 :
                logger._debug({filename: __filename, methodname: 'mongo.find.create', message: 'delete '+doc[0]._id+' create new config object'});
                mongo.delete(config.mongo.configObjectName, doc[0]._id, (err)=>{
                    err ?
                        logger._error({filename: __filename, methodname:'mongo.find.delete.create', message: err.message}) :
                        mongo.create(config.mongo.configObjectName,baselineConfiguration);
                });
                break;

            //if the length is greater than 1 then there is a problem with the database, log an error.
            default:
                logger._error({filename: __filename, methodname:'mongo.find', message: message.mongo.invalid_doc_length+doc.length});

        }

    }

});



