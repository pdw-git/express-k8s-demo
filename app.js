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

//Configure the database and models
require('./app_api/models/db');

//if the NODE_ENV_PRODUCTION environment variable has not been set then set it to false
process.env.EXP_API_ENV_PRODUCTION === undefined ? process.env.EXP_API__ENV_PRODUCTION = 'no' : null;

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

app.use(process.env.EXP_API_INDEX_ROUTE, indexRouter);
app.use(process.env.EXP_API_USER_ROUTE, usersRouter);
app.use(process.env.EXP_API_API_ROUTE, apiRouter);

//serve a favicon if requested
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// catch 404 and forward to error handler
app.use(function(req, res ) { //removed next to stop warnings

    const err = createError(config.status.notFound, req.url);

    const data = pageConfig.notfound.data;

    data.url = process.env.EXP_API_APP_IP + req.url;

    defineErrorContent(err, data, messages.page_not_found, config.status.notFound, res);

});

// error handler
app.use(function(err, req, res) { //removed next to suppress warnings


    res.status(err.status || config.status.error);

    const data = pageConfig.error.data;

    data.url = process.env.EXP_API_APP_IP + req.url;

    defineErrorContent(err, data, messages.production_error, config.status.error, res);

});

function defineErrorContent(err, data, msg, status, res){

    if (process.env.EXP_API__ENV_PRODUCTION === 'no') {
        data.information = err.stack;
    }
    else{
        data.information = msg;
    }

    applogger._error({filename: __filename, methodname: data.url, message:'status: '+status+':'+ err.message});

    res.status(status);
    res.render('error', data);

}


module.exports = app;
