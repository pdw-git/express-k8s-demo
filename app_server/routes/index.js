/**
* index
*
* Created by Peter Whitehead April 2018
*
* Baseline application that serves an API and basic web pages
*
* Copyright Peter Whitehead @2018 to 2020
*
* Licensed under Apache-2.0
*/

'use strict';

let express = require('express');
let router = express.Router(null);
let page = require('../controllers/pages');


router.get('/', page.index);
router.get('/about', page.about);

//router.get('/favicon.ico', function(req, res){res.status(204)});

module.exports = router;
