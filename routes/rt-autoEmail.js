var express = require('express');
var router = express.Router();
var fs = require('fs');

const nodemailer = require('nodemailer');

var mysql = require('mysql')
// var connection = mysql.createConnection({ //old - from local db setup
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'catRelTrkr'
// });

const connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL);
connection.connect();

/* GET autoEmail page. */
router.get('/', function (req, res, next) {
  res.render('vw-autoEmail', {
    title: 'Auto Email Interface'
  });
});

let searchResultsForCSV = [];
console.log('searchResultsForCSV from top level', searchResultsForCSV)
let csvContainer = [];
console.log('csvContainer from top level', csvContainer)

router.post('/results', (req, res, next) => { //take POST request data from vw-autoEmail page & put into database table

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
      srcRsObj['vndemail'] = rows[i]['vendorEmail'];

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
  console.log('formInput0(from autoEmail)==>', formInput0);
  console.log('formInput1(from autoEmail)==>', formInput1);
  console.log('formInput2(from autoEmail)==>', formInput2);
  console.log('formInput3(from autoEmail)==>', formInput3);
  console.log('formInput4(from autoEmail)==>', formInput4);
  console.log('formInput5(from autoEmail)==>', formInput5);
  console.log('formInput6(from autoEmail)==>', formInput6);
  console.log('formInput7(from autoEmail)==>', formInput7);
  console.log('formInput8(from autoEmail)==>', formInput8);


  if (formInput1 == '' && formInput2 == '' && formInput3 == '' && formInput4 == '' &&
    formInput5 == '' && formInput6 == '' && formInput7 == '' && formInput8 == '') { //return all table entries if search string is empty
    connection.query("SELECT * FROM rainbowcat", function (err, rows, fields) {
      if (err) throw err;
      showSearchResults(rows);

      res.render('vw-autoEmail', { //render searchResults to vw-autoEmail page
        title: 'Auto Email Search Results',
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

            res.render('vw-autoEmail', { //render searchResults to vw-autoEmail page
              title: 'Auto Email Search Results',
              searchResRows: searchResults,
            });
          }
        })
    }
  }
});

router.post('/formPost', (req, res, next) => { // take post results from /formPost (vendor name array & email recipient array)
  console.log('req.body==>', req.body)
  console.log('req.body[\'vndNmPost\']==>', req.body['vndNmPost'])
  console.log('req.body[\'vndNmPost\'].split(', ')==>', req.body['vndNmPost'].split(','))
  console.log('req.body[\'vndEmailPost\'].split(', ')==>', req.body['vndEmailPost'].split(','))
  console.log('req.headers==>', req.headers)


  let autoEmailVendorNameArray = req.body['vndNmPost'].split(',');
  let autoEmailVendorEmailArray = req.body['vndEmailPost'].split(',');
  let senderEmailInput = req.body['senderEmailPost'];
  let senderEmailPWInput = req.body['senderEmailPWPost'];

  let successfulEmailArray = [];
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {

    for (let i = 0; i < autoEmailVendorNameArray.length; i++) {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        maxConnections: 3, //<-----------ADD THIS LINE
        pool: true, //<-----------ADD THIS LINE
        host: 'smtp.office365.com',
        port: 587,
        // host: 'smtp.ethereal.email',
        // port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          // user: 'your.email@provider.com',
          // pass: 'yourpassword!',
          user: senderEmailInput,
          pass: senderEmailPWInput
        },
        maxMessages: 100,
        socketTimeout: 1000 * 60 * 60, //1 hour
        logger: true,
        // debug: true
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        headers: {
          'Vendor': autoEmailVendorEmailArray[i]
        },
        // from: 'your.email@provider.com', // sender address
        from: senderEmailInput, // sender address
        to: {
          name: autoEmailVendorNameArray[i],
          address: autoEmailVendorEmailArray[i]
        },
        bcc: {
          name: 'titus',
          address: 'titus.salmon@rainbowblossom.com'
        }, // list of receivers
        subject: autoEmailVendorNameArray[i] + ' catalog update request', // Subject line
        // text: `Hello friends!\n\n Our records indicate that the latest ` + autoEmailVendorNameArray[i] + ` catalog we have is 6 or more months old.
        //  Can you please send us your latest catalog (in Excel format), if you have anything more recent? Thanks!`, // plain text body
        html: `<div class="_3U2q6dcdZCrTrR_42Nxby JWNdg1hee9_Rz6bIGvG1c allowTextSelection"><div><style type="text/css" style="display:none">
        <!--
        .rps_f500 p
          {margin-top:0;
          margin-bottom:0}
        -->
        </style>
        <div class="rps_f500">
        <div dir="ltr">
        <div id="x_divtagdefaultwrapper" dir="ltr" style="font-size:12pt; color:rgb(0,0,0); font-family:Calibri,Helvetica,sans-serif,EmojiFont,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;,NotoColorEmoji,&quot;Segoe UI Symbol&quot;,&quot;Android Emoji&quot;,EmojiSymbols">
        <p style="margin-top:0; margin-bottom:0">Hello, friends!</p>
        <p style="margin-top:0; margin-bottom:0"><br>
        </p>
        <p style="margin-top:0; margin-bottom:0">Our records indicate that the latest ` + autoEmailVendorNameArray[i] +
          ` catalog we have is 6 or more months old. Can you please send us your latest catalog (in Excel format), if you have anything more recent?</p>
        <p style="margin-top:0; margin-bottom:0"><br>
        </p>
        <p style="margin-top:0; margin-bottom:0">Thanks!</p>
        <p style="margin-top:0; margin-bottom:0"><br>
        </p>
      
        <div id="x_Signature">
        <div id="x_divtagdefaultwrapper" dir="ltr" style="font-size:12pt">
        <p style="color:rgb(0,0,0); font-family:Calibri,Arial,Helvetica,sans-serif"><span style="font-size:12pt"><span style="font-family:Constantia,&quot;Hoefler Text&quot;,serif">Love, Light and Gratitude,&nbsp;</span></span><br>
        <span style="font-family:Constantia,&quot;Hoefler Text&quot;,serif"></span></p>
        <span style="font-family:Constantia,&quot;Hoefler Text&quot;,serif"></span>
        <p style="color:rgb(0,0,0); font-family:Calibri,Arial,Helvetica,sans-serif"><span style="font-size:12pt"><span style="font-family:Constantia,&quot;Hoefler Text&quot;,serif">Andrea McGrath</span></span></p>
        <span style="font-family:Constantia,&quot;Hoefler Text&quot;,serif"></span>
        <p style="color:rgb(0,0,0); font-family:Calibri,Arial,Helvetica,sans-serif"><span style="font-size:12pt"><span style="font-family:Constantia,&quot;Hoefler Text&quot;,serif">Wellness Category Manager</span></span></p>
        <span style="font-family:Constantia,&quot;Hoefler Text&quot;,serif"></span>
        <p style="color:rgb(0,0,0); font-family:Calibri,Arial,Helvetica,sans-serif"><span style="font-size:12pt"><span style="font-family:Constantia,&quot;Hoefler Text&quot;,serif">andrea.mcgrath@rainbowblossom.com</span></span></p>
        <span style="font-family:Constantia,&quot;Hoefler Text&quot;,serif"></span>
        <p style=""><font color="#4ba524" face="Constantia, serif" data-event-added="1"><span style="font-family:Constantia,&quot;Hoefler Text&quot;,serif"><span data-markjs="true" class="_2HwZTce1zKwQJyzgqXpmAy" tabindex="0" role="link">3738 Lexington Rd</span></span></font></p>
        <p style=""><font color="#4ba524" face="Constantia, serif" data-event-added="1"><span style="font-family:Constantia,&quot;Hoefler Text&quot;,serif"><span data-markjs="true" class="_2HwZTce1zKwQJyzgqXpmAy" tabindex="0" role="link">Louisville, KY 40207</span></span></font></p>
        <p style=""><font color="#4ba524" face="Constantia, serif"><span style="font-family:Constantia,&quot;Hoefler Text&quot;,serif">Phone: 502.</span><span style="font-family:Constantia,&quot;Hoefler Text&quot;,serif">498.2348</span><span style="font-family:Constantia,&quot;Hoefler Text&quot;,serif">&nbsp;
         Fax: 502.618.4124</span></font></p>
        <p style="color:rgb(0,0,0); font-family:Calibri,Arial,Helvetica,sans-serif"><span style="font-size:12pt"><span style="font-family:Constantia,serif"><span style="color:rgb(75,165,36)"></span></span></span></p>
        <p style="color:rgb(0,0,0); font-family:Calibri,Arial,Helvetica,sans-serif"><img data-imagetype="AttachmentByCid" originalsrc="cid:1c6c0c3e-7d2c-4dce-bc9a-a58a0faebf9e" data-custom="AAMkAGM1ZGU4MjczLWIwZDYtNGRhMi1iMmYzLWUxZmRlNmI4MWY3ZQBGAAAAAAAzaHnGLjXSQJHLXLMdffw9BwBfXz8uTm%2BIT7ZCQLTVuVW7AAAAAAEMAABfXz8uTm%2BIT7ZCQLTVuVW7AAAYkbxmAAABEgAQAPiPpnxKlhRGhAfHLyx7EkU%3D" naturalheight="86" naturalwidth="314" src="https://attachments.office.net/owa/Titus.Salmon@rainbowblossom.com/service.svc/s/GetAttachmentThumbnail?id=AAMkAGM1ZGU4MjczLWIwZDYtNGRhMi1iMmYzLWUxZmRlNmI4MWY3ZQBGAAAAAAAzaHnGLjXSQJHLXLMdffw9BwBfXz8uTm%2BIT7ZCQLTVuVW7AAAAAAEMAABfXz8uTm%2BIT7ZCQLTVuVW7AAAYkbxmAAABEgAQAPiPpnxKlhRGhAfHLyx7EkU%3D&amp;thumbnailType=2&amp;owa=outlook.office.com&amp;scriptVer=2019081802.10&amp;X-OWA-CANARY=Kw8j9rLe8EO0kgxSLi5J3gAOhPrLK9cYn6LcWXLqiLD4JBtnfXcqhOX6drk_zIMonHg-WWO5No4.&amp;token=eyJhbGciOiJSUzI1NiIsImtpZCI6IjA2MDBGOUY2NzQ2MjA3MzdFNzM0MDRFMjg3QzQ1QTgxOENCN0NFQjgiLCJ4NXQiOiJCZ0Q1OW5SaUJ6Zm5OQVRpaDhSYWdZeTN6cmciLCJ0eXAiOiJKV1QifQ.eyJvcmlnaW4iOiJodHRwczovL291dGxvb2sub2ZmaWNlLmNvbSIsInZlciI6IkV4Y2hhbmdlLkNhbGxiYWNrLlYxIiwiYXBwY3R4c2VuZGVyIjoiT3dhRG93bmxvYWRAMjc0Mzc5N2YtOTM2Zi00NzYzLTk1NjYtMjE4N2QwMzI0OWFjIiwiYXBwY3R4Ijoie1wibXNleGNocHJvdFwiOlwib3dhXCIsXCJwcmltYXJ5c2lkXCI6XCJTLTEtNS0yMS01NzYzNjMwODktMjM4MjQ0NTUxMC0yMjI1NzA5ODItMjgzMzQ4NDZcIixcInB1aWRcIjpcIjExNTM4MDExMTUyNDM4OTMyOTFcIixcIm9pZFwiOlwiNDllMjAzY2EtOGQ5OC00M2Q2LWI1NzEtNTc2MjA4Yjk5YWNmXCIsXCJzY29wZVwiOlwiT3dhRG93bmxvYWRcIn0iLCJuYmYiOjE1NjcwMDU4OTQsImV4cCI6MTU2NzAwNjQ5NCwiaXNzIjoiMDAwMDAwMDItMDAwMC0wZmYxLWNlMDAtMDAwMDAwMDAwMDAwQDI3NDM3OTdmLTkzNmYtNDc2My05NTY2LTIxODdkMDMyNDlhYyIsImF1ZCI6IjAwMDAwMDAyLTAwMDAtMGZmMS1jZTAwLTAwMDAwMDAwMDAwMC9hdHRhY2htZW50cy5vZmZpY2UubmV0QDI3NDM3OTdmLTkzNmYtNDc2My05NTY2LTIxODdkMDMyNDlhYyJ9.S8PPDLig-AAKNMbtBa7fDSps6eEpcs9PaVab8XHYFxVP83LzbWgaJ_DZzH1nOXydL6oGL-rHWwECKetuRqnyzhIVfxXtPiY00zHlQ7K18ibruWeFWsu1agAepfU6p6_rgbz9ELK8fXippHMYWdQjVwBaWGESUKkA532ZVacewswzITqwbQa38XWK2Jji3MKTuP2zK841fLXZ5-cGx-wz6malerXfne2ydeaKqdcnarf2SI4s9zqKkBVfHhfvdBIEKvTOyvn-uHsB_dXD8s-CwcAl_JVRPYKZV87rW0P1lza5KdQ2E-67JfMfgizudJhajh60-moO_ClT0J4DwtVQnw&amp;animation=true" class="x_EmojiInsert" alt="1488907293225_PastedImage" data-outlook-trace="F:1|T:1" style="cursor: pointer; max-width: 100%; height: auto;" crossorigin="use-credentials"><br>
        </p>
        <p style="color:rgb(0,0,0); font-family:Calibri,Arial,Helvetica,sans-serif"><span style="font-family:Constantia,serif">#therainbowway &nbsp;#keeplouisvilleweird&nbsp; &nbsp;#buylocal</span><br>
        </p>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div></div>` // html body
      });

      console.log('info==>', info)
      console.log('info[\'rejected\'].length==>', info['rejected'].length)

      function populateSentVendors() { //if email successfully sent, this will push that particular vendor name into the
        //successfulEmailArray array
        if (info['rejected'].length <= 0) {
          successfulEmailArray.push(autoEmailVendorNameArray[i]);
        }
      }
      populateSentVendors();

      function updateDBAfterEmailing() { //this will put a comment in the db for each successfully sent email, that will
        //cause that entry to no longer be displayed as a catalog in need of updating
        for (let i = 0; i < successfulEmailArray.length; i++) {
          connection.query("UPDATE rainbowcat SET comments = 'requested cat (auto-email)' WHERE vendorName = '" +
            successfulEmailArray[i] + "';")
        }
      }
      updateDBAfterEmailing();

    }

  }
  main().then(function () { //.then() method used with async functions; waits until after async function complete, THEN do something
    res.redirect('/emailSuccess');
  }).catch(console.error);

})



module.exports = router;