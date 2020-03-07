/**

 created 7th September 2018

 */
//const request = require('request');
const logger = require('../../app_utilities/logger');
//const messages = require('../../app_utilities/messages').messages;
//const params = require('../../app_utilities/checkParams.js');
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