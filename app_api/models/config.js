'use strict';

const config = require('../../app_config/config');


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

};

