/**

 created 7th September 2018

 */


const configAPI = require('./configApi');
const basicAPI = require('./basicAPI');

module.exports.deleteConfig = configAPI.deleteConfig;
module.exports.postConfig = configAPI.postConfig;
module.exports.getConfig = configAPI.getConfig;
module.exports.getInfo = basicAPI.getInfo;
module.exports.getVersion = basicAPI.getVersion;
module.exports.getTest = basicAPI.getTest;
module.exports.getStatus = basicAPI.getStatus;

