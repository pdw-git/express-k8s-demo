'use strict';

let request = require('request');

let myArgs = process.argv.slice(2);

let delay = myArgs[0] ? myArgs[0] : 1000;
let ipAddress = myArgs[1] ?  myArgs[1] : 'http://localhost:3000';

console.log('Delay = '+delay);
console.log('ipAddress = '+ipAddress);

let increment = 1;
let start = Date.now();

console.log('start time: '+start);

//let interval = setInterval(function(){

setInterval(function(){

    let options = {

        url: ipAddress+"/api/test",
        method: "get",
        json: {},
        qs: {}
    };

    start = Date.now();

    request(options, function(err, res, body){
        if (err){
            console.log(increment+': ERROR: '+err);
            //clearInterval(interval);
        } else{
            console.log(increment+': '+String(Date.now()-start)+' : '+JSON.stringify(body))
        }
        if((res !== undefined) && (res.statusCode !== undefined ) && (res.statusCode !== 200)) {
            //clearInterval(interval); //stop the interval timer
            console.log(increment+': '+"ERROR: status code "+res.statusCode);
        }

        increment++;

    });

}, delay);