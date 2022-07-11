const express = require('express');

const postController = require('./controllers/postController');
const commentController = require('./controllers/commentController');

const router = express.Router();
const nRouter = express.Router();

// POSTS ROUTES
router
  .route('/posts')
  .all(postController.beforeAll)
  .get(postController.list)
  .post(postController.add);
router
  .route('/posts/new')
  .get(postController.new);

router
  .param('id', postController.beforeId)
  .route('/posts/:id')
  .get(postController.show)
  .put(postController.save)
  .delete(postController.delete);

router
  .param('id', postController.beforeId)
  .route('/posts/:id/edit')
  .get(postController.edit);

// COMMENTS ROUTES
nRouter
  .param('postId', commentController.beforeAllById)
  .route('/:postId/comments')
  .all(commentController.beforeAll)
  .get(commentController.list)
  .post(commentController.add);
nRouter
  .route('/:postId/comments/new')
  .get(commentController.new);
nRouter
  .param('id', commentController.beforeById)
  .route('/:postId/comments/:id')
  .get(commentController.show)
  .put(commentController.save)
  .delete(commentController.delete);
nRouter
  .param('id', commentController.beforeById)
  .route('/:postId/comments/:id/edit')
  .get(commentController.edit);

router.use('/posts', nRouter);

module.exports = router;
