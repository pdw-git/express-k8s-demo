/**
 * messageQ
 *
 * Created by Peter Whitehead May 2020
 *
 * Baseline application that serves an API and basic web pages
 *
 * Copyright Peter Whitehead @2020
 *
 * Licensed under Apache-2.0
 */

'use strict';

const mqlight = require('mqlight');
const logger = require('../../app_utilities/logger');
const messages = require('../../app_utilities/messages').messages;

let recvClient = null;
let sendClient = null;
let topicPattern = 'config/change';
let topic = topicPattern;

module.exports.getmsgRX = getRecvClient;
module.exports.getMsgTX = getSendClient;
module.exports.configTopic = topic;

recvClient = mqlight.createClient({service: process.env.EXP_API_AMQP_URI}, (err) => {
    let methodname = 'createClient';
    err ?
        logger._error({filename: __filename, methodname: methodname, message: err})
        : logger._info({filename: __filename, methodname: methodname, message: 'mqlight recvClient created'});
});

sendClient = mqlight.createClient({service: process.env.EXP_API_AMQP_URI}, (err) => {
    let methodname = 'createClient';
    err ?
        logger._error({filename: __filename, methodname: methodname, message: err})
        : logger._info({filename: __filename, methodname: methodname, message: 'mqlight sendClient created'});
});

recvClient.on('error', (err)=>{
    let methodname = 'recvClient.on.error';
    logger._error({filename: __filename, methodname: methodname, message:err });
});

sendClient.on('error', (err)=>{
    let methodname = 'sendClient.on.error';
    logger._error({filename: __filename, methodname: methodname, message: err});
});

recvClient.on('started', function () {
    let methodname = recvClient;

    recvClient.subscribe(topicPattern, null, {}, ()=>{
        logger._info({filename: __filename, methodname: methodname, message: messages.mqlight.subscribed_to + topicPattern});
    });

    recvClient.on('message', function (data) { //removed delivery to suppress warnings
        let methodname = 'recvClinet.on.message';
        logger._info({filename: __filename, methodname: methodname, message: messages.mqlight.received_message + data});
    });

});

sendClient.on('started', function () {

    sendClient.send(topic, messages.mqlight.initial_msg, {}, function (err, data) {
        let methodname = 'sendClient.send';

        err ? logger._error({filename: __filename, methodname: methodname, message: err})
            : logger._info(
                {   filename: __filename,
                    methodname: methodname,
                    message: messages.mqlight.sent_message + messages.mqlight.initial_msg + messages.mqlight.to_topic+data
                });

    });

});

function getRecvClient(){
    return recvClient;
}

function getSendClient(){
    return sendClient
}