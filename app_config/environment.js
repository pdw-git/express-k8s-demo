/**
 * environment
 *
 * Created by Peter Whitehead April 2020
 *
 * Baseline application that serves an API and basic web pages
 *
 * Copyright Peter Whitehead @2020
 *
 * Licensed under Apache-2.0
 */

'use strict';

/*
Created by Peter Whitehead 1st April 2020
 */

const config = require('./config');
const dotenv = require('dotenv');

/**
 * getEnvironmentVariables
 *
 * Determine which environment to use based on the deployment style
 *
 * Deployment style defined externally in NODE_ENV
 */
module.exports.getEnvironmentVariables = function(){

    if ((process.env.EXP_API_APP_DIR) && (process.env.EXP_API_ENV_DEPLOYMENT)){

        switch(process.env.EXP_API_ENV_DEPLOYMENT){
            case 'npm':
                dotenv.config({ path: process.env.EXP_API_APP_DIR+config.environments.npm});
                break;

            case 'docker':
                //dotenv.config({path: process.env.EXP_API_APP_DIR+config.environments.dockerCompose});
                break;

            case 'docker-compose':

                break;

            case 'K8S':

                break;

            default:
                console.error('Not a valid deployment type: '+process.env.EXP_API_ENV_DEPLOYMENT);
                process.exit(-1);

        }

        //Check that all the expected environment variables have been passed to the application
        let notFound = environmentVariablesExist(config.expectedEnvironmentVariables);

        //if any environment variables are missing then exist the applications with error code -1.
        if(notFound.length > 0){

            console.error('The following environment variables cannot be found find : '+notFound.toString());
            process.exit(-1);

        }

    }
    else{
        console.error('EXP_API_ENV_DEPLOYMENT or EXP_API_APP_DIR are missing from the environment');
        process.exit(-1);
    }


};


/**
 * enviromentVariablesExist
 *
 * Checks the process.env keys looking for variables that are defined in the
 * application configuration file. If any are missing return and array that
 * contains the names of the missing variables.
 *
 * @param keyArray
 * @returns {Array}
 */
function environmentVariablesExist(keyArray){

    let notFound = [];


    //Get an array of keys
    let keys = Object.keys(process.env);

    if(Array.isArray(keys)) {

        keyArray.forEach((element) => {

            !keys.includes(element) ? notFound.push(element) : {};


        });
    }
    else{
        console.error('The object is not an Array');
    }

    return notFound;
}