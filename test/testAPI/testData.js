'use strict';

module.exports.testDefinitions={
  apiTests: [
      require('./postConfigConfigid-valid-GoodStatus').postConfigConfigidValidUpdateSuccess,
      require('./postConfigConfigid-invalid-ErrorStatus').postConfigConfigidInvalidErrorStatus,
      require('./getConfigGoodStatus').getConfigGoodStatus,
      require('./getInfoGoodStatus').getInfoGoodStatus,
      require('./getVersionGoodStatus').getVersionGoodStatus,
      require('./getStatusGoodStatus').getStatusGoodStatus
  ],
};
