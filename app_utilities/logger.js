'use strict';

const EventEmitter = require('events');
const mongo = require('../app_api/models/mongoActions');
const config = require('../app_config/config');
const messages = require('../app_utilities/messages').messages;

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

//const checkTime = 30*1000;

module.exports.emitter = myEmitter;

const levels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];
let defaultLoggingLevel = levels.indexOf('info');

const msgSeparator = " : ";
const methodSeparator = "-";

const {createLogger, format, transports} = require('winston');

const {combine, timestamp, json, colorize, simple} = format;

//set a default logging level

let loggingLevelIndex = defaultLoggingLevel;
let loggingLevelName = levels[defaultLoggingLevel];

//===================================================================================================================
//Create an event listener that will update the logging level for the applicationon recieving a 'level' event
//===================================================================================================================

myEmitter.on('level', ()=>{ getLoggingLevel();});

//===================================================================================================================
//If we have multiple instances of this application we need to make sure that updates are picked up from the
//configuration database. Set up an interval process that reads the database and updates the logger process.
//===================================================================================================================

//setInterval(()=>{ getLoggingLevel()}, checkTime);


/**
 * getLoggingLevel
 *
 *
 */
function getLoggingLevel(){

    let methodname = 'getLoggingLevel';

    mongo.find({},config.mongo.configObjectName,(err, doc)=>{

        err ?
            logMessage(levels.indexOf('error'),formatMessage({filename:__filename, methodName: methodname, message: messages.mongo.cannot_find_object})) :
            updateLoggingLevel(doc);

    });

}

/**
 * update Logging Level
 *
 * @param doc
 */
function updateLoggingLevel(doc){

    const methodname = 'updateLoggingLevel';

    //if there is a valid document and the logLevel data is within bounds and a logger has been created
    //updated the logging level
    //reconfigure the looger
    //determine if messages should go to stdout

    if(doc[0] !== "undefined"){

        if(doc[0].logLevel !== "undefined"){

            if(levels.indexOf(doc[0].logLevel) !== -1){

                if (logger !== undefined){

                    setLoggingLevels(doc[0].logLevel, levels.indexOf(doc[0].logLevel));

                    logger.configure({
                        level: doc[0].logLevel,
                        format: combine(timestamp(), json(), colorize()),
                        transports: [
                            new transports.File({ filename: 'error.log', level: 'error', format: simple()}),
                            new transports.File({ filename: 'combined.log', format: simple()})
                        ]
                    });

                    process.env.NODE_ENV !== 'production' ?
                        logger.add(new transports.Console({format: simple()})) :
                        logMessage('info',formatMessage({filename:__filename, methodName: methodname, message: 'In production mode'}));

                }
                else {

                    logMessage('error',formatMessage({filename:__filename, methodName: methodname, message: 'Logger has not been defined'}))

                }

            }
            else {
                logMessage('error',formatMessage({filename:__filename, methodName: methodname, message: 'Invalid logging level'+doc[0].logLevel}));

            }

        }
        else{
            logMessage('error',formatMessage({filename:__filename, methodName: methodname, message: 'doc[0].logLevel is not defined'}));

        }

    }
    else {
        logMessage('error',formatMessage({filename:__filename, methodName: methodname, message: 'doc[0] is not defined'}));

    }

}


//if there is no NODE_ENV variable set and there is a configuration object then use the default valued from the config
//object.

process.env.LOGGING_LEVEL === undefined ?
    setLoggingLevels(loggingLevelName, loggingLevelIndex) :
    setLoggingLevels(process.env.LOGGING_LEVEL,levels.indexOf(process.env.LOGGING_LEVEL));

//default config settings for the logger
const loggerConfig = {
    level: loggingLevelName,
    format: combine(timestamp(), json(), colorize()),
    transports: [
        new transports.File({ filename: 'error.log', level: 'error', format: simple()}),
        new transports.File({ filename: 'combined.log', format: simple()})
    ]
};

const logger = createLogger(loggerConfig);

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({format: simple()}));
}

//log the current logging level

logger.log('info', 'application logging level: '+levels[loggingLevelIndex]);

function logMessage(level, message) {

    if(levels.indexOf(level) <= loggingLevelIndex){
        logger.log(level, message)
    }

}

function formatMessage(msg){

    return (msg.filename + methodSeparator + msg.methodname + msgSeparator + msg.message);
}

function setLoggingLevels(name, index){

    loggingLevelName = name;
    loggingLevelIndex = index;

}

module.exports.getLogLevel = function(){
    return loggingLevelName;
};

module.exports._error = function(message){
    logMessage(levels[0], formatMessage(message));
};

module.exports._warning = function(message){
    logMessage(levels[1],formatMessage(message));
};

module.exports._info = function (message){
        logMessage(levels[2], formatMessage(message));
};

module.exports._verbose = function (message){
    logMessage(levels[3], formatMessage(message));
};

module.exports._debug = function(message){
    logMessage(levels[4], formatMessage(message));
};

module.exports._silly = function (message){
    logMessage(levels[5], formatMessage(message));
};

module.exports.validate = (name)=>{

    return (levels.indexOf(name) !== -1);

};

