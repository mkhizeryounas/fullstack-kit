const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { default: mongooseFilterQuery } = require('mongoose-filter-query');

// const { default: appLoagger } = require('./utils/logger');

const app = express();

app.set('DB', require('./config/db'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(require('./middlewares/response'));
app.use(require('cors')());
app.use(mongooseFilterQuery);

app.use('/', require('./config/routes'));

// catch 404 and forward to error handler
app.use(function (req, res) {
  res.reply({ statusCode: 404 });
});

// error handler
app.use(function (err, req, res, next) {
  console.error('Middleware Error: ', err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  // res.locals.error = req.app.get("env") === "development" ? err : {};
  // appLoagger.error(err);
  if (err.isJoi || err.hasOwnProperty('errors') || err.name === 'MongoError') {
    err.status = 422;
  }
  if (err.hasOwnProperty('errors') && Array.isArray(err.errors)) {
    err.errors = err.errors.reduce((pre, now) => {
      return [...pre, ...now.messages];
    }, []);
  }
  res.reply({
    message: err.message,
    statusCode: err.status || 400,
    data: err.hasOwnProperty('errors')
      ? err.errors
      : err.name === 'MongoError'
      ? err
      : err.data,
  });
  next();
});

module.exports = app;
