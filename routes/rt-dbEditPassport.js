const express = require('express')
const router = express.Router()
const fs = require('fs')
const {
  ensureAuthenticated
} = require('../config/auth-t0dt1tz1')

const mysql = require('mysql')

// const connection = mysql.createConnection({
//   host: process.env.LOCAL_JAWSDBMARIA_HOST,
//   user: process.env.LOCAL_JAWSDBMARIA_USERNAME,
//   password: process.env.LOCAL_JAWSDBMARIA_PW,
//   database: process.env.LOCAL_JAWSDBMARIA_DATABASE
// });

const connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL)

connection.connect()

/* GET dbEditPassport page. */
// router.get('/', function (req, res, next) {
//   res.render('vw-dbEditPassport', {
//     title: 'Edit Catalog Tracker Database'
//   })
// })

router.get('/', ensureAuthenticated, function (req, res, next) {

  let TITUS_ADMIN_EMAIL = process.env.TITUS_ADMIN_EMAIL
  console.log(`TITUS_ADMIN_EMAIL==> ${TITUS_ADMIN_EMAIL}`)

  res.render('vw-dbEditPassport', {
    title: 'Search & Edit Catalog Tracker Database',
    username: req.user.name,
    userEmail: req.user.email,
    userEmail_stringified: JSON.stringify(req.user.email),
    TITUS_ADMIN_EMAIL: TITUS_ADMIN_EMAIL,
    ANDREA_ADMIN_EMAIL: process.env.ANDREA_ADMIN_EMAIL,
  })
})

let searchResultsForCSV = []
console.log('searchResultsForCSV from top level', searchResultsForCSV)
let csvContainer = []
console.log('csvContainer from top level', csvContainer)

router.post('/results', (req, res, next) => { //take POST request data from dbEditPassport page & put into database table

  let searchResults = [] //clear searchResults from previous search
  console.log('searchResults from router.post level===>', searchResults)
  searchResultsForCSV = []
  console.log('searchResultsForCSV from router.post level===>', searchResultsForCSV)
  csvContainer = []
  console.log('csvContainer from router.post level===>', csvContainer)

  function showSearchResults(rows) {
    for (let i = 0; i < rows.length; i++) { //add searched-for table entries from db to searchResults array
      let srcRsObj = {}
      srcRsObj['lineNumber'] = i + 1
      srcRsObj['P_K'] = rows[i]['prim_key']
      srcRsObj['Vendor'] = rows[i]['vendorName']
      srcRsObj['EDI'] = rows[i]['ediName']
      srcRsObj['IssDt'] = rows[i]['issueDate']
      srcRsObj['NdNw'] = rows[i]['needNewCat']
      srcRsObj['Updtd'] = rows[i]['updatedWLatest']
      srcRsObj['Cmnts1'] = rows[i]['comments1']
      srcRsObj['Cmnts2'] = rows[i]['comments2']
      srcRsObj['Cmnts3'] = rows[i]['comments3']
      srcRsObj['Andr'] = rows[i]['andrea']
      srcRsObj['Nathan'] = rows[i]['nathan']
      srcRsObj['vndemail'] = rows[i]['vendorEmail']
      srcRsObj['wellMarg'] = rows[i]['wellnessMargins']
      srcRsObj['ongDisco'] = rows[i]['ongDisco']
      srcRsObj['EA_Num_divide'] = rows[i]['EA_Num_divide']
      srcRsObj['CS_Num_divide'] = rows[i]['CS_Num_divide']
      srcRsObj['special1'] = rows[i]['special1']
      srcRsObj['disco_appld_to'] = rows[i]['disco_appld_to']
      srcRsObj['sales_method'] = rows[i]['sales_method']
      srcRsObj['min_order'] = rows[i]['min_order']
      srcRsObj['edlp'] = rows[i]['edlp']
      srcRsObj['order_qty'] = rows[i]['order_qty']
      //console.log(rows[i]['issueDate'])
      searchResults.push(srcRsObj)
      searchResultsForCSV.push(srcRsObj)
      console.log('srcRsObj==>', srcRsObj)
    }
    console.log('searchResults from showSearchResults()==>', searchResults)
    console.log('searchResultsForCSV from showSearchResults()==>', searchResultsForCSV)


  }

  const postBody = req.body
  //console.log('postBody==>', postBody)
  let formInput0 = Object.values(postBody)[0] //prKyPost
  let formInput1 = Object.values(postBody)[1] //vndNmPost
  let formInput2 = Object.values(postBody)[2] //ediNmPost
  let formInput3 = Object.values(postBody)[3] //issuDtPost
  let formInput4 = Object.values(postBody)[4] //ndNwCtPost
  let formInput5 = Object.values(postBody)[5] //updtwLtstPost
  let formInput6 = Object.values(postBody)[6] //cmnt1Post
  let formInput7 = Object.values(postBody)[7] //cmnt2Post
  let formInput8 = Object.values(postBody)[8] //cmnt3Post
  let formInput9 = Object.values(postBody)[9] //andrPost
  let formInput10 = Object.values(postBody)[10] //nathanPost
  console.log('formInput0(from dbEditPassport)==>', formInput0)
  console.log('formInput1(from dbEditPassport)==>', formInput1)
  console.log('formInput2(from dbEditPassport)==>', formInput2)
  console.log('formInput3(from dbEditPassport)==>', formInput3)
  console.log('formInput4(from dbEditPassport)==>', formInput4)
  console.log('formInput5(from dbEditPassport)==>', formInput5)
  console.log('formInput6(from dbEditPassport)==>', formInput6)
  console.log('formInput7(from dbEditPassport)==>', formInput7)
  console.log('formInput8(from dbEditPassport)==>', formInput8)
  console.log('formInput9(from dbEditPassport)==>', formInput9)
  console.log('formInput10(from dbEditPassport)==>', formInput10)


  if (formInput1 == '' && formInput2 == '' && formInput3 == '' && formInput4 == '' && formInput5 == '' && formInput6 == '' && formInput7 == '' &&
    formInput8 == '' && formInput9 == '' && formInput10 == '') { //return all table entries if search string is empty
    connection.query(`SELECT * FROM rainbowcat ORDER BY vendorName ASC;`, function (err, rows, fields) {
      if (err) throw err
      showSearchResults(rows)

      res.render('vw-dbEditPassport', { //render searchResults to vw-dbEditPassport page
        title: 'Edit Catalog Tracker Database',
        searchResRows: searchResults,
      })
    })
  } else { // if no records found, render vw-noRecords page
    if (formInput0 !== undefined && formInput1 !== undefined && formInput2 !== undefined && formInput3 !== undefined && formInput4 !== undefined &&
      formInput5 !== undefined && formInput6 !== undefined && formInput7 !== undefined && formInput8 !== undefined && formInput9 !== undefined &&
      formInput10 !== undefined) {
      connection.query(`SELECT * FROM rainbowcat WHERE vendorName LIKE '${formInput1}%' AND ediName LIKE '${formInput2}%'
       AND issueDate LIKE '${formInput3}%' AND needNewCat LIKE '${formInput4}%' AND updatedWLatest LIKE '${formInput5}%' 
       AND comments1 LIKE '${formInput6}%' AND comments2 LIKE '${formInput7}%' AND comments3 LIKE '${formInput8}%' 
       AND andrea LIKE '${formInput9}%' AND nathan LIKE '${formInput10}%' ORDER BY vendorName ASC;`,
        function (err, rows, fields) {
          if (err) throw err
          // console.log('rows==>', rows)
          // console.log('rows.length==>', rows.length)
          if (rows.length <= 0) {
            console.log('NO RECORDS FOUND')
            res.render('vw-noRecords', {
              title: 'no results',
            })
          } else { //if records found for search string entered, add them to searchResults
            showSearchResults(rows)

            res.render('vw-dbEditPassport', { //render searchResults to vw-dbEditPassport page
              title: 'Edit Catalog Tracker Database',
              searchResRows: searchResults,
            })
          }
        })
    }
  }
})

router.post('/saveCSV', (req, res, next) => {
  console.log('/saveCSV preliminarily working')
  console.log('req.body==>', req.body)
  console.log('req.body[\'csvPost\']', req.body['csvPost'])

  //begin csv generator //////////////////////////////////////////////////////////////////////////
  const {
    Parser
  } = require('json2csv')

  const fields = ['P_K', 'Vendor', 'EDI', 'IssDt', 'NdNw', 'Updtd', 'Cmnts1', 'Cmnts2', 'Cmnts3', 'Andr', 'Nathan',
    'vndemail', 'wellMarg', 'ongDisco'
  ]
  const opts = {
    fields
  }

  try {
    console.log('searchResultsForCSV from json2csv======>>', searchResultsForCSV)
    const parser = new Parser(opts)
    const csv = parser.parse(searchResultsForCSV)
    csvContainer.push(csv)
    console.log('csv_T0d=====>>', csv)
    fs.writeFile('../catrt/public/csv/' + req.body['csvPost'] + '.csv', csv, function (err) {
      if (err) throw err
      console.log('~~~~~>>' + req.body['csvPost'] + 'saved<<~~~~~')
    })
    // searchResultsForCSV = [] //clear searchResultsForCSV so it doesn't hold previous data on next csv generation
    // csvContainer = [] //clear csvContainer so it doesn't hold previous data on next csv generation
  } catch (err) {
    console.error(err)
  }
  //end csv generator //////////////////////////////////////////////////////////////////////////

  res.render('vw-csvSaved', { //render searchResults to vw-dbEditPassport page
    title: 'CSV Saved'
  })
})

router.post('/deleteSelection', (req, res, next) => { //take POST request data from vw-dbEditPassport page & delete from database table
  const postBody = req.body
  console.log('postBody', postBody)
  let delInput0 = postBody[0]
  let delInput1 = postBody[1]
  let delInput2 = postBody[2]
  let delInput3 = postBody[3]
  let delInput4 = postBody[4]
  let delInput5 = postBody[5]
  let delInput6 = postBody[6]
  let delInput7 = postBody[7]
  console.log('delInput0(from dbinput)==>', delInput0)


  connection.query("DELETE FROM rainbowcat WHERE prim_key = " + delInput0 + "",
    function (err, rows, fields) {
      if (err) throw err

      console.log('rows==>', rows)
      console.log('fields==>', fields)
    })
})

module.exports = router