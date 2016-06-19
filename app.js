
// server framework
var express = require('express');
var app = express();

var path = require('path');

var favicon = require('serve-favicon');
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// logs all requests, for dev only
var logger = require('morgan');
app.use(logger('dev'));

// authentication
var session = require('express-session');
app.use(session(config.secret));

var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

var cookieParser = require('cookie-parser');
app.use(cookieParser());

//// Initialize Passport
var initPassport = require('./passport-init');
initPassport(passport);

// to get params from post requests
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// import variables
var config = require('config');

// define routes
var apiRoutes = require('./routes/api');
// var authRoutes = require('./routes/auth');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');









app.use('/api', apiRoutes);
// app.use('/auth', authRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
