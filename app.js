'use strict';
/**
 * Express App
 *
 * Created by Peter Whitehead 23 September 2018
 *
 * Baseline application that serves an API and basic web pages
 *
 * Copyright Peter Whitehead @2020
 *
 * Licensed under Apache-2.0
 */

let config = require('./app_config/config.json');
const pageConfig = require('./app_config/pageConfig');
const messages = require('./app_utilities/messages').messages;
const applogger = require('./app_utilities/logger');
const favicon = require('serve-favicon');



require('./app_api/models/db');

//if the NODE_ENV environment variable has not been set then use the default configuration to set a production level.

if (process.env.NODE_ENV === undefined){

    if (typeof(config) ==='object') {

        process.env.NODE_ENV = config.inProduction === true ? config.production : config.development;

    }

}


const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./app_server/routes/index');
const usersRouter = require('./app_server/routes/users');

const apiRouter = require('./app_api/routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname,'app_server', 'views'));
app.set('view engine', 'pug');
app.locals.pretty = true; //format the HTML so it is human readable

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(config.indexRoute, indexRouter);
app.use(config.userRoute, usersRouter);
app.use(config.apiRoute, apiRouter);

//serve a favicon if requested
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// catch 404 and forward to error handler
app.use(function(req, res ) { //removed next to stop warnings

    const err = createError(config.status.notFound, req.url);

    const data = pageConfig.notfound.data;

    data.url = config.appServerAddress + req.url;

    if (process.env.NODE_ENV === 'development') {
        data.information = err.stack;
    }
    else{
        data.information = messages.page_not_found;
    }

    applogger._error({filename: "app.js", methodname: data.url, message: err.stack});

    res.status(config.status.notFound);
    res.render('error', data);

});

// error handler
app.use(function(err, req, res) { //removed next to suppress warnings


   res.status(err.status || config.status.error);

   const data = pageConfig.error.data;

   data.url = config.appServerAddress + req.url;

   if (process.env.NODE_ENV === 'development') {
       data.information = err.stack;
   }
   else{
       data.information = messages.production_error;
   }

   applogger._error({filename: "app.js", methodname: data.url, message: err.stack});

   res.status(config.status.error);
   res.render(pageConfig.error.view, data);

});



module.exports = app;
