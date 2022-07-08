const express = require('express');

const postController = require('./controllers/postController');

const router = express.Router();

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

module.exports = router;
