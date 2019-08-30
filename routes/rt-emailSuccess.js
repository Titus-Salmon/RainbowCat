var express = require('express');
var router = express.Router();
var fs = require('fs');

const nodemailer = require('nodemailer');

var mysql = require('mysql')
var connection = mysql.createConnection({ //old - from local db setup
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'catRelTrkr'
});

// const connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL);
// connection.connect();

/* GET autoEmail page. */
router.get('/', function (req, res, next) {
  res.render('vw-emailSuccess', {
    title: 'Successful Auto-Email',
    // emailResRows: successfulEmailArray
  });
});

module.exports = router;