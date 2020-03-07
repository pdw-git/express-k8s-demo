'use strict';

let levels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];

const msgSeparator = " : ";
const methodSeparator = "-";

const {createLogger, format, transports} = require('winston');

const {combine, timestamp, json, colorize, simple} = format;

const config = require('../app_config/config.json');

//set a default logging level and then set the logging level as defined in the
//configuration data file.

let appLoggingLevel = 'info';

if(typeof(config) === 'object') {

    if (levels.includes(config.minLogLevel)) {

        appLoggingLevel = levels.indexOf(config.minLogLevel);

    }

}


const logger = createLogger({
    level: config.minLogLevel,
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

logger.log(levels[2], 'application logging level: '+levels[appLoggingLevel]);

function logMessage(level, message) {

    if(levels.indexOf(level) <= appLoggingLevel) {
        logger.log(level, message)
    }

}

function formatMessage(msg){

    return (msg.filename + methodSeparator + msg.methodname + msgSeparator + msg.message);
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

