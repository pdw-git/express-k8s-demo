/**
* pages
*
* Created by Peter Whitehead September 2018
* Baseline application that serves an API and basic web pages
*
* Copyright Peter Whitehead @2018 to 2020
*
* Licensed under Apache-2.0
*/

'use strict';

const logger = require('../../app_utilities/logger');
const pageConfig = require('../../app_config/pageConfig');
const config = require('../../app_config/config');
const filename = "app_server/controllers/pages.js";


/**
 * index
 * GET home page
 * @param req
 * @param res
 */
module.exports.index = function(req, res){

    const methodname = "index";

    logger._debug({filename: filename, methodname: methodname, message: 'started'});

    res.status= config.status.good;

    res.render(pageConfig.index.view, pageConfig.index.data);

    logger._debug({filename: filename, methodname: methodname, message: 'completed'});

};


/**
 * about
 * GET description of application
 * @param req
 * @param res
 */
module.exports.about = function(req, res){

    const methodname = "about";

    logger._debug({filename: filename, methodname: methodname, message: 'started'});

    res.status = config.status.good;

    res.render(pageConfig.about.view, pageConfig.about.data);

    logger._debug({filename: filename, methodname: methodname, message: 'completed'});

};