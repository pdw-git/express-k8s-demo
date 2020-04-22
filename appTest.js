'use strict';

let request = require('request');

let myArgs = process.argv.slice(2);

let delay = myArgs[0] ? myArgs[0] : 0;
let ipAddress = myArgs[1] ?  myArgs[1] : '127.0.0.1:3000';
let apiCall = myArgs[2] ? myArgs[2] : status;
let options = {
    url: 'http://'+ipAddress + "/api/"+apiCall,
    method: "get",
    json: {},
    qs: {}
};


console.log('Options: '+JSON.stringify(options));

console.log('Delay = '+delay);
console.log('ipAddress = '+ipAddress);

let increment = 1;
let start = Date.now();

console.log('start time: '+start);

request(options, test);

function test(err, res, body){

    if (err){
        console.log(increment+': ERROR: '+err);

    } else{
        console.log(increment+': duration: '+String(Date.now()-start-delay)+'ms : '+JSON.stringify(body));

        if((res !== undefined) && (res.statusCode !== undefined ) && (res.statusCode !== 200)) {

            console.log(increment+': '+"ERROR: status code "+res.statusCode);
        }

    }

    increment++;

    start = Date.now();

    setTimeout(()=>{request(options, test)},delay);

}


