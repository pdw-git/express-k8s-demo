/**
 * mongoActions
 *
 * Created by Peter Whitehead March 2020
 *
 * Baseline application that serves an API and basic web pages
 *
 * Copyright Peter Whitehead @2020
 *
 * Licensed under Apache-2.0
 */

'use strict';

const mongoose = require('mongoose');
const logger = require('../../app_utilities/logger');
const messages = require('../../app_utilities/messages').messages;
const config = require('../../app_config/config');

// noinspection,DuplicatedCode
module.exports.configProject = config.mongo.configObjectName;

// noinspection DuplicatedCode,DuplicatedCode
module.exports.find = findObj;
module.exports.create = createObj;
module.exports.delete = deleteObj;
module.exports.update = updateObj;
module.exports.getMongoObject = getMongoObject;
module.exports.updateDoc = updateMongooseDoc;


/**
 * findObj
 * @param findObject
 * @param mongoObjectName
 * @param callback(doc, err)
 */
function findObj(findObject, mongoObjectName, callback){

    let methodname = 'findObj';

    logger._debug({filename: __filename, methodname: methodname, message: messages.started+' : mongoObjectName : '+mongoObjectName+': '+': findObject '+JSON.stringify(findObject)});

    getMongoObject(mongoObjectName) ?
        getMongoObject(mongoObjectName).find(findObject, callback).sort(mongoObjectName) :
        logger._error({filename:__filename, methodname: methodname, message: messages.mongo.cannot_find_object+mongoObjectName});

}

/**
 * createObj
 * @param mongoObjectName
 * @param dataObject
 * @param callback
 * @param schema
 */
function createObj(mongoObjectName, dataObject, schema, callback){

    let methodname = 'createObj';

    logger._debug({filename:__filename, methodname:methodname, message: messages.started+' : mongoObjectName : '+mongoObjectName});

    if(getMongoObject(mongoObjectName, schema)){

        let mongoObject = getMongoObject(mongoObjectName, schema);

        // noinspection JSValidateTypes
        let mo = new mongoObject(dataObject);

        // noinspection JSIgnoredPromiseFromCall
        mo.save((err)=>{

            if(err) {

                logger._error({filename: __filename, methodname: methodname, message: err.message});

            }
            else {

                logger._info({filename: __filename, methodname: methodname, message: messages.mongo.object_created});

                callback != null ? callback(): {};

            }

        });
    }
    else {

        logger._error({filename: __filename, methodname: methodname, message: messages.mongo.cannot_get_model});

    }

}

/**
 * deleteObj
 * @param mongoObjectName
 * @param id
 * @param callback
 */
function deleteObj(mongoObjectName, id, callback){

    let methodname = 'deleteObj';

    logger._debug({filename: __filename, methodname: methodname, message: messages.started+' : mongoObjectName : '+mongoObjectName+': _id :'+id});

    getMongoObject(mongoObjectName)?
        getMongoObject(mongoObjectName).findOneAndDelete({_id: id}, callback): //.exec(callback):
        logger._error({filename: __filename, methodname: methodname, message: messages.mongo.cannot_get_model});

}


/**
 * updateObj
 * @param mongoObjectName
 * @param id
 * @param plugin
 * @param callback
 */
function updateObj(mongoObjectName, id, plugin, callback){

    let methodname = 'update';

    logger._debug({filename: __filename, methodname: methodname, message: messages.started+' : mongoObjectName : '+mongoObjectName+': id :'+id});

    getMongoObject(mongoObjectName) ?
        getMongoObject(mongoObjectName).findOne(id, callback) :
        logger._error({filename: __filename, methodname: methodname, message: messages.mongo.cannot_get_model});
}

/**
 * createModel
 */
module.exports.createModel = function(objectName, schema){

    let methodname = 'createModel';

    logger._debug({filename: __filename, methodname: methodname, message: messages.started+': configSchema: '+JSON.stringify(schema)});

    mongoose.model(objectName, schema);

    logger._info({filename: __filename, methodname: methodname, message: messages.mongo.created_model+config.mongo.configObjectName});

};



/**
 * getMongoProject
 * @param mongoObjectName
 * @param schema
 * @returns {Model}
 */
function getMongoObject(mongoObjectName, schema){

    return mongoose.model(mongoObjectName, schema);

}

/**
 * updateMongooseDoc
 * @param doc
 * @param newData
 * @returns {*}
 */
function updateMongooseDoc(doc, newData){

    //Get the keys from the JSON object
    let keys = Object.keys(newData);

    let retVal = null;

    if (Array.isArray(keys)){

        keys.forEach((value) => {

            //set the path in the doc with the corresponding data from the source object.
            //doc.set ignores any paths that do not exist in the schema
            doc.set(value, newData[value]);

            retVal = doc;

        });

    }

    return retVal;

}