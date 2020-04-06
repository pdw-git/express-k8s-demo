'use strict';

const mongoose = require('mongoose');
const logger = require('../../app_utilities/logger');
const messages = require('../../app_utilities/messages').messages;
const config = require('../../app_config/config');

module.exports.configProject = config.mongo.configObjectName;

/**
 * find
 * @param findObject
 * @param mongoObjectName
 * @param callback(doc, err)
 */
module.exports.find = function(findObject, mongoObjectName, callback){

    getMongoObject(mongoObjectName) ?
        getMongoObject(mongoObjectName).find(findObject, callback).sort(mongoObjectName) :
        logger._error({filename:__filename, methodname: 'find', message: messages.mongo.cannot_find_object+mongoObjectName});

};

/**
 * create
 * @param mongoObjectName
 * @param dataObject
 */
module.exports.create = function(mongoObjectName, dataObject){

    let methodname = 'create';

    logger._debug({filename:__filename, methodname:methodname, message: messages.started});


    if(getMongoObject(mongoObjectName)){

        let mongoObject = getMongoObject(mongoObjectName);

        let mo = new mongoObject(dataObject);

        mo.save((err)=>{
            err ?
                logger._error({filename: __filename, methodname:methodname, message: err.message}):
                logger._info({filename:__filename, methodname:methodname, message: messages.mongo.object_created});

        });
    }
    else {

        logger._error({filename: __filename, methodname: methodname, message: messages.mongo.cannot_get_model});

    }

};

/**
 * delete
 * @param mongoObjectName
 * @param id
 * @param callback
 */
module.exports.delete = function(mongoObjectName, id, callback){

    let methodname = 'delete';

    getMongoObject(mongoObjectName)?
        getMongoObject(mongoObjectName).findOneAndDelete({_id: id}, callback): //.exec(callback):
        logger._error({filename: __filename, methodname: methodname, message: messages.mongo.cannot_get_model});

};


/**
 * update
 * @param mongoObjectName
 * @param id
 * @param plugin
 * @param callback
 */
module.exports.update = function(mongoObjectName, id, plugin, callback){

    let methodname = 'update';

    getMongoObject(mongoObjectName) ?
        getMongoObject(mongoObjectName).findOne(id, callback) :
        logger._error({filename: __filename, methodname: methodname, message: messages.mongo.cannot_get_model});
};

/**
 * getMongoProject
 * @param mongoObjectName
 * @returns {Model}
 */
function getMongoObject(mongoObjectName){
    return mongoose.model(mongoObjectName);
}