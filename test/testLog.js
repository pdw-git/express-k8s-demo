'use strict';

var logger = require('morgan');

var date = new Date();

var dateSeparator = "-";
var timeSeparator = ":";
var space = " ";
var separator = timeSeparator+space;

module.exports.log = function(testName, message){

    var timestamp = date.getDate()+dateSeparator+
                    (date.getMonth()+1)+dateSeparator+  //Jan = 0, Dec = 11 ?!?!
                    date.getFullYear()+space+
                    date.getHours()+timeSeparator+
                    date.getMinutes()+timeSeparator+
                    date.getSeconds()+timeSeparator+
                    date.getMilliseconds();

    console.log(timestamp+space+testName+separator+message);

};
