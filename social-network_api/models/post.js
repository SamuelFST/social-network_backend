const { Schema, model } = require('mongoose');

/**
 * @typedef Post
 * @property {string} _id
 * @property {string} title.required
 * @property {string} description.required
 */

const postSchema = new Schema({
  title: {
    type: String,
    required: [true, 'O titulo e obrigatorio'],
    minLength: [2, 'O titulo precisa ter pelo menos 2 caracteres'],
  },
  description: {
    type: String,
    required: [true, 'A descricao e obrigatoria'],
    minLength: [2, 'a descricao precisa ter pelo menos 2 caracteres'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
});

module.exports = model('Post', postSchema);
