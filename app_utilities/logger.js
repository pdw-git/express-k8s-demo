'use strict';

const levels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];
let defaultLoggingLevel = levels.indexOf('info');

const msgSeparator = " : ";
const methodSeparator = "-";

const {createLogger, format, transports} = require('winston');

const {combine, timestamp, json, colorize, simple} = format;

//set a default logging level

let loggingLevelIndex = defaultLoggingLevel;
let loggingLevelName = levels[defaultLoggingLevel];

//if there is no NODE_ENV variable set and there is a configuration object then use the default valued from the config
//object.

process.env.LOGGING_LEVEL === undefined ?
    setLoggingLevels(loggingLevelName, loggingLevelIndex) :
    setLoggingLevels(process.env.LOGGING_LEVEL,levels.indexOf(process.env.LOGGING_LEVEL));


const logger = createLogger({
    level: loggingLevelName,
    format: combine(timestamp(), json(), colorize()),
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new transports.File({ filename: 'error.log', level: 'error', format: simple()}),
        new transports.File({ filename: 'combined.log', format: simple()})
    ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({format: simple()}));
}

//log the current logging level

logger.log(levels[2], 'application logging level: '+levels[loggingLevelIndex]);

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

