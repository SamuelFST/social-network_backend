/* eslint-disable no-underscore-dangle */
const createError = require('http-errors');
const express = require('express');

const router = express.Router();

const { Comment, Connection, Post } = require('../models');

router
  .param('postId', (req, res, next, id) => Promise.resolve()
    .then(() => {
      res.locals.post = { id };
      next();
    })
    .catch((err) => next(err)))

  .route('/:postId/comments')
  .all((req, res, next) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => {
      next();
    })
    .catch((err) => next(err)))

/**
 * Get the comments of a post
 * @route GET /posts/{postId}/comments
 * @param {string} postId.path.required
 * @group Comment - api
 * @returns {Array.<Comment>} 200 - Return an array with comments of a post
 * @returns {Error} default - unexpected error
 * @security JWT
 */
  .get((req, res, next) => Promise.resolve()
    .then(() => Comment.find({ post: res.locals.post.id }).populate('post'))
    .then((data) => res.status(200).json(data))
    .catch((err) => next(err)))

/**
 * Post a comment into a post
 * @route POST /posts/{postId}/comments
 * @param {string} postId.path.required
 * @param {Comment.model} comment.body.required
 * @group Comment - api
 * @security JWT
 */
  .post(async (req, res, next) => Promise.resolve()
    .then(() => new Comment(
      Object.assign(req.body, { post: res.locals.post.id, user: req.user._id }),
    ).save())
    .then((comment) => Post.findById(comment.post)
      .then((post) => Object.assign(post, { comments: [...post.comments, comment._id] }))
      .then((post) => Post.findByIdAndUpdate(comment.post, post))
      .then((args) => req.publish('comment', [args.profile], args))
      .then(() => comment))
    .then((data) => res.status(201).json(data))
    .catch((err) => next(err)));

router
  .param('id', (req, res, next, id) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => next())
    .catch((err) => next(err)))
  .route('/:postId/comments/:id')

/**
 * @route GET /posts/{postId}/comments/{id}
 * @param {string} postId.path.required
 * @param {string} id.path.required
 * @group Comment - api
 * @returns {<Comment>} 200 - Return a comment from post
 * @returns {Error} default - unexpected error
 * @security JWT
 */
  .get((req, res, next) => Promise.resolve()
    .then(() => Comment.findById(req.params.id).populate('post'))
    .then((data) => (data ? res.status(200).json(data) : next(createError(404))))
    .catch((err) => next(err)))

/**
 * @route PUT /posts/{postId}/comments/{id}
 * @param {Comment.model} comment.body.required
 * @param {string} postId.path.required
 * @param {string} id.path.required
 * @group Comment - api
 * @security JWT
 */
  .put((req, res, next) => Promise.resolve()
    .then(() => Comment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { runValidators: true },
    ))
    .then((data) => res.status(203).json(data))
    .catch((err) => next(err)))

/**
 * @route DELETE /posts/{postId}/comments/{id}
 * @param {string} postId.path.required
 * @param {string} id.path.required
 * @group Comment - api
 * @security JWT
 */
  .delete((req, res, next) => Promise.resolve()
    .then(() => Comment.deleteOne({ _id: req.params.id }))
    .then((data) => res.status(203).json(data))
    .catch((err) => next(err)));

router
  .param('id', (req, res, next, id) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => next())
    .catch((err) => next(err)))
  .route('/:postId/comments/:id/like')

/**
 * Like a comment
 * @route POST /posts/{postId}/comments/{id}/like
 * @param {string} postId.path.required - post id
 * @param {string} id.path.required - comment id
 * @group Comment - api
 * @security JWT
 */
  .post((req, res, next) => Promise.resolve()
    .then(() => Comment.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { likes: req.user.profile._id } },
    ))
    .then((args) => req.publish('comment-like', [args.profile], args))
    .then((data) => res.status(203).json(data))
    .catch((err) => next(err)));

router
  .param('id', (req, res, next, id) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => next())
    .catch((err) => next(err)))
  .route('/:postId/comments/:id/unlike')

/**
 * Unlike a comment
 * @route POST /posts/{postId}/comments/{id}/unlike
 * @param {string} postId.path.required - post id
 * @param {string} id.path.required - comment id
 * @group Comment - api
 * @security JWT
 */
  .post((req, res, next) => Promise.resolve()
    .then(() => Comment.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { likes: req.user.profile._id } },
    ))
    .then((args) => req.publish('comment-unlike', [args.profile], args))
    .then((data) => res.status(203).json(data))
    .catch((err) => next(err)));

module.exports = router;
