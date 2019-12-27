var express = require('express');
var router = express.Router();

var mysql = require('mysql')
// var connection = mysql.createConnection({ //old - from local db setup
// 	host: 'localhost',
// 	user: 'root',
// 	password: '',
// 	database: 'catRelTrkr'
// });

const connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL);
connection.connect();

/* GET db-input page. */
router.get('/', function (req, res, next) {
	res.render('vw-dbSearch', {
		title: 'Search Catalog Tracker Database'
	});
});

router.post('/results', (req, res, next) => { //take POST request data from dbSearch page & put into database table

	let searchResults = [];

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
			console.log(rows[i]['issueDate'])
			searchResults.push(srcRsObj);
		}
	}

	const postBody = req.body;
	console.log('postBody==>', postBody);
	let formInput0 = Object.values(postBody)[0];
	let formInput1 = Object.values(postBody)[1];
	let formInput2 = Object.values(postBody)[2];
	let formInput3 = Object.values(postBody)[3];
	let formInput4 = Object.values(postBody)[4];
	let formInput5 = Object.values(postBody)[5];
	let formInput6 = Object.values(postBody)[6];
	let formInput7 = Object.values(postBody)[7];
	console.log('formInput0(from dbSearch)==>', formInput0);
	console.log('formInput1(from dbSearch)==>', formInput1);
	console.log('formInput2(from dbSearch)==>', formInput2);
	console.log('formInput3(from dbSearch)==>', formInput3);
	console.log('formInput4(from dbSearch)==>', formInput4);
	console.log('formInput5(from dbSearch)==>', formInput5);
	console.log('formInput6(from dbSearch)==>', formInput6);
	console.log('formInput7(from dbSearch)==>', formInput7);


	if (formInput1 == '' && formInput2 == '' && formInput3 == '' && formInput4 == '' && formInput5 == '' && formInput6 == '' && formInput7 == '') { //return all table entries if search string is empty
		connection.query(`SELECT * FROM rainbowcat ORDER BY vendorName ASC`, function (err, rows, fields) {
			if (err) throw err;
			showSearchResults(rows);

			res.render('vw-dbSearch', { //render searchResults to vw-dbSearch page
				title: 'Search Catalog Tracker Database',
				searchResRows: searchResults
			});
		})
	} else { // if no records found, render vw-noRecords page
		if (formInput0 !== undefined && formInput1 !== undefined && formInput2 !== undefined && formInput3 !== undefined && formInput4 !== undefined && formInput5 !== undefined && formInput6 !== undefined && formInput7 !== undefined) {
			connection.query(`SELECT * FROM rainbowcat WHERE vendorName LIKE '${formInput1}%' AND ediName LIKE '${formInput2}%' 
			AND ${issueDate} LIKE '${formInput3}%' AND ${needNewCat} LIKE '${formInput4}%' AND ${updatedWLatest} LIKE '${formInput5}%' 
			AND ${reporter} LIKE '${formInput6}%' AND ${comments} LIKE '${formInput7}%' ORDER BY 'vendorName' DESC`,
				function (err, rows, fields) {
					if (err) throw err;
					console.log('rows==>', rows);
					console.log('rows.length==>', rows.length);
					if (rows.length <= 0) {
						console.log('NO RECORDS FOUND');
						res.render('vw-noRecords', {
							title: 'no results',
						});
					} else { //if records found for search string entered, add them to searchResults
						showSearchResults(rows);

						res.render('vw-dbSearch', { //render searchResults to vw-dbSearch page
							title: 'Search Catalog Tracker Database',
							searchResRows: searchResults,
						});
					}
				})
		}
	}
});

module.exports = router;