/**
 * Created by whitep on 26/03/2020
 */

const mongoose = require( 'mongoose' );
const logger = require('../../app_utilities/logger');
const messages = require('../../app_utilities/messages').messages;

let retryCount = 0;
let maxRetries = 10;
let connected = false;

//const dbURI_Config = process.env.MONGO_URI+process.env.MONGO_PORT+'/'+process.env.MONGO_DB_NAME;
const dbURI_Config = process.env.MONGO_URI+process.env.MONGO_DB_NAME;
logger._info({filename: __filename, methodname: 'main', message: 'MONGO dbURI: '+dbURI_Config});

connectToMongo(dbURI_Config);

mongoose.connection.on('disconnected', function (){
    logger._info({filename: __filename, methodname: 'mongoose.connection.on(disconnected)', message: 'disconnected from: '+dbURI_Config })
});

function connectToMongo(uri){

    let methodname = 'connectToMongo';

    if ((retryCount < maxRetries) && (!connected))
    {

        try {
            mongoose.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true}).then(() => {
                logger._info({filename: __filename, methodname: methodname, message: 'connected to: ' + uri});
                connected = true;
                retryCount++;
            }).catch((error) => {
                handleConnectionError(error)
            });
        } catch (err) {
            handleConnectionError(err);
        }

    }
    else {

    }
}

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



require('./project.js');