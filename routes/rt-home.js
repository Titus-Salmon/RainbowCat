var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('vw-home', { title: 'Catalog Tracker App' });
});

module.exports = router;
