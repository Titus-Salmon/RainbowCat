const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const bodyParser = require('body-parser'); //t0d //Node.js body parsing middleware. Parse incoming request bodies in a
// //middleware before your handlers, available under the req.body property.
const helmet = require('helmet'); //t0d


const homeRouter = require('./routes/rt-home'); //t0d
const dbInputRouter = require('./routes/rt-dbInput'); //t0d
const dbSearchRouter = require('./routes/rt-dbSearch'); //t0d
const dbEditRouter = require('./routes/rt-dbEdit'); //t0d
const dbEditAndreaRouter = require('./routes/rt-dbEditAndrea'); //t0d
const editEntryRouter = require('./routes/rt-editEntry'); //t0d
const editEntryAndreaRouter = require('./routes/rt-editEntryAndrea'); //t0d
const noRecordsRouter = require('./routes/rt-noRecords'); //t0d
const autoEmailRouter = require('./routes/rt-autoEmail'); //t0d
const autoEmailAndreaRouter = require('./routes/rt-autoEmailAndrea'); //t0d

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(bodyParser.urlencoded({ //t0d //bodyParser = middleware
//  extended: false
//}));
// app.use(bodyParser.json());//t0d
app.use(helmet()); //t0d


app.use('/', homeRouter); //t0d
app.use('/dbInput', dbInputRouter); //t0d
app.use('/dbSearch', dbSearchRouter); //t0d
app.use('/dbEdit', dbEditRouter); //t0d
app.use('/dbEditAndrea', dbEditAndreaRouter); //t0d
app.use('/editEntry', editEntryRouter); //t0d
app.use('/editEntryAndrea', editEntryAndreaRouter); //t0d
app.use('/noRecords', noRecordsRouter); //t0d
app.use('/autoEmail', autoEmailRouter); //t0d
app.use('/autoEmailAndrea', autoEmailAndreaRouter); //t0d

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;