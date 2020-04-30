/**
 * api
 *
 * Created by Peter Whitehead 23 September 2018
 *
 * Baseline application that serves an API and basic web pages
 *
 * Copyright Peter Whitehead @2020
 *
 * Licensed under Apache-2.0
 */

'use strict';

const configAPI = require('./configApi');
const basicAPI = require('./basicAPI');

module.exports.deleteConfig = configAPI.deleteConfig;
module.exports.postConfig = configAPI.postConfig;
module.exports.getConfig = configAPI.getConfig;
module.exports.getInfo = basicAPI.getInfo;
module.exports.getVersion = basicAPI.getVersion;
module.exports.getTest = basicAPI.getTest;
module.exports.getStatus = basicAPI.getStatus;

