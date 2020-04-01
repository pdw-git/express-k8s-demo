/**
 * Created by whitep on 26/03/2020
 */

const mongoose = require( 'mongoose' );
const logger = require('../../app_utilities/logger');

const dbURI_Config = process.env.MONGO_URI+process.env.MONGO_PORT+'/'+process.env.MONGO_DB_NAME;

logger._info({filename: __filename, methodname: 'main', message: 'MONGO dbURI: '+dbURI_Config});

mongoose.connect(dbURI_Config,{useUnifiedTopology: true, useNewUrlParser: true});

mongoose.connection.on('connected', function (){
    logger._info({filename: __filename, methodname: 'mongoose.connection.on(connection)', message: 'connected to: '+dbURI_Config });
});

mongoose.connection.on('error', function (err){

    logger._error({filename: __filename, methodname: 'mongoose.connection.on(error)', message: 'Not connected to: '+dbURI_Config+
    err.message
    });

});

mongoose.connection.on('disconnected', function (){
    logger._info({filename: __filename, methodname: 'mongoose.connection.on(disconnected)', message: 'disconnected from: '+dbURI_Config })
});

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