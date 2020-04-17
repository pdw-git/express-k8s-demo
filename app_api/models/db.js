/**
 * Created by whitep on 26/03/2020
 */

const mongoose = require( 'mongoose' );
const logger = require('../../app_utilities/logger');
const messages = require('../../app_utilities/messages').messages;
const configSchema = require('./schemas/appConfiguration');
const appConfig = require('./config');
const mongo = require('./mongoActions');

const dbURI_Config = process.env.MONGO_URI+process.env.MONGO_DB_NAME;

let retryCount = 0;
let maxRetries = 100;
let connected = false;

module.exports.dbConnected = isDB_connected;

//if there is no db connection then try to connect to defined database

!connected ? connectToMongo(dbURI_Config): logger._info({filename: __filename, methodname: 'main', message: 'Connected to a database'});

//----------------------------------------------------------------------------------------------------------------------
//Handle mongoose events on DB connection and DB disconnection
//----------------------------------------------------------------------------------------------------------------------

mongoose.connection.on('disconnected', function (){

    let methodname = 'mongoose.connection.on.disconnected';

    logger._error({filename: __filename, methodname: methodname, message: 'disconnected from: '+dbURI_Config });

    connected = false;

});

mongoose.connection.on('reconnected', function (){

    let methodname = 'mongoose.connection.on.reconnected';

    logger._error({filename: __filename, methodname: methodname, message: 'reconnected to: '+dbURI_Config });

    connected = true;

});

mongoose.connection.on('connecting', function (){

    let methodname = 'mongoose.connection.on.connecting';

    logger._error({filename: __filename, methodname: methodname, message: 'connecting to: '+dbURI_Config });


});

mongoose.connection.on('connected', function(){

    let methodname = 'mongoose.connection.on.connected';

    logger._info({filename: __filename, methodname: methodname, message: 'create initial applicaiton configuratiuon in DB' });

    try {
        mongo.createModel(configSchema.getSchema());

        mongo.createConfig(appConfig.getConfig());

    }
    catch(err){

        logger._error({filename: __filename, methodname: methodname, message: 'Error creating configuration data: '+err.message });

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

    logger._info({filename: __filename, methodname: methodname, message: 'Attempting connection to ' + uri});

    if ((retryCount < maxRetries) && (!connected))
    {

        try {
            mongoose.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true}).
            then(() => {

                logger._info({filename: __filename, methodname: methodname, message: 'connected to: ' + uri});
                connected = true;
                retryCount = 0;

            }).
            catch((error) => {

                retryCount++;

                if( retryCount < maxRetries){

                    logger._info({filename: __filename, methodname: methodname, message: error.message+': connected: '+connected+': retry count : ' + retryCount});
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

        handleConnectionError(new Error('cannot connect: Retry attempts: '+retryCount));

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
 * handleConnectionError
 *
 * @param err
 */
function handleConnectionError(err){

    let methodname = 'handleConnectionError';
    let message = messages.mongo.connection_error + dbURI_Config + ": error: " + err.message;
    logger._error({filename: __filename, methodname: methodname, message: message});

}

//----------------------------------------------------------------------------------------------------------------------
//Functions to enable a good shutdown of mongoose and the app server
//----------------------------------------------------------------------------------------------------------------------

let gracefulShutdown = function(msg, exit){
    mongoose.connection.close(function(){

        logger._info({filename: __filename, methodname: 'gracefulShutdown', message: 'closed connection with: '+dbURI_Config });

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
