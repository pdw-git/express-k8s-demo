'use strict';

const config = require('../../app_config/config');
const mongo = require('./mongoActions');
const logger = require('../../app_utilities/logger');
const messages = require('../../app_utilities/messages').messages;

module.exports.setTestRunning = setTestRunning;
module.exports.getTestRunning = getTestRunning;
module.exports.createConfig = createConfig;
module.exports.getID = getConfigID;
module.exports.setID = setConfigID;
module.exports.getConfig = getConfig;

let configID = null;


/**
 * getConfig
 *
 * @returns {{mongo: {name: string, uri: string, configObjectName}, tests: {}[], logLevel: string, encryption: {certProvider: string, cert: string, store: string, enabled: string, key: string}, port: string, ipAddress: string, indexRoute: string, deploymentMethod, userRoute: string, inProduction: string, homeDir, apiRoute: string}}
 */
function getConfig(){

    let tests = [{}];

    for (let i=0; i < config.tests.length; i++){

        tests[i] = {area: config.tests[i].area, directory: process.env.APP_DIR+config.tests[i].directory+config.tests[i].area};

    }

    return {
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
            configObjectName: config.mongo.configObjectName,
            testRunning: false
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

}

/**
 * createConfig
 * @param dataObject
 * @param callback (err, doc)=>{}
 */
function createConfig(dataObject, callback){

    let methodname = 'createConfig';

    logger._debug({filename: __filename, methodname: methodname, message: messages.started+': dataObject: '+JSON.stringify(dataObject)});

    mongo.find({}, config.mongo.configObjectName, (err,doc)=>{

        if(err){
            logger._error({filename: __filename, methodname:'mongo.find', message: err.message});
        }
        else {

            switch(doc.length){

                //Nothing found: create the config data object
                case 0 :
                    logger._debug({filename: __filename, methodname: methodname, message: 'create new config object'});
                    mongo.create(config.mongo.configObjectName, getConfig(), callback);
                    break;

                //There is a config object: log a message stating config exists
                case 1 :
                    logger._info({filename: __filename, methodname: methodname, message: 'configuration '+doc[0]._id+' already exists'});
                    break;

                //if the length is greater than 1 then there is a problem with the database, log an error.
                default:
                    logger._error({filename: __filename, methodname:'mongo.find', message: messages.mongo.invalid_doc_length+doc.length});

            }

        }

    });

}

function setTestRunning(value, callback){

    let methodname = 'settestRunning';

    mongo.find({}, config.mongo.configObjectName, (err, doc) => {

        if (err) {

            logger._error({filename: __filename, methodname, message: err.message});

        } else {

            doc[0].mongo.testRunning = value;

            doc[0].save().then(callback(err, doc)).catch((reason) => {

                logger._error({filename: __filename, methodname, message: reason});

            });

        }

    });

}

function getTestRunning(callback){

    mongo.find({}, config.mongo.configObjectName, callback);

}

function setConfigID(id){configID=id;}

function getConfigID(){return configID;}


