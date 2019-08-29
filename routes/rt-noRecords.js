var express = require('express');
var router = express.Router();

/* GET db-input page. */
router.get('/', function (req, res, next) {
    res.render('vw-noRecords', {
        title: 'NO RECORDS FOUND'
    });

    //res.redirect('/vw-home')
});

module.exports = router;