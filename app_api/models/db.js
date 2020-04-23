/**
 * Created by whitep on 26/03/2020
 */

const mongoose = require( 'mongoose' );
const logger = require('../../app_utilities/logger');
const messages = require('../../app_utilities/messages').messages;
const configSchema = require('./schemas/appConfiguration');
const configDB = require('./configDB/configDB_Actions');
const mongo = require('./mongoActions');
const config = require('../../app_config/config');

const dbURI_Config = process.env.MONGO_URI+process.env.MONGO_DB_NAME;

let retryCount = 0;
let maxRetries = 100;
let connected = false;

module.exports.dbConnected = isDB_connected;
module.exports.getURI = getURI;

//if there is no db connection then try to connect to defined database

!connected ? connectToMongo(dbURI_Config): logger._info({filename: __filename, methodname: 'main', message: messages.db.connected_to+dbURI_Config});

//----------------------------------------------------------------------------------------------------------------------
//Handle mongoose events on DB connection and DB disconnection
//----------------------------------------------------------------------------------------------------------------------

mongoose.connection.on('disconnected', function (){

    let methodname = 'mongoose.connection.on.disconnected';

    logger._error({filename: __filename, methodname: methodname, message: messages.db.disconnected_from+dbURI_Config });

    connected = false;

});

mongoose.connection.on('reconnected', function (){

    let methodname = 'mongoose.connection.on.reconnected';

    logger._info({filename: __filename, methodname: methodname, message: messages.db.reconnecting_to+dbURI_Config });

    connected = true;

});

mongoose.connection.on('connecting', function (){

    let methodname = 'mongoose.connection.on.connecting';

    logger._info({filename: __filename, methodname: methodname, message: messages.db.connecting_to+dbURI_Config });


});

mongoose.connection.on('connected', function(){

    let methodname = 'mongoose.connection.on.connected';

    logger._info({filename: __filename, methodname: methodname, message: messages.db.create_config });

    try {
        mongo.createModel(configSchema.getSchema());

        //create the config and when that has happened get the config._id and save it in the appConfig object.

        configDB.createConfig(configDB.getConfig(), ()=>{

            mongo.find({}, config.mongo.configObjectName, (err, doc)=>{

                err ? logger._error({filename: __filename, methodname: methodname, messages: err.messages}) :
                    configDB.setID(doc[0]._id);

            });
        });

    }
    catch(err){

        logger._error({filename: __filename, methodname: methodname, message: messages.db.create_config_error+err.message });

    }

});

//----------------------------------------------------------------------------------------------------------------------
//DB connection functions
//----------------------------------------------------------------------------------------------------------------------

/**
 * connectToMongo
 *
 * @param uri
 */
function connectToMongo(uri){

    let methodname = 'connectToMongo';

    logger._info({filename: __filename, methodname: methodname, message: messages.db.connecting_to + uri});

    if ((retryCount < maxRetries) && (!connected))
    {

        try {
            mongoose.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false}).
            then(() => {

                logger._info({filename: __filename, methodname: methodname, message: messages.db.connected_to + uri});
                connected = true;
                retryCount = 0;

            }).
            catch((error) => {

                //clean up the previous connection attempt.
                mongoose.connection.close(()=>{});

                retryCount++;

                if( retryCount < maxRetries){

                    logger._info({filename: __filename, methodname: methodname, message: error.message+': Connected: '+connected+': retry count : ' + retryCount});
                    connectToMongo(dbURI_Config);

                }
                else {

                    handleConnectionError(error);

                }

            });

        } catch (err) {

            handleConnectionError(err);

        }

    }
    else {

        handleConnectionError(new Error(messages.db.connection_error_retry+retryCount));

    }

}

/**
 * isDB_connected
 *
 * @returns {boolean}
 */
function isDB_connected(){
    return connected;
}

/**
 * getURI
 * @returns {string}
 */
function getURI(){
    return dbURI_Config;
}

/**
 * handleConnectionError
 *
 * @param err
 */
function handleConnectionError(err){

    let methodname = 'handleConnectionError';
    let message = messages.mongo.connection_error_retry + dbURI_Config + ": error: " + err.message;
    logger._error({filename: __filename, methodname: methodname, message: message});

}

//----------------------------------------------------------------------------------------------------------------------
//Functions to enable a good shutdown of mongoose and the app server
//----------------------------------------------------------------------------------------------------------------------

let gracefulShutdown = function(msg, exit){
    mongoose.connection.close(function(){

        logger._info({filename: __filename, methodname: 'gracefulShutdown', message: messages.db.closed_connection+dbURI_Config });

        exit(msg);

    });


};

/**
 * stop
 * @param msg
 */
let stop = function(msg){
    logger._info({filename: __filename, methodname: 'process.once', message: 'exit by : '+msg});
    process.exit(0);
    process.exit(0);
};

process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', stop);
});

process.on('SIGINT', function () {
    gracefulShutdown('app termination - SIGINT', stop);
});
