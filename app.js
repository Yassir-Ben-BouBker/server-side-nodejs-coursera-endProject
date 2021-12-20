// Import Modules 

// App Config
var config = require('./config');

// Express , Mongoose, 
const express = require('express'); // 
const mongoose = require('mongoose');

// Access and interact with the file system.
const path = require('path');

// Error handling
const createError = require('http-errors');

// Log HTTP requests and errors, (in CMD)
const logger = require('morgan');

// Cookies and Sessions
const cookieParser = require('cookie-parser');

const session = require('express-session');
const FileStore = require('session-file-store')(session);

// Authentification and Authorsation
const passport = require('passport');

const authenticate = require('./authenticate');


// Access the Route
  // public Route
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
  // protected Route
const disheRouter = require('./routes/dishe');
const leaderRouter = require('./routes/leader');
const promotionRouter = require('./routes/promotion');
const favoriteRouter = require('./routes/favorite')

const uploadRouter = require('./routes/upload');


  // Establishing dataBase Connection
mongoose.connect(config.mongoUrl).then((db) => {
  console.log("Connected Correctly to the Database");
}, (err) => { console.log(err); })


// start Express
var app = express();

// Secure traffic only
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// authorization function
app.use(passport.initialize());

// Access to public route
app.use('/', indexRouter);
app.use('/users', usersRouter);
// Access to public folder
app.use(express.static(path.join(__dirname, 'public')));

// Access to protected route
app.use('/dishes', disheRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promotionRouter);
app.use('/favorites',favoriteRouter); // favorite route

app.use('/imageUpload',uploadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
