
//the data that the
var validationElelments = [
    {data: undefined},
    {data: null},
    {data: "undefined"},
    {data: "null"}

    ];

/**
 * checkParams
 *
 * Takes a JSON object of paramaters and checks to make sure they are not undefined or null
 *
 * If paramaters are good it runs the call back
 *
 * otherwise it responds with an error message
 *
 * @param params
 * @param req
 * @param res
 * @param callback
 */

module.exports.checkParams = function(params, req, res, callback){

    var errors = [];

    var err = "";

    if(typeof(params) !== 'object'){

        err = "params are not an opject: type: " + typeof(params);

    }
    else {

        if ((params === null) || (params === undefined)) {

            err = "params are undefined or null";

        }
        else {

            for (var key in params) {

                validationElelments.forEach(function (element) {

                    if (params[key] === element.data) {

                        errors.push("key: " + key + " is " + element.data + ": ");

                    }

                });

            }

            if (errors.length > 0) {

                err = "";

                for (var i = 0; i < errors.length; i++) {

                    err += errors[i] + " ";

                }

            }

        }

    }

    callback(err, req, res);

};
