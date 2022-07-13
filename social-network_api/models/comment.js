const { Schema, model } = require('mongoose');

/**
 * @typedef Comment
 * @property {string} _id
 * @property {string} description.required
 * @property {Post} post.required
 */

const commentSchema = new Schema({
  description: {
    type: String,
    required: [true, 'A descricao e obrigatoria'],
    minLength: [2, 'O comentario precisa ter pelo menos 2 caracteres'],
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  post: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Post',
  },
});

module.exports = model('Comment', commentSchema);
