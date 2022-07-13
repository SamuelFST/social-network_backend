/* eslint-disable consistent-return */
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const createError = require('http-errors');
const helmet = require('helmet');
const cors = require('cors');
const esg = require('express-swagger-generator');
const jwt = require('jsonwebtoken');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'someSuperSecretToken123';
const defaultOptions = require('./swagger.json');

const { User: UserModel } = require('./models');
const { User, Post, Comment } = require('./routers');

const options = Object.assign(defaultOptions, { basedir: __dirname });

const app = express();
const expressSwagger = esg(app);
expressSwagger(options);

app.use(cors());
app.use(helmet());

app.use(express.urlencoded({
  extended: true,
}));

app.use(bodyParser.json());
app.use(logger(process.env.NODE_ENV || 'dev'));

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return next(createError(401));
  }

  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      return next(createError(403));
    }
    UserModel.findOne({ user })
      .then((_user) => {
        req.user = _user;
        next();
      });
  });
}

Post.use('/', authenticate, Comment);
app.use('/v1/posts', authenticate, Post);
app.use('/v1/users', User);

app.use((req, res, next) => {
  const err = createError(404);
  next(err);
});

app.use((err, req, res, next) => {
  // mongoose validator
  if (err.name && err.name === 'ValidationError') {
    res.status(406).json(err);
  } else if ((err.status && err.status === 404) || (err.name && err.name === 'CastError')) {
    res.status(404).json({
      url: req.originalUrl,
      error: {
        message: 'Not Found',
      },
    });
  } else if (err.code === 11000) {
    res.status(500).json({
      url: req.originalUrl,
      error: {
        message: 'Duplicate key not allowed',
      },
    });
  } else {
    res.status(err.status || 500).json({
      url: req.originalUrl,
      err,
    });
  }
});

module.exports = app;
