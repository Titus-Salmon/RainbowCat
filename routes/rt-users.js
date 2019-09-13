var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')

//User model (mongoose)
const User = require('../models/User');

// flashResultsFromRegisterPage = [];
// let flashResultsFromRegisterPage = '';
// flashResultsFromLoginPage = [];
// let flashResultsFromLoginPage = '';

/* GET home page. */
router.get('/login', function (req, res, next) {
  res.render('vw-login', {
    title: 'vw-login',
    // flashResultsRegister: flashResultsFromRegisterPage[0],
    // flashResultsRegister: flashResultsFromRegisterPage,
    // flashResultsLogin: flashResultsFromLoginPage[0]
    // flashResultsLogin: flashResultsFromLoginPage
  });
});

router.get('/register', function (req, res, next) {
  res.render('vw-register', {
    title: 'vw-register'
  });
});

//Register handle
router.post('/register', (req, res) => {
  const {
    name,
    email,
    password,
    password2
  } = req.body;
  let errors = [];

  //check required fields
  if (!name || !email || !password || !password2) {
    errors.push({
      msg: 'please fill in all fields'
    })
  }

  //check that passwords match
  if (password !== password2) {
    errors.push({
      msg: 'passwords do not match'
    })
  }

  //check that password is at least 6 characters
  if (password.length < 6) {
    errors.push({
      msg: 'password must be 6 characters minimum'
    })
  }

  if (errors.length > 0) {
    res.render('vw-register', {
      errors,
      name,
      email,
      password,
      password2
    })
  } else {
    //validation passed
    User.findOne({ //findOne() ==> mongoose method
      email: email
    }).then(user => {
      if (user) {
        //User exists
        errors.push({
          msg: 'email is already registered'
        })
        res.render('vw-register', {
          errors,
          name,
          email,
          password,
          password2
        })
      } else {
        const newUser = new User({
          name,
          email,
          password
        })
        // hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //set password to hash
            newUser.password = hash;
            //save user
            newUser.save().then(user => {
              req.flash('success_msg', 'You are now registered, and can log in');
              // flashResultsFromRegisterPage.push(req.session.flash);
              // flashResultsFromRegisterPage = req.session.flash;
              res.redirect('/users/login')
              // res.render('vw-login', {
              //   title: 'Login (with flash messages?)',
              //   flashResults: req.session.flash,
              // });
            }).catch(err => console.log(err));
          })
        })
      }
    })
  }
})

// Login
router.post('/login', (req, res, next) => {

  // flashResultsFromLoginPage = req.session.flash;

  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
  // flashResultsFromLoginPage.push(req.session.flash);
  // flashResultsFromLoginPage = req.session.flash;
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;