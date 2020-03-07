var express = require('express');
var router = express.Router(null);
var page = require('../controllers/pages');

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

router.get('/', page.index);
router.get('/about', page.about);

//router.get('/favicon.ico', function(req, res){res.status(204)});

module.exports = router;
