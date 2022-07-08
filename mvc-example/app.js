/* eslint-disable no-unused-vars */
const path = require('path');

const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');
const logger = require('morgan');
const createError = require('http-errors');

const routers = require('./routers');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.response.message = function (msg) {
  const sess = this.req.session;
  sess.messages = sess.messages || [];
  sess.messages.push(msg);
  return this;
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'some secret here',
}));

// app.use(cookieParser());

// take the errors from session and clean
app.use((req, res, next) => {
  // expose "error local variable"
  res.locals = Object.assign(res.locals, req.session.form);
  res.locals.errors = Object.assign([], res.locals, req.session.errors);
  res.locals.messages = Object.assign([], res.locals, req.session.messages);
  next();

  req.session.errors = [];
  req.session.messages = [];
  req.session.form = {};
});

// set logger
app.use(logger(process.env.NODE_ENV || 'dev'));

// add on all routes a prefix version
app.get('/', (req, res) => res.redirect('/v1/posts')); // redirect to home
app.use('/v1', routers);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = createError(404);
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // mongoose validator
  if (err.name && err.name === 'ValidationError') {
    // retrieve last view
    const lastView = req.headers.referer.replace(`${req.headers.origin}/`, '/');
    // save form
    req.session.form = req.body;
    // save errors
    req.session.errors = Object.entries(err.errors).map(([, obj]) => obj);
    req.session.messages.push(err.message);

    res.redirect(lastView);
  } else if ((err.status && err.status === 404) || (err.name && err.name === 'CastError')) {
    res.status(404).render('404', {
      url: req.originalUrl,
    });
  } else {
    // error page
    res.status(err.status).render('5xx', { err });
  }
});

module.exports = app;
