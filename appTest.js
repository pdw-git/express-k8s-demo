'use strict';

let request = require('request');

let interval = setInterval(function(){

    let options = {

        url: "http://localhost:3000/api/test",
        method: "get",
        json: {},
        qs: {}
    };

    request(options, function(err, res, body){
        if (err){
            console.log('ERROR: '+err);
            clearInterval(interval);
        } else{
            console.log(JSON.stringify(body))
        }
        if((res !== undefined) && (res.statusCode !== undefined ) && (res.statusCode !== 200)) {
            //clearInterval(interval); //stop the interval timer
            console.log("ERROR: status code "+res.statusCode);
        }

    });

}, 300);