var express = require('express');
var router = express.Router();
var fs = require('fs');

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
  res.render('vw-dbEditAndrea', {
    title: 'Edit Catalog Tracker Database'
  });
});

let searchResultsForCSV = [];
console.log('searchResultsForCSV from top level', searchResultsForCSV)
let csvContainer = [];
console.log('csvContainer from top level', csvContainer)

router.post('/results', (req, res, next) => { //take POST request data from dbEditAndrea page & put into database table

  let searchResults = []; //clear searchResults from previous search
  console.log('searchResults from router.post level===>', searchResults)
  searchResultsForCSV = [];
  console.log('searchResultsForCSV from router.post level===>', searchResultsForCSV)
  csvContainer = [];
  console.log('csvContainer from router.post level===>', csvContainer)

  function showSearchResults(rows) {
    for (let i = 0; i < rows.length; i++) { //add searched-for table entries from db to searchResults array
      let srcRsObj = {};
      srcRsObj['P_K'] = rows[i]['prim_key'];
      srcRsObj['Vendor'] = rows[i]['vendorName'];
      srcRsObj['EDI'] = rows[i]['ediName'];
      srcRsObj['IssDt'] = rows[i]['issueDate'];
      srcRsObj['NdNw'] = rows[i]['needNewCat'];
      srcRsObj['Updtd'] = rows[i]['updatedWLatest'];
      srcRsObj['Rep'] = rows[i]['reporter'];
      srcRsObj['Cmnts'] = rows[i]['comments'];
      srcRsObj['Andr'] = rows[i]['andrea'];
      //console.log(rows[i]['issueDate'])
      searchResults.push(srcRsObj);
      searchResultsForCSV.push(srcRsObj);
      console.log('srcRsObj==>', srcRsObj)
    }
    console.log('searchResults from showSearchResults()==>', searchResults)
    console.log('searchResultsForCSV from showSearchResults()==>', searchResultsForCSV)


  }

  const postBody = req.body;
  //console.log('postBody==>', postBody);
  let formInput0 = Object.values(postBody)[0];
  let formInput1 = Object.values(postBody)[1];
  let formInput2 = Object.values(postBody)[2];
  let formInput3 = Object.values(postBody)[3];
  let formInput4 = Object.values(postBody)[4];
  let formInput5 = Object.values(postBody)[5];
  let formInput6 = Object.values(postBody)[6];
  let formInput7 = Object.values(postBody)[7];
  let formInput8 = Object.values(postBody)[8];
  console.log('formInput0(from dbEditAndrea)==>', formInput0);
  console.log('formInput1(from dbEditAndrea)==>', formInput1);
  console.log('formInput2(from dbEditAndrea)==>', formInput2);
  console.log('formInput3(from dbEditAndrea)==>', formInput3);
  console.log('formInput4(from dbEditAndrea)==>', formInput4);
  console.log('formInput5(from dbEditAndrea)==>', formInput5);
  console.log('formInput6(from dbEditAndrea)==>', formInput6);
  console.log('formInput7(from dbEditAndrea)==>', formInput7);
  console.log('formInput8(from dbEditAndrea)==>', formInput8);


  if (formInput1 == '' && formInput2 == '' && formInput3 == '' && formInput4 == '' &&
    formInput5 == '' && formInput6 == '' && formInput7 == '' && formInput8 == '') { //return all table entries if search string is empty
    connection.query("SELECT * FROM rainbowcat", function (err, rows, fields) {
      if (err) throw err;
      showSearchResults(rows);

      res.render('vw-dbEditAndrea', { //render searchResults to vw-dbEditAndrea page
        title: 'Edit Catalog Tracker Database',
        searchResRows: searchResults,
      });
    })
  } else { // if no records found, render vw-noRecords page
    if (formInput0 !== undefined && formInput1 !== undefined && formInput2 !== undefined &&
      formInput3 !== undefined && formInput4 !== undefined && formInput5 !== undefined &&
      formInput6 !== undefined && formInput7 !== undefined && formInput8 !== undefined) {
      connection.query("SELECT * FROM rainbowcat WHERE vendorName LIKE " + "'" + formInput1 + "%" + "'" +
        " AND ediName LIKE " + "'" + formInput2 + "%" + "'" +
        " AND issueDate LIKE " + "'" + formInput3 + "%" + "'" +
        " AND needNewCat LIKE " + "'" + formInput4 + "%" + "'" +
        " AND updatedWLatest LIKE " + "'" + formInput5 + "%" + "'" +
        " AND reporter LIKE " + "'" + formInput6 + "%" + "'" +
        " AND comments LIKE " + "'" + formInput7 + "%" + "'" +
        " AND andrea LIKE " + "'" + formInput8 + "%" + "'",
        function (err, rows, fields) {
          if (err) throw err;
          // console.log('rows==>', rows);
          // console.log('rows.length==>', rows.length);
          if (rows.length <= 0) {
            console.log('NO RECORDS FOUND');
            res.render('vw-noRecords', {
              title: 'no results',
            });
          } else { //if records found for search string entered, add them to searchResults
            showSearchResults(rows);

            res.render('vw-dbEditAndrea', { //render searchResults to vw-dbEditAndrea page
              title: 'Edit Catalog Tracker Database',
              searchResRows: searchResults,
            });
          }
        })
    }
  }
});

router.post('/saveCSV', (req, res, next) => {
  console.log('/saveCSV preliminarily working')
  console.log('req.body==>', req.body)
  console.log('req.body[\'csvPost\']', req.body['csvPost'])

  //begin csv generator //////////////////////////////////////////////////////////////////////////
  const {
    Parser
  } = require('json2csv');

  const fields = ['P_K', 'Vendor', 'EDI', 'IssDt', 'NdNw', 'Updtd', 'Rep', 'Cmnts', 'Andr'];
  const opts = {
    fields
  };

  try {
    console.log('searchResultsForCSV from json2csv======>>', searchResultsForCSV)
    const parser = new Parser(opts);
    const csv = parser.parse(searchResultsForCSV);
    csvContainer.push(csv);
    console.log('csv_T0d=====>>', csv);
    fs.writeFile('C:/MyERN-t0d/catalog-release-tracker/catRT/public/csv/' + req.body['csvPost'] + '.csv', csv, function (err) {
      if (err) throw err;
      console.log('~~~~~>>' + req.body['csvPost'] + 'saved<<~~~~~')
    })
    // searchResultsForCSV = []; //clear searchResultsForCSV so it doesn't hold previous data on next csv generation
    // csvContainer = []; //clear csvContainer so it doesn't hold previous data on next csv generation
  } catch (err) {
    console.error(err);
  }
  //end csv generator //////////////////////////////////////////////////////////////////////////

  res.render('vw-csvSaved', { //render searchResults to vw-dbEditAndrea page
    title: 'CSV Saved'
  });
})

router.post('/deleteSelection', (req, res, next) => { //take POST request data from vw-dbEditAndrea page & delete from database table
  const postBody = req.body;
  console.log('postBody', postBody);
  let delInput0 = postBody[0];
  let delInput1 = postBody[1];
  let delInput2 = postBody[2];
  let delInput3 = postBody[3];
  let delInput4 = postBody[4];
  let delInput5 = postBody[5];
  let delInput6 = postBody[6];
  let delInput7 = postBody[7];
  console.log('delInput0(from dbinput)==>', delInput0);


  connection.query("DELETE FROM rainbowcat WHERE prim_key = " + delInput0 + ";",
    function (err, rows, fields) {
      if (err) throw err

      console.log('rows==>', rows);
      console.log('fields==>', fields);
    });
});

module.exports = router;