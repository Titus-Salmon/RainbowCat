var express = require('express');
var router = express.Router();

var mysql = require('mysql')
// var connection = mysql.createConnection({ //old - from local db setup
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'catRelTrkr'
// });

const connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL);
connection.connect();

/* GET db-input page. */
router.get('/', function (req, res, next) {
  res.render('vw-editEntryPassport', {
    title: 'Edit Entry'
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
  let formInput9 = Object.values(postBody)[9].replace("'", "''"); //the .replace() portion enables you to enter single quotes
  //into input fields & mysql won't reject it. Why you have to replace with "''" instead of "\'" isn't exactly clear
  console.log('formInput8(from dbinput)==>', formInput8);

  connection.query("UPDATE rainbowcat SET vendorName = " + "'" + formInput1 + "', " + "ediName = " + "'" + formInput2 + "', " +
    "issueDate = " + "'" + formInput3 + "', " + "needNewCat = " + "'" + formInput4 + "', " + "updatedWLatest = " + "'" + formInput5 + "', " +
    "reporter =" + "'" + formInput6 + "', " + "comments = " + "'" + formInput7 + "', " + "andrea = " + "'" + formInput8 + "', " + "vendorEmail = " + "'" + formInput9 + "'" + " WHERE prim_key = " + formInput0 + ";",
    function (err, rows, fields) {
      if (err) throw err

      console.log('rows==>', rows);
      console.log('fields==>', fields);
    });

  res.render('vw-dbEditPassport', {
    title: 'Search & Edit Catalog Tracker Database'
  });

  //connection.end()
});


module.exports = router;