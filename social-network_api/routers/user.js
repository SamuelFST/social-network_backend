const createError = require('http-errors');
const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const { User, Connection } = require('../models');

router
  .route('/')
  .all((req, res, next) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => {
      next();
    })
    .catch((err) => next(err)));

router
  .param('id', (req, res, next, id) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => next())
    .catch((err) => next(err)))
  .route('/me')

/**
 * Get my user
 * @route GET /users/me
 * @group User - api
 * @returns {User} 200 - my user
 * @returns {Error} default - unexpected error
 * @security JWT
 */
  .get((req, res, next) => Promise.resolve()
    .then(() => User.findById(req.user.id))
    .then((data) => (data ? res.status(200).json(data) : next(createError(404))))
    .catch((err) => next(err)))

/**
 * Update my user
 * @route PUT /users/me
 * @group User - api
 * @param {User.model} post.body.required - user
 * @returns {User} 200 - my user
 * @returns {Error} default - unexpected error
 * @security JWT
 */
  .put((req, res, next) => Promise.resolve()
    .then(() => bcrypt.hash(req.body.password, 10))
    .then((hashedPassword) => {
      delete req.body.user;
      req.body.password = hashedPassword;
      req.body.updatedAt = Date.now();
    })
    .then(() => User.findByIdAndUpdate(req.user.id, req.body, { runValidators: true }))
    .then((data) => res.status(203).json(data))
    .catch((err) => next(err)))

/**
 * Delete my user
 * @route DELETE /users/me
 * @group User - api
 * @returns {User} 200 - my user
 * @returns {Error} default - unexpected error
 * @security JWT
 */
  .delete((req, res, next) => Promise.resolve()
    .then(() => User.deleteOne({ _id: req.user.id }))
    .then((data) => res.status(203).json(data))
    .catch((err) => next(err)));

module.exports = router;
