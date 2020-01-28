var express = require('express');
var router = express.Router();

const {
  ensureAuthenticated
} = require('../config/auth-t0dt1tz1');

var mysql = require('mysql')

// const connection = mysql.createConnection({
//   host: process.env.LOCAL_JAWSDBMARIA_HOST,
//   user: process.env.LOCAL_JAWSDBMARIA_USERNAME,
//   password: process.env.LOCAL_JAWSDBMARIA_PW,
//   database: process.env.LOCAL_JAWSDBMARIA_DATABASE
// });

const connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL);

connection.connect();

/* GET db-input page. */
router.get('/', ensureAuthenticated, function (req, res, next) {
  res.render('vw-editEntryPassport', {
    title: 'Edit Entry',
    username: req.user.name,
    userEmail: req.user.email,
    userEmail_stringified: JSON.stringify(req.user.email),
  });
});

router.post('/formPost', (req, res, next) => { //take POST request data from db-input page & put into database table
  const postBody = req.body;
  console.log('postBody', postBody);
  let formInput0 = Object.values(postBody)[0];
  let formInput1 = Object.values(postBody)[1].replace("'", "''");
  let formInput2 = Object.values(postBody)[2].replace("'", "''");
  let formInput3 = Object.values(postBody)[3].replace("'", "''");
  let formInput4 = Object.values(postBody)[4].replace("'", "''");
  let formInput5 = Object.values(postBody)[5].replace("'", "''");
  let formInput6 = Object.values(postBody)[6].replace("'", "''");
  let formInput7 = Object.values(postBody)[7].replace("'", "''");
  let formInput8 = Object.values(postBody)[8].replace("'", "''");
  let formInput9 = Object.values(postBody)[9].replace("'", "''");
  let formInput10 = Object.values(postBody)[10].replace("'", "''");
  let formInput11 = Object.values(postBody)[11].replace("'", "''"); //the .replace() portion enables you to enter single quotes
  //into input fields & mysql won't reject it. Why you have to replace with "''" instead of "\'" isn't exactly clear
  console.log('formInput8(from dbinput)==>', formInput8);

  connection.query(`UPDATE rainbowcat SET vendorName = '${formInput1}', ediName = '${formInput2}', issueDate = '${formInput3}', 
  needNewCat = '${formInput4}', updatedWLatest = '${formInput5}', comments1 = '${formInput6}', comments2 = '${formInput7}', 
  comments3 = '${formInput8}', andrea = '${formInput9}', nathan = '${formInput10}', vendorEmail = '${formInput11}' 
  WHERE prim_key = '${formInput0}';`,
    function (err, rows, fields) {
      if (err) throw err

      // console.log('rows==>', rows);
      // console.log('fields==>', fields);
    });

  res.render('vw-dbEditPassport', {
    title: 'Search & Edit Catalog Tracker Database'
  });

  //connection.end()
});


module.exports = router;