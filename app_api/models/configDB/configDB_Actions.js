'use strict';

const config = require('../../../app_config/config');
const mongo = require('../mongoActions');
const logger = require('../../../app_utilities/logger');
const messages = require('../../../app_utilities/messages').messages;
const schema = require('../schemas/appConfiguration');

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
 * @returns {{testRunning: boolean, ipAddress: string, mongoName: string, cert: string, inProduction: string, homeDir, mongoURI: string, encryptionEnabled: string, mongoConfigObjectName, tests: {}[], logLevel: string, port: string, certProvider: string, keyStore: string, indexRoute: string, deploymentMethod, userRoute: string, key: string, apiRoute: string}}
 */
function getConfig(){

    let tests = [{}];

    for (let i=0; i < config.tests.length; i++){

        tests[i] = {area: config.tests[i].area, directory: process.env.EXP_API_APP_DIR+config.tests[i].directory+config.tests[i].area};

    }

    return {
        testRunning: false,
        inProduction: process.env.EXP_API_NODE_ENV_PRODUCTION,
        deploymentMethod: process.env.EXP_API_ENV_DEPLOYMENT,
        logLevel: process.env.EXP_API_LOGGING_LEVEL,
        homeDir: process.env.EXP_API_APP_DIR,
        ipAddress: process.env.EXP_API_APP_IP,
        indexRoute: process.env.EXP_API_INDEX_ROUTE,
        apiRoute: process.env.EXP_API_API_ROUTE,
        userRoute: process.env.EXP_API_USER_ROUTE,
        port: process.env.EXP_API_PORT,
        mongoName: process.env.EXP_API_MONGO_DB_NAME,
        mongoURI: process.env.EXP_API_MONGO_URI,
        mongoConfigObjectName: config.mongo.configObjectName,
        encryptionEnabled: process.env.EXP_API_HTTPS,
        certProvider: process.env.EXP_API_CERT_PROVIDER,
        keyStore: process.env.EXP_API_KEY_STORE,
        key: process.env.EXP_API_APP_KEY,
        cert: process.env.EXP_API_APP_CERT,
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

    mongo.find({}, config.mongo.configObjectName, (err, doc)=>{

        if(err){

            logger._error({filename: __filename, methodname:'mongo.find', message: err.message});

        }
        else {

            switch(doc.length){

                //Nothing found: create the config data object
                case 0 :
                    logger._debug({filename: __filename, methodname: methodname, message: 'create new config object'});
                    mongo.create(config.mongo.configObjectName, getConfig(), schema.getSchema(), callback);
                    break;

                //There is a config object: log a message stating config exists
                case 1 :
                    logger._info({filename: __filename, methodname: methodname, message: 'configuration '+doc[0]._id+' already exists'});
                    setConfigID(doc[0]._id);
                    updateConfig();
                    break;

                //if the length is greater than 1 then there is a problem with the database, log an error.
                default:
                    logger._error({filename: __filename, methodname: methodname, message: messages.mongo.invalid_doc_length+doc.length});

            }

        }

    });

}

/**
 * updateConfig
 *
 */
function updateConfig(){

    let methodname = 'updateConfig';

    //call the update function from the mongo object, the callback will use the plugin function updateAfterRestart.
    //updateAfterRestart(doc, callback) doc is the doc object from mongoose. Callback is the action taken after
    //the doc object has been updated with the new data. In this case the doc will be saved.

    mongo.update(config.mongo.configObjectName, getConfigID(), updateAfterRestart, (err, doc)=>{

        err ?
            logger._error({filename: __filename, methodname:'mongo.find', message: 'Failure to save database document'}) :
            updateAfterRestart(doc, (doc)=>{

                if (err) {

                    logger._error({filename: __filename, methodname: methodname, messaage: messages.config.config_cannot_update_database});

                } else {

                    doc.save().then(()=>{}).catch((reason) => {logger._error({filename: __filename, methodname: methodname, messages: reason});});

                }

            });

    });

}

/**
 * updateAfterRestart
 *
 * @param doc
 * @param callback
 */
function updateAfterRestart(doc, callback){

    let methodname = 'updateAfterRestart';

    mongo.updateDoc(doc, getConfig());

    typeof (callback) === 'function' ?
        callback(doc) :
        logger._error({filename: __filename, methodname: methodname, messages: 'Callback is not a function'});


}

/**
 * setTestRunning
 *
 * @param value
 * @param callback
 */
function setTestRunning(value, callback){

    let methodname = 'settestRunning';

    let project = mongo.getMongoObject(config.mongo.configObjectName);

    project.findOneAndUpdate({_id: getConfigID()},{testRunning: value}, {new: false}, (err, doc)=>{

        if (err) {

            logger._error({filename: __filename, methodname, message: err.message});

        } else {

            (callback) ? callback(err, doc) : logger._error({filename: __filename, methodname, message: 'Callback not a function'});


        }

    });

}

/**
 * getTestRunning
 *
 * @param callback
 */
function getTestRunning(callback){

    mongo.find({}, config.mongo.configObjectName, callback);

}

/**
 * setConfigID
 *
 * @param id
 */
function setConfigID(id){configID=id;}

/**
 * getConfigID
 *
 * @returns {*}
 */
function getConfigID(){return configID;}


