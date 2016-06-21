// server framework
var express = require('express');

// import variables
var config = require('./config');

var path = require('path');

// logs all requests, for dev only
var logger = require('morgan');

// to get cookie info
var cookieParser = require('cookie-parser');

// parses request cookies, populating req.cookies and req.signedCookies
// could pass a secret as argument
app.use(express.cookieParser());

// to get params from post requests
var bodyParser = require('body-parser');

// authentication
var session = require('express-session');
var passport = require('passport');

// import mongoose models
require('./models/models.js');

// mongoose for mongodb
var mongoose = require('mongoose');

if (process.env.DEV_ENV) {
  // if we are local, use local db
  mongoose.connect(config.localDatabase)
} else {
  // else use cloud db
  mongoose.connect(config.cloudDatabase)
};

// import routers
var authRoutes = require('./routes/authenticate')(passport);
var apiRoutes = require('./routes/api');
var indexRoutes = require('./routes/index');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(session({'secret': config.secret}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));  // public path
app.use(passport.initialize());
app.use(passport.session());

// register routers to root paths
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/', indexRoutes);

// initialize Passport for auth
var initPassport = require('./passport-init');
initPassport(passport);

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
