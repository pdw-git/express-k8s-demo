
var assert = require('assert');
var params = require('../../app_utilities/checkParams');


describe('checkParams', function(){
    describe('Check the expected funciton of the checkParms function when params are null', function(){
        it('should return a well structured err string', function(){


            var validation = null;

            params.checkParams(validation, null, null, function(err){

                assert.equal(err, "params are undefined or null", "invalid error message");


            });

        });

    });

});

describe('checkParams', function(){
    describe('Check the expected funciton of the checkParms function when params are undefined', function(){
        it('should return a well structured err string', function(){


            var validation = {};

            params.checkParams(validation.undefined, null, null, function(err){

                assert.equal(err, "params are not an opject: type: undefined", "invalid error message");


            });

        });

    });

});


describe('checkParams', function(){
    describe('Check the expected funciton of the checkParms function when paramaters are undefined', function(){
       it('should return a well structured err string', function(){


           var validation = {projectid: undefined, pinid: undefined};

           params.checkParams(validation, null, null, function(err){

               assert.equal(err, "key: projectid is undefined:  key: pinid is undefined:  ", "invalid error message");
               assert.equal(err, "key: projectid is undefined:  key: pinid is undefined:  ", "invalid err");


           });

       });

    });

});

describe('checkParams', function(){
    describe('Check the expected funciton of the checkParms function when paramaters are null', function(){
        it('should return a well structured err string', function(){


            var validation = {projectid: null, pinid: null};

            params.checkParams(validation, null, null, function(err){

                assert.equal(err, "key: projectid is null:  key: pinid is null:  ", "invalid error message");
                assert.equal(err, "key: projectid is null:  key: pinid is null:  ", "invalid err");


            });

        });

    });

});

describe('checkParams', function(){
    describe('Check the expected funciton of the checkParms function when paramaters are null', function(){
        it('should return a well structured err string', function(){


            var validation = "this is an invalid param object";

            params.checkParams(validation, null, null, function(err){

                assert.equal(err, "params are not an opject: type: string", "invalid error message");

            });

        });

    });

});