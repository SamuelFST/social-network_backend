/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
const createError = require('http-errors');
const { Comment, Post, Connection } = require('../models');

module.exports = {
  beforeAllById: (req, res, next, id) => Promise.resolve()
    .then(() => {
      res.locals.post = { id };
      next();
    })
    .catch((err) => next(err)),

  beforeAll: (req, res, next) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => {
      // console.log(`Request from : ${req.originalUrl}`);
      // console.log(`Request type : ${req.method}`);
      // console.log(`Request params : ${req.params}`);
      next();
    })
    .catch((err) => next(err)),

  beforeById: (req, res, next, id) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => {
      // console.log(`Request from : ${req.originalUrl}`);
      // console.log(`Request type : ${req.method}`);
      // console.log(`Request id : ${id}`);
      next();
    })
    .catch((err) => next(err)),

  list: (req, res, next) => Promise.resolve()
    .then(() => Comment.find({ post: res.locals.post.id }))
    .then((data) => {
      res.render('comments/list', {
        comments: data,
      });
    })
    .catch((err) => next(err)),

  add: (req, res, next) => Promise.resolve()
    .then(() => new Comment(Object.assign(req.body.comment, { post: res.locals.post.id })).save())
    .then((comment) => Post.findById(comment.post)
      .then((post) => Object.assign(post, { comments: [...post.comments, comment._id] }))
      .then((post) => Post.findByIdAndUpdate(comment.post, post))
      .then(() => comment))
    .then((data) => {
      res.message('Comment added with success!');
      res.redirect(`/v1/posts/${res.locals.post.id}/comments/${data._id}`);
    })
    .catch((err) => next(err)),

  show: (req, res, next) => Promise.resolve()
    .then(() => Comment.findById(req.params.id))
    .then((data) => {
      if (data) {
        res.render('comments/show', {
          comment: data,
        });
      } else {
        next(createError(404));
      }
    })
    .catch((err) => next(err)),

  save: (req, res, next) => Promise.resolve()
    .then(() => Comment.findByIdAndUpdate(req.params.id, req.body.comment, {
      runValidators: true,
    }))
    .then((data) => {
      res.message('Comment saved with success!');
      res.redirect(`/v1/posts/${res.locals.post.id}`);
    }),

  delete: (req, res, next) => Promise.resolve()
    .then(() => Comment.deleteOne({ _id: req.params.id }))
    .then(() => {
      res.message('Comment deleted with success!');
      res.redirect(`/v1/posts/${res.locals.post.id}`);
    })
    .catch((err) => next(err)),

  edit: (req, res, next) => Promise.resolve()
    .then(() => Comment.findById(req.params.id))
    .then((data) => {
      res.render('comments/edit', {
        comment: data,
      });
    })
    .catch((err) => next(err)),

  new: (req, res, next) => Promise.resolve()
    .then((data) => {
      res.render('comments/new', {
        comment: new Comment(res.locals.comment),
      });
    })
    .catch((err) => next(err)),
};
