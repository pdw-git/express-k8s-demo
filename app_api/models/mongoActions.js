'use strict';

const mongoose = require('mongoose');
const logger = require('../../app_utilities/logger');
const messages = require('../../app_utilities/messages').messages;
const config = require('../../app_config/config');

module.exports.configProject = config.mongo.configObjectName;
module.exports.find = findObj;
module.exports.create = createObj;
module.exports.delete = deleteObj;
module.exports.update = updateObj;
module.exports.createConfig = createConfig;

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
 */
function createObj(mongoObjectName, dataObject){

    let methodname = 'createObj';

    logger._debug({filename:__filename, methodname:methodname, message: messages.started+' : mongoObjectName : '+mongoObjectName});


    if(getMongoObject(mongoObjectName)){

        let mongoObject = getMongoObject(mongoObjectName);

        let mo = new mongoObject(dataObject);

        // noinspection JSIgnoredPromiseFromCall
        mo.save((err)=>{
            err ?
                logger._error({filename: __filename, methodname:methodname, message: err.message}):
                logger._info({filename:__filename, methodname:methodname, message: messages.mongo.object_created});

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

    logger._debug({filename: __filename, methodname: methodname, message: messages.started+' : mongoObjectName : '+mongoObjectName+': _id :'+id});

    getMongoObject(mongoObjectName) ?
        getMongoObject(mongoObjectName).findOne(id, callback) :
        logger._error({filename: __filename, methodname: methodname, message: messages.mongo.cannot_get_model});
}

/**
 * createModel
 */
module.exports.createModel = function(configSchema){

    let methodname = 'createModel';

    logger._debug({filename: __filename, methodname: methodname, message: messages.started+': configSchema: '+JSON.stringify(configSchema)});

    mongoose.model(config.mongo.configObjectName, configSchema);

    logger._info({filename: __filename, methodname: methodname, message: messages.mongo.created_model+config.mongo.configObjectName});

};

/**
 * createConfig
 * @param dataObject
 */
function createConfig(dataObject){

    let methodname = 'createConfig';

    logger._debug({filename: __filename, methodname: methodname, message: messages.started+': dataObject: '+JSON.stringify(dataObject)});

    findObj({}, config.mongo.configObjectName, (err,doc)=>{

        if(err){
            logger._error({filename: __filename, methodname:'mongo.find', message: err.message});
        }
        else {

            switch(doc.length){

                //Nothing found: create the config data object
                case 0 :
                    logger._debug({filename: __filename, methodname: methodname, message: 'create new config object'});
                    createObj(config.mongo.configObjectName, dataObject);
                    logger._info({filename: __filename, methodname: methodname, message: messages.mongo.object_exists+config.mongo.configObjectName});
                    break;

                //There is a config object: delete it and create a new one
                case 1 :
                    logger._debug({filename: __filename, methodname: methodname, message: 'delete '+doc[0]._id+' create new config object'});
                    deleteObj(config.mongo.configObjectName, doc[0]._id, (err)=>{
                        err ?
                            logger._error({filename: __filename, methodname: methodname, message: err}) :
                            createObj(config.mongo.configObjectName, dataObject);
                    });
                    break;

                //if the length is greater than 1 then there is a problem with the database, log an error.
                default:
                    logger._error({filename: __filename, methodname:'mongo.find', message: messages.mongo.invalid_doc_length+doc.length});

            }

        }

    });

}

/**
 * getMongoProject
 * @param mongoObjectName
 * @returns {Model}
 */
function getMongoObject(mongoObjectName){

    return mongoose.model(mongoObjectName);

}