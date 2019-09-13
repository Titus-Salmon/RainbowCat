module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to use this resource');
    res.redirect('./users/login')
  }
}
//BRING THIS MODULE (auth-t0dt1tz1.js) INTO ANY ROUTE YOU WANT PROTECTED
//(i.e. you'll need to be logged in to access the route)