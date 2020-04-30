'use strict';

//let logger = require('morgan');

let date = new Date();

let dateSeparator = "-";
let timeSeparator = ":";
let space = " ";
let separator = timeSeparator+space;

module.exports.log = function(testName, message){

    let timestamp = date.getDate()+dateSeparator+
                    (date.getMonth()+1)+dateSeparator+  //Jan = 0, Dec = 11 ?!?!
                    date.getFullYear()+space+
                    date.getHours()+timeSeparator+
                    date.getMinutes()+timeSeparator+
                    date.getSeconds()+timeSeparator+
                    date.getMilliseconds();

    console.log(timestamp+space+testName+separator+message);

};
