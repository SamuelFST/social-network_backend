const { Schema, model } = require('mongoose');
const Redact = require('./redact');

const postSchema = new Schema({
  title: {
    type: String,
    required: [true, 'O titulo e obrigatorio'],
    minLength: [2, 'O titulo precisa ter pelo menos 2 caracteres'],
    validate: {
      validator: (value) => Redact
        .count({ term: value })
        .then((count) => count === 0),
      message: 'A palavra {VALUE} nao pode ser usada no titulo',
    },
  },
  description: {
    type: String,
    required: [true, 'A descricao e obrigatoria'],
    minLength: [2, 'a descricao precisa ter pelo menos 2 caracteres'],
    validate: {
      validator: (value) => Redact
        .count({ term: value })
        .then((count) => count === 0),
      message: 'A palavra {VALUE} nao pode ser usada na descricao',
    },
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
});

module.exports = model('Post', postSchema);
