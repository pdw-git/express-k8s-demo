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

            case 'docker-compose':
                dotenv.config({path: process.env.EXP_API_APP_DIR+config.environments.dockerCompose});
                break;

            default:
                console.error('Not a valid deployment type: '+process.env.EXP_API_ENV_DEPLOYMENT);
                process.exit(-1);

        }

    }
    else{
        console.error('EXP_API_ENV_DEPLOYMENT or EXP_API_APP_DIR are missing from the environment');
        process.exit(-1);
    }


};