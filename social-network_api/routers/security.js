/* eslint-disable no-underscore-dangle */
const createError = require('http-errors');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const { User, Profile, Connection } = require('../models');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'someSuperSecretToken123';

router
  .all((req, res, next) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => next())
    .catch((err) => next(err)))
  .route('/login')

/**
 * Log-in a user
 * @route POST /security/login
 * @param {Login.model} post.body.required
 * @group Security - api
 */
  .post((req, res, next) => Promise.resolve()
    .then(() => User.findOne({ user: req.body.user }))
    .then((user) => (user
      ? bcrypt.compare(req.body.password, user.password)
        .then((hashedPassword) => [user, hashedPassword])
      : next(createError(404))))
    .then(([user, hashedPassword]) => (hashedPassword
      ? jwt.sign(JSON.stringify(user), accessTokenSecret)
      : next(createError(401))))
    .then((accessToken) => res.status(201).json({ accessToken }))
    .catch((err) => next(err)));

router
  .route('/register')
  .all((req, res, next) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => next())
    .catch((err) => next(err)))

/**
 * Register a user
 * @route POST /security/register
 * @param {Registry.model} post.body.required
 * @group Security - api
 */
  .post((req, res, next) => Promise.resolve()
    .then(() => bcrypt.hash(req.body.password, 15))
    .then((hashedPassword) => new User({ ...req.body, password: hashedPassword }).save())
    .then((user) => new Profile({ name: req.body.name || req.body.user, user: user._id }).save()
      .then((profile) => User.findByIdAndUpdate(user._id, { profile })))
    .then((data) => res.status(201).json(data))
    .catch((err) => next(err)));

module.exports = router;
