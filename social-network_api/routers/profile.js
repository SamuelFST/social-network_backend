/* eslint-disable no-underscore-dangle */
const createError = require('http-errors');
const express = require('express');

const router = express.Router();
const { Profile, Connection } = require('../models');

router
  .route('/')
  .all((req, res, next) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => next())
    .catch((err) => next(err)))

/**
 * Returns a list of profiles
 * @route GET /profiles
 * @group Profile - api
 * @returns {Profile} 200 - Array of user info
 * @returns {Error} default - Unexpected error
 * @security JWT
 */
  .get((req, res, next) => Promise.resolve()
    .then(() => Profile.find({}))
    .then((data) => res.status(200).json(data))
    .catch((err) => next(err)));

router
  .param('id', (req, res, next) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => next())
    .catch((err) => next(err)))
  .route('/search')

/**
 * Search for a profile
 * @route GET /profiles/search?q={q}
 * @param {string} q.query.required - profile id
 * @group Profile - api
 * @returns {<Profile>} 200 - profile
 * @security JWT
 */
  .get((req, res, next) => Promise.resolve()
    .then(() => Profile.find({ $text: { $search: `${req.query.q}` } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }))
    .then((data) => (data ? res.status(200).json(data) : next(createError(404))))
    .catch((err) => next(err)));

router
  .param('id', (req, res, next, id) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => next())
    .catch((err) => next(err)))
  .route('/:id')

/**
 * Get a profile by id
 * @route GET /profiles/{id}
 * @param {string} id.path.required - profile id
 * @group Profile - api
 * @returns {<Profile>} 200 - profile
 * @security JWT
 */
  .get((req, res, next) => Promise.resolve()
    .then(() => Profile.findById(req.params.id).populate(['following', 'followers']))
    .then((data) => (data ? res.status(200).json(data) : next(createError(404))))
    .catch((err) => next(err)));

router
  .param('id', (req, res, next, id) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => next())
    .catch((err) => next(err)))
  .route('/:id/follow')

/**
 * Follow a user
 * @route POST /profiles/{id}/follow
 * @param {string} id.path.required - user's id
 * @group Profile - api
 * @security JWT
 */
  .post((req, res, next) => Promise.resolve()
    .then(() => Profile.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { followers: req.user.profile._id } },
    ))
    .then(() => Profile.findOneAndUpdate(
      { _id: req.user.profile._id },
      { $push: { following: req.params.id } },
    ))
    .then((data) => res.status(203).json(data))
    .catch((err) => next(err)));

module.exports = router;
