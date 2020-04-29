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

const testAlreadyRunning = 'Test is already running';

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

        if ((res !== undefined) && (res.statusCode !== undefined ) && (body.err !== testAlreadyRunning)) {

            res.statusCode === 200 ?
                console.log(increment + ': delay: ' + delay + ': duration: ' + String(Date.now() - start - delay) + 'ms : ' + JSON.stringify(body)) :
                console.log(increment + ': ' + "ERROR: status code " + res.statusCode + ' ' + JSON.stringify(res.body));
       }

    }

    increment++;

    start = Date.now();

    setTimeout(()=>{request(options, test)},delay);

}


