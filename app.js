require("dotenv").config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const passport = require("passport");
const expressSession = require("express-session");
const flash = require("connect-flash");
const { pseudoRandomBytes } = require('crypto');
const mongoose = require("mongoose");

var app = express();
let PORT = process.env.PORT || 8000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set(express.static(path.join(__dirname, "public")));

// EXpress session
app.use(expressSession({
  resave: false,
 saveUninitialized: false,
 secret: "something" 
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());

// Connect to MongoDB once and export the connection
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/snapshare`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("ERROR connecting to MongoDB: ", error);
    process.exit(1); // Exit the process if we can't connect to the database
  }
};
connectToMongoDB();

// flash
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
})



module.exports = app;
