/**
 * apiServerDefinitions
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

module.exports.GET = 'GET';
module.exports.POST = 'POST';
module.exports.DELETE = 'DELETE';
module.exports.GOOD_STATUS = 200;
module.exports.PAGE_NOT_FOUND = 404;
module.exports.ERROR_STATUS = 500;

//server definitions

module.exports.port = process.env.EXP_API_PORT;  //take environment variable over the default configuration.

const urlType = (process.env.EXP_API_HTTPS === 'yes') ? 'https://' : 'http://';

module.exports.apiOptions = {
    server: urlType+process.env.EXP_API_APP_IP+":"+this.port,
    path: process.env.EXP_API_API_ROUTE,
    root: process.env.EXP_API_API_ROUTE
};