/**
 * logger
 *
 * Created by Peter Whitehead March 2020
 *
 * Baseline application that serves an API and basic web pages
 *
 * Copyright Peter Whitehead @2020
 *
 * Licensed under Apache-2.0
 *
 */
'use strict';

module.exports.setLogLevel = updateLoggingLevel;

const levels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];
let defaultLoggingLevel = levels.indexOf('info');

const msgSeparator = " : ";
const methodSeparator = "-";

const {createLogger, format, transports} = require('winston');

const {combine, timestamp, json, colorize, simple} = format;

//set a default logging level

let loggingLevelIndex = defaultLoggingLevel;
let loggingLevelName = levels[defaultLoggingLevel];

//default config settings for the logger
const loggerConfig = {
    level: loggingLevelName,
    format: combine(timestamp(), json(), colorize()),
    transports: [
        new transports.File({ filename: process.env.EXP_API_APP_DIR+'/error.log', level: 'error', format: simple()}),
        new transports.File({ filename: process.env.EXP_API_APP_DIR+'/combined.log', format: simple()})
    ]
};

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

                    process.env.EXP_API_LOGGING_LEVEL = doc[0].logLevel;

                    logger.configure({
                        level: doc[0].logLevel,
                        format: combine(timestamp(), json(), colorize()),
                        transports: [
                            new transports.File({ filename: process.env.EXP_API_APP_DIR+'/error.log', level: 'error', format: simple()}),
                            new transports.File({ filename: process.env.EXP_API_APP_DIR+'/combined.log', format: simple()})
                        ]
                    });

                    process.env.EXP_API_NODE_ENV !== 'production' ?
                        logger.add(new transports.Console({format: simple()})) :
                        logMessage('info',formatMessage({filename:__filename, methodName: methodname, message: 'In production mode'}));

                }
                else {

                    logMessage('error',formatMessage({filename:__filename, methodName: methodname, message: 'Logger has not been defined'}))

                }

            }
            else {
                logMessage('error',formatMessage({filename:__filename, methodName: methodname, message: 'Invalid logging level '+doc[0].logLevel}));

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

process.env.EXP_API_LOGGING_LEVEL === undefined ?
    setLoggingLevels(loggingLevelName, loggingLevelIndex) :
    setLoggingLevels(process.env.EXP_API_LOGGING_LEVEL,levels.indexOf(process.env.EXP_API_LOGGING_LEVEL));

const logger = createLogger(loggerConfig);

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `

if (process.env.EXP_API_NODE_ENV !== 'production') {
    logger.add(new transports.Console({format: simple()}));
}

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

