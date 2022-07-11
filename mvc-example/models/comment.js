const { Schema, model } = require('mongoose');
const Redact = require('./redact');

const commentSchema = new Schema({
  description: {
    type: String,
    required: [true, 'A descricao e obrigatoria'],
    minLength: [2, 'O comentario precisa ter pelo menos 2 caracteres'],
    validate: {
      validator: (value) => Redact
        .count({ term: value })
        .then((count) => count === 0),
      message: 'A palavra {VALUE} nao pode ser usada',
    },
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  },
});

module.exports = model('Comment', commentSchema);
