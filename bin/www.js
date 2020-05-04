/**
 * Express-api-app: www
 *
 * Created by Peter Whitehead 23 September 2018
 *
 * Baseline application that serves an API and basic web pages
 *
 * Copyright Peter Whitehead @2010 to 2020
 *
 * Licensed under Apache-2.0
 */

/*
Get the environment variables.
 */
require('../app_config/environment').getEnvironmentVariables();

const applogger = require('../app_utilities/logger');
const messages = require('../app_utilities/messages').messages;
const config = require('../app_config/config');
const app = require('../app');
const debug = require('debug')('express:server');
const http = require('http');
const https = require('https');
const fs = require('fs');
const filename = __filename;
const methodName = 'main';

let server = null;

//Get port from environment and store in Express.
const port = normalizePort((process.env.EXP_API_PORT === undefined ? config.defaultPort : process.env.EXP_API_PORT));

app.set('port', port);

//set up the http/https server dependent on values stored in the application configuration file

process.env.EXP_API_HTTPS === undefined ? process.env.EXP_API_HTTPS = 'no' : {};

applogger._info({filename: filename, methodname: methodName, message: "Application port: "+port+' Encrpytion: '+process.env.EXP_API_HTTPS});

server = process.env.EXP_API_HTTPS === 'yes' ?
    https.createServer(
        {
        key: fs.readFileSync(process.env.EXP_API_APP_DIR+process.env.EXP_API_KEY_STORE+process.env.EXP_API_APP_KEY),
        cert: fs.readFileSync(process.env.EXP_API_APP_DIR+process.env.EXP_API_KEY_STORE+process.env.EXP_API_APP_CERT)
      },
    app)
    : http.createServer(app);

process.env.EXP_API_HTTPS === 'yes' ?
    applogger._info({filename: filename, methodName: methodName, message: messages.https_cert_provider+process.env.EXP_API_CERT_PROVIDER}):null;

if (server !== null) {

  //listen on the defined port
  server.listen(port);

  //define the error and listening behaviours
  server.on('error', onError);
  server.on('listening', onListening);

}
else {
  applogger._error({filename: filename, methodName: methodName, message: messages.http_server_creation_error});
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}