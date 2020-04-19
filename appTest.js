'use strict';

let request = require('request');

let increment = 1;
let start = Date.now();

console.log('start time: '+start);

let interval = setInterval(function(){



    let options = {

        url: "http://localhost:3000/api/test",
        method: "get",
        json: {},
        qs: {}
    };

    start = Date.now();

    request(options, function(err, res, body){
        if (err){
            console.log(increment+': ERROR: '+err);
            clearInterval(interval);
        } else{
            console.log(increment+': '+String(Date.now()-start)+' : '+JSON.stringify(body))
        }
        if((res !== undefined) && (res.statusCode !== undefined ) && (res.statusCode !== 200)) {
            //clearInterval(interval); //stop the interval timer
            console.log(increment+': '+"ERROR: status code "+res.statusCode);
        }

        increment++;

    });

}, 700);