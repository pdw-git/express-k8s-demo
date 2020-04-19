'use strict';

const config = require('../../app_config/config');
const mongo = require('./mongoActions');
const logger = require('../../app_utilities/logger');

module.exports.setTestRunning = setTestRunning;
module.exports.getTestRunning = getTestRunning;


/**
 * getConfig
 *
 * @returns {{mongo: {name: string, uri: string, configObjectName}, tests: {}[], logLevel: string, encryption: {certProvider: string, cert: string, store: string, enabled: string, key: string}, port: string, ipAddress: string, indexRoute: string, deploymentMethod, userRoute: string, inProduction: string, homeDir, apiRoute: string}}
 */
module.exports.getConfig = function (){

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

};

function setTestRunning(value, callback){

    let methodname = 'settestRunning';

    try {
        mongo.find({}, config.mongo.configObjectName, (err, doc) => {

            let error = null;

            if (err) {

                throw new Error(messages.mongo.cannot_find_object);

            } else if ((doc[0].mongo.testRunning) && (value)) {

                error = new Error('Testing initiated by another request');

                logger._error({filename: __filename, methodname: methodname, message: error.message});

            } else {
                doc[0].mongo.testRunning = value;

                doc[0].save().then(callback(err)).catch((reason) => {
                    throw new Error(reason)
                });
            }

        });
    }
    catch(err){
        throw(err);
    }

}

function getTestRunning(callback){

    mongo.find({}, config.mongo.configObjectName, callback);

}
