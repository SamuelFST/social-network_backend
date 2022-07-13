const createError = require('http-errors');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const { User, Connection } = require('../models');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'someSuperSecretToken123';

router
  .route('/')
  .all((req, res, next) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => {
      next();
    })
    .catch((err) => next(err)))

/**
 * @route GET /users
 * @group User - api
 * @returns {User} 200 - Array of user info
 * @returns {Error} default - unexpected error
 * @security JWT
 */
  .get((req, res, next) => Promise.resolve()
    .then(() => User.find({}))
    .then((data) => res.status(200).json(data))
    .catch((err) => next(err)))

/**
 * @route POST /users
 * @param {User.model} post.body.required - new user
 * @group User - api
 */
  .post((req, res, next) => Promise.resolve()
    .then(() => bcrypt.hash(req.body.password, 10))
    .then((passwordHashed) => new User({ ...req.body, password: passwordHashed }).save())
    .then((data) => res.status(201).json(data))
    .catch((err) => next(err)));

/**
 * Login
 * @route POST /users/login
 * @param {User.model} post.body.required - user and password
 * @group User - api
 */
router
  .route('/login')
  .post((req, res, next) => Promise.resolve()
    .then(() => User.findOne({ user: req.body.user }))
    .then((user) => (user
      ? bcrypt.compare(req.body.password, user.password)
      : next(createError(404))))
    .then((passwordHashed) => (passwordHashed
      ? jwt.sign(req.body.user, accessTokenSecret)
      : next(createError(401))))
    .then((token) => res.status(201).json({ msg: 'User authenticated!', token }))
    .catch((err) => next(err)));

router
  .param('id', (req, res, next, id) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => {
      // console.log(`Request from : ${req.originalUrl}`);
      // console.log(`Request type : ${req.method}`);
      // console.log(`Request id : ${id}`);
      next();
    })
    .catch((err) => next(err)))
  .route('/:id')

  .get((req, res, next) => Promise.resolve()
    .then(() => User.findById(req.params.id).populate({ path: 'comments' }))
    .then((data) => (data ? res.status(200).json(data) : next(createError(404))))
    .catch((err) => next(err)))

  .put((req, res, next) => Promise.resolve()
    .then(() => User.findByIdAndUpdate(req.params.id, req.body, { runValidators: true }))
    .then((data) => res.status(203).json(data))
    .catch((err) => next(err)))

  .delete((req, res, next) => Promise.resolve()
    .then(() => User.deleteOne({ _id: req.params.id }))
    .then((data) => res.status(203).json(data))
    .catch((err) => next(err)));

module.exports = router;
