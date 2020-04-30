/**
 * testData
 *
 * Created by Peter Whitehead March 2020
 *
 * Baseline application that serves an API and basic web pages
 *
 * Copyright Peter Whitehead @2020
 *
 * Licensed under Apache-2.0
 *
 */
'use strict';

module.exports.testDefinitions={
  apiTests: [
      require('./postConfigConfigid-valid-GoodStatus').postConfigConfigidValidUpdateSuccess,
      require('./postConfigConfigid-invalid-ErrorStatus').postConfigConfigidInvalidErrorStatus,
      require('./getConfigGoodStatus').getConfigGoodStatus,
      require('./getInfoGoodStatus').getInfoGoodStatus,
      require('./getVersionGoodStatus').getVersionGoodStatus,
      require('./getStatusGoodStatus').getStatusGoodStatus,
      require('./getInvalidAPI_PageNotFound').getInvalidAPI_PageNotFound,
      require('./onlyOneConfigObject').onlyOneConfigObject,
      require('./deleteConfigGoodStatus').deleteConfigGoodStatus
  ],
};
