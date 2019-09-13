var express = require('express');
var router = express.Router();

const passport = require('passport');


/* GET login page. */
router.get('/', function (req, res, next) {
  res.render('vw-login', {
    title: 'Login'
  });
});



// router.post('/loginPost', (req, res, next) => { //take POST request data from login page & do Passport stuff
//   const postBody = req.body;
//   console.log('postBody==>', postBody);
//   let formInput0 = Object.values(postBody)[0];
//   let formInput1 = Object.values(postBody)[1];
// });


module.exports = router;