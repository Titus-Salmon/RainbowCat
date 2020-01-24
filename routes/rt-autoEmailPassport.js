var express = require('express');
var router = express.Router();
var fs = require('fs');
const {
  ensureAuthenticated
} = require('../config/auth-t0dt1tz1');

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
router.get('/', ensureAuthenticated, function (req, res, next) {
  res.render('vw-autoEmailPassport', {
    title: 'Auto Email Interface',
    username: req.user.name,
    userEmail: req.user.email,
    userEmail_stringified: JSON.stringify(req.user.email),
  });
});

let searchResultsForCSV = [];
// console.log('searchResultsForCSV from top level', searchResultsForCSV)
let csvContainer = [];
// console.log('csvContainer from top level', csvContainer)

router.post('/results', (req, res, next) => { //take POST request data from vw-autoEmail page & put into database table

  let searchResults = []; //clear searchResults from previous search
  // console.log('searchResults from router.post level===>', searchResults)
  searchResultsForCSV = [];
  // console.log('searchResultsForCSV from router.post level===>', searchResultsForCSV)
  csvContainer = [];
  // console.log('csvContainer from router.post level===>', csvContainer)

  function showSearchResults(rows) {
    for (let i = 0; i < rows.length; i++) { //add searched-for table entries from db to searchResults array
      let srcRsObj = {};
      srcRsObj['P_K'] = rows[i]['prim_key'];
      srcRsObj['Vendor'] = rows[i]['vendorName'];
      srcRsObj['EDI'] = rows[i]['ediName'];
      srcRsObj['IssDt'] = rows[i]['issueDate'];
      srcRsObj['NdNw'] = rows[i]['needNewCat'];
      srcRsObj['Updtd'] = rows[i]['updatedWLatest'];
      srcRsObj['Cmnts1'] = rows[i]['comments1'];
      srcRsObj['Cmnts2'] = rows[i]['comments2'];
      srcRsObj['Cmnts3'] = rows[i]['comments3'];
      srcRsObj['Andr'] = rows[i]['andrea'];
      srcRsObj['Nathan'] = rows[i]['nathan'];
      srcRsObj['vndemail'] = rows[i]['vendorEmail'];
      srcRsObj['ongDisco'] = rows[i]['ongDisco']

      //console.log(rows[i]['issueDate'])
      searchResults.push(srcRsObj);
      searchResultsForCSV.push(srcRsObj);
      // console.log('srcRsObj==>', srcRsObj)
    }
    // console.log('searchResults from showSearchResults()==>', searchResults)
    // console.log('searchResultsForCSV from showSearchResults()==>', searchResultsForCSV)


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
  let formInput9 = Object.values(postBody)[9];
  console.log('formInput0(from autoEmail)==>', formInput0);
  console.log('formInput1(from autoEmail)==>', formInput1);
  console.log('formInput2(from autoEmail)==>', formInput2);
  console.log('formInput3(from autoEmail)==>', formInput3);
  console.log('formInput4(from autoEmail)==>', formInput4);
  console.log('formInput5(from autoEmail)==>', formInput5);
  console.log('formInput6(from autoEmail)==>', formInput6);
  console.log('formInput7(from autoEmail)==>', formInput7);
  console.log('formInput8(from autoEmail)==>', formInput8);
  console.log('formInput9(from autoEmail)==>', formInput9);


  if (formInput1 == '' && formInput2 == '' && formInput3 == '' && formInput4 == '' && formInput5 == '' && formInput6 == '' && formInput7 == '' &&
    formInput8 == '' && formInput9 == '') { //return all table entries if search string is empty
    connection.query(`SELECT * FROM rainbowcat ORDER BY vendorName ASC;`, function (err, rows, fields) {
      if (err) throw err;
      showSearchResults(rows);

      res.render('vw-autoEmailPassport', { //render searchResults to vw-autoEmail page
        title: 'Auto Email Search Results',
        searchResRows: searchResults,
      });
    })
  } else { // if no records found, render vw-noRecords page
    if (formInput0 !== undefined && formInput1 !== undefined && formInput2 !== undefined && formInput3 !== undefined && formInput4 !== undefined &&
      formInput5 !== undefined && formInput6 !== undefined && formInput7 !== undefined && formInput8 !== undefined && formInput9 !== undefined) {
      connection.query(`SELECT * FROM rainbowcat WHERE vendorName LIKE '${formInput1}%' AND ediName LIKE '${formInput2}%'
      AND issueDate LIKE '${formInput3}%' AND needNewCat LIKE '${formInput4}%' AND updatedWLatest LIKE '${formInput5}%' 
      AND comments1 LIKE '${formInput6}%' AND comments2 LIKE '${formInput7}%' AND comments3 LIKE '${formInput8}%' 
      AND andrea LIKE '${formInput9}%' AND nathan LIKE '${formInput10}%' ORDER BY vendorName ASC;`,
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

            res.render('vw-autoEmailPassport', { //render searchResults to vw-autoEmail page
              title: 'Auto Email Search Results',
              searchResRows: searchResults,
              // username: req.user.name,
              // userEmail: req.user.email,
              // userEmail_stringified: JSON.stringify(req.user.email),
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
          address: process.env.AUTOEMAIL_BCC_TITUS //set email address(es) that will be bcc'd in .env file
        }, // list of receivers
        subject: autoEmailVendorNameArray[i] + ' catalog update request', // Subject line
        // text: `Hello friends!\n\n Our records indicate that the latest ` + autoEmailVendorNameArray[i] + ` catalog we have is 6 or more months old.
        //  Can you please send us your latest catalog (in Excel format), if you have anything more recent? Thanks!`, // plain text body
        html: `
      <div class="_3U2q6dcdZCrTrR_42Nxby JWNdg1hee9_Rz6bIGvG1c allowTextSelection">
        <div>
          <style type="text/css" style="display:none">
            
            .rps_5010 p {
              margin-top: 0;
              margin-bottom: 0
            }
            
          </style>
          <div class="rps_5010">
            <div dir="ltr">
              <div style="font-family:Calibri,Arial,Helvetica,sans-serif; font-size:12pt; color:rgb(0,0,0)">
                <p style="font-size:11pt; font-family:Calibri,sans-serif; margin:0; line-height:115%">
                  <span
                    style="color:black; font-size:12pt; background-color:white; padding:0; border:1pt none windowtext">Hello,
                    friends!<br>
                  </span></p>
                <p style="font-size:11pt; font-family:Calibri,sans-serif; margin:0; line-height:115%">
                  <span
                    style="color:black; font-size:12pt; background-color:white; padding:0; border:1pt none windowtext"><br>
                  </span></p>
                <p
                  style="font-size:11pt; font-family:Calibri,sans-serif; background-color:white; margin:0; line-height:115%">
                  <span style="color:black; font-size:12pt">&nbsp;</span></p>
                <p
                  style="font-size:11pt; font-family:Calibri,sans-serif; background-color:white; margin:0; line-height:115%">
                  <span style="color:black; font-size:12pt">Our records indicate that the latest
                  ` + autoEmailVendorNameArray[i] +
          ` catalog we have is 6 or more months old.
                    <u>Can you please send us your latest catalog (in Excel format), if you have anything
                      more recent?
                    </u></span></p>
                <p
                  style="font-size:11pt; font-family:Calibri,sans-serif; background-color:white; margin:0; line-height:115%">
                  <span style="color:black; font-size:12pt">&nbsp;</span></p>
                <p
                  style="font-size:11pt; font-family:Calibri,sans-serif; background-color:white; margin:0; line-height:115%">
                  <span style="color:black; font-size:12pt">As part of an ongoing effort to streamline our
                    ordering process and move towards automated reordering, it would greatly help us if the
                    guidelines appended below are implemented:</span></p>
                <p
                  style="font-size:11pt; font-family:Calibri,sans-serif; background-color:white; margin:0; line-height:115%">
                  <span style="color:black; font-size:12pt">&nbsp;</span></p>
                <ol>
                  <li><span style="color:black; font-size:12pt">In order to successfully update our records
                      with your awesome products, we MUST have these 4 data fields:
                    </span><b style="font-size:12pt">UPC, SKU, Product Name, and Cost (wholesale);<br>
                      <br>
                    </b></li>
                  <li><b style="font-size:12pt">If you do not use SKU for order fulfillment</b><span
                      style="color:black; font-size:12pt">, please include a column for SKU that uses the
                      UPC number;<br>
                      <br>
                    </span></li>
                  <li><span style="color:black; font-size:12pt">Provide a <b>"unit type"</b> column to
                      indicate how each item must be ordered (i.e., "CS" or "case" versus "EA" or
                      "each");<br>
                      <br>
                    </span></li>
                  <li><span style="color:black; font-size:12pt">Provide a separate <b>"minimum order
                        quantity"</b>* column to account for any items with a "unit type" of "EA" that
                      must be ordered in multiples.</span></li>
                </ol>
                <ul style="margin-bottom:0">
                  <ul style="margin-bottom:0">
                    <li><span style="color:black; font-size:12pt">*For example, an item that must be ordered
                        in multiples of 6 would have a 6 in the "minimum order quantity" column, whereas
                        items that can be ordered as "singles" would have a 1 in that column.</span>
                    </li>
                  </ul>
                </ul>
                <p
                  style="font-size:11pt; font-family:Calibri,sans-serif; background-color:white; margin:0; line-height:115%">
                  <span style="color:black; font-size:12pt">&nbsp;</span></p>
                <p
                  style="font-size:11pt; font-family:Calibri,sans-serif; background-color:white; margin:0; line-height:115%">
                  <span style="color:black; font-size:12pt">&nbsp;</span></p>
                <p
                  style="font-size:11pt; font-family:Calibri,sans-serif; background-color:white; margin:0; line-height:115%">
                  <span style="color:black; font-size:12pt">Please feel free to reach out with any questions
                    you may have,</span></p>
                <p
                  style="font-size:11pt; font-family:Calibri,sans-serif; background-color:white; margin:0; line-height:115%">
                  <span style="color:black; font-size:12pt">&nbsp;</span></p>
                <p
                  style="font-size:11pt; font-family:Calibri,sans-serif; background-color:white; margin:0; line-height:115%">
                  <span style="color:black; font-size:12pt">&nbsp;</span></p>
                <p style="font-size:11pt; font-family:Calibri,sans-serif; margin:0 0 10pt 0; line-height:115%">
                  <span
                    style="color:black; font-size:12pt; background-color:white; padding:0; border:1pt none windowtext">Thanks!</span>
                </p>
                <!--<br>-->
              </div>
              <div style="font-family:Calibri,Arial,Helvetica,sans-serif; font-size:12pt; color:rgb(0,0,0)">
                <!--<br>-->
              </div>
              <div id="x_Signature">
                <div style="font-family:Calibri,Arial,Helvetica,sans-serif; font-size:12pt; color:rgb(0,0,0)">
                  <div style="color:#212121; font-size:15px; margin:0">
                    <div style="margin:14pt 30pt">
                      <div style="margin:0">
                        <p style="margin-top:0; margin-bottom:0"><b><span
                              style="color:#006600; font-size:12pt; font-family:Futura Lt BT">Andrea
                              McGrath&nbsp;</span></b><span
                            style="color:#006600; font-size:12pt; font-family:Futura Lt BT">|<b>&nbsp;Wellness
                              Category Manager</b>&nbsp;</span>
                        </p>
                        <p><img src="cid:andreaEmailSignatureImage"/></p>
                        <!--<p style="margin-top:0; margin-bottom:0"><img data-imagetype="AttachmentByCid"
                            originalsrc="cid:048eabc2-66e6-4fed-bc20-9e0063ef0fb6"
                            data-custom="AAMkAGM1ZGU4MjczLWIwZDYtNGRhMi1iMmYzLWUxZmRlNmI4MWY3ZQBGAAAAAAAzaHnGLjXSQJHLXLMdffw9BwBfXz8uTm%2BIT7ZCQLTVuVW7AAAAAAEMAABfXz8uTm%2BIT7ZCQLTVuVW7AAB%2FHmJtAAABEgAQAGxSNLx9OnxCsEhdPmUZTZM%3D"
                            naturalheight="86" naturalwidth="313"
                            src="https://attachments.office.net/owa/Andrea.McGrath@rainbowblossom.com/service.svc/s/GetAttachmentThumbnail?id=AAMkAGM1ZGU4MjczLWIwZDYtNGRhMi1iMmYzLWUxZmRlNmI4MWY3ZQBGAAAAAAAzaHnGLjXSQJHLXLMdffw9BwBfXz8uTm%2BIT7ZCQLTVuVW7AAAAAAEMAABfXz8uTm%2BIT7ZCQLTVuVW7AAB%2FHmJtAAABEgAQAGxSNLx9OnxCsEhdPmUZTZM%3D&amp;thumbnailType=2&amp;owa=outlook.office365.com&amp;scriptVer=2020010602.18&amp;X-OWA-CANARY=UfzXlFYInk6GM_x1VuxAsbDfBkuZmtcYk46mAU0S9SmpQ_k-dXzD6GCK955efc20svxi3i1PUW0.&amp;token=eyJhbGciOiJSUzI1NiIsImtpZCI6IjU2MzU4ODUyMzRCOTI1MkRERTAwNTc2NkQ5RDlGMjc2NTY1RjYzRTIiLCJ4NXQiOiJWaldJVWpTNUpTM2VBRmRtMmRueWRsWmZZLUkiLCJ0eXAiOiJKV1QifQ.eyJvcmlnaW4iOiJodHRwczovL291dGxvb2sub2ZmaWNlMzY1LmNvbSIsInZlciI6IkV4Y2hhbmdlLkNhbGxiYWNrLlYxIiwiYXBwY3R4c2VuZGVyIjoiT3dhRG93bmxvYWRAMjc0Mzc5N2YtOTM2Zi00NzYzLTk1NjYtMjE4N2QwMzI0OWFjIiwiaXNzcmluZyI6IldXIiwiYXBwY3R4Ijoie1wibXNleGNocHJvdFwiOlwib3dhXCIsXCJwcmltYXJ5c2lkXCI6XCJTLTEtNS0yMS01NzYzNjMwODktMjM4MjQ0NTUxMC0yMjI1NzA5ODItMjgzMzQ4NDZcIixcInB1aWRcIjpcIjExNTM4MDExMTUyNDM4OTMyOTFcIixcIm9pZFwiOlwiNDllMjAzY2EtOGQ5OC00M2Q2LWI1NzEtNTc2MjA4Yjk5YWNmXCIsXCJzY29wZVwiOlwiT3dhRG93bmxvYWRcIn0iLCJuYmYiOjE1NzkxODg3MzgsImV4cCI6MTU3OTE4OTMzOCwiaXNzIjoiMDAwMDAwMDItMDAwMC0wZmYxLWNlMDAtMDAwMDAwMDAwMDAwQDI3NDM3OTdmLTkzNmYtNDc2My05NTY2LTIxODdkMDMyNDlhYyIsImF1ZCI6IjAwMDAwMDAyLTAwMDAtMGZmMS1jZTAwLTAwMDAwMDAwMDAwMC9hdHRhY2htZW50cy5vZmZpY2UubmV0QDI3NDM3OTdmLTkzNmYtNDc2My05NTY2LTIxODdkMDMyNDlhYyJ9.LwbFD4HbICfF2w827LFoDVaANlvFBrULAZUyKFTRjs1lbNtlq2G77iTuaqowlLNhy6AEcL45qVmh9FvvBeSRM0RHeMh2qGkBZGEqDNd9tqxkBPRpY0L8-PXoosZXqC-HlpTr0CUUHIOHeK33tAbs37NXBFTMR5D-wDSYomkD-6aK5cay61LaLX0_Jz0iMaqA47usf96iD2djhkbP0yQ1QYxDpEtdIJSyqktaTSyoZLYaMdeCzGk31jFaDr6wVESav4IiFqw_CO_oO6ZNrsfOZD8XPekBhDinsOE8dB-dnx9QIFqRmOE7LzwXzstbGS2oGC71_OBiVVMTNPcAzHLLww&amp;animation=true"
                            class="x_EmojiInsert" data-outlook-trace="F:1|T:1"
                            style="max-width: 100%; height: auto; cursor: pointer;" crossorigin="use-credentials"><br>
                        </p>-->
                        <p style="margin-top:0; margin-bottom:0"></p>
                        <p style="margin-top:0; margin-bottom:0"><span
                            style="color:navy; font-family:Eras Light ITC,sans-serif"></span><b><span
                              style="color:#006600; font-size:12pt; font-family:Eras Light ITC,sans-serif"></span></b>
                        </p>
                        <p style="margin-top:0; margin-bottom:0" data-event-added="1"><span
                            style="color:#006600; font-family:Futura Lt BT"><span tabindex="0">3738
                              Lexington Road
                            </span>|<span tabindex="0"><span data-markjs="true" class="_2HwZTce1zKwQJyzgqXpmAy" tabindex="0"
                                role="link">
                                Louisville, KY 40207</span></span></span></p>
                        <p style="margin-top:0; margin-bottom:0"><span
                            style="color:#006600; font-family:Futura Lt BT">office: 502-498-2348 |
                            fax: 502-618-4124</span></p>
                        <p style="margin-top:0; margin-bottom:0"><span style="color:#006600; font-family:Futura Lt BT">
                          </span></p>
                        <p style="margin-top:0; margin-bottom:0">
                          <span style="color:#006600; font-family:Futura Lt BT">
                            <span>
                              <a href="mailto:andrea.mcgrath@rainbowblossom.com" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable">
                                Andrea.McGrath@RainbowBlossom.com
                              </a>
                            </span>
                            |
                            <span>
                              www.RainbowBlossom.com
                            </span>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `, // html body
        attachments: [{
          filename: 'rbEmailLogo1.jpg',
          path: `${process.cwd()}/public/images/rbEmailLogo1.jpg`,
          cid: 'andreaEmailSignatureImage' //same cid value as in the html img src
        }]
      });

      console.log(`process.cwd()}==> ${process.cwd()}`)

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
          connection.query(`UPDATE rainbowcat SET comments2 = 'requested cat (auto-email)' WHERE vendorName = '${successfulEmailArray[i]}';`)
          console.log(`successfullEmailArray[${i}]==> ${successfulEmailArray[i]}`)
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