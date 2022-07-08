const { Schema, model } = require('mongoose');

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: 2,
  },
  description: {
    type: String,
    required: true,
    minLength: 2,
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
});

module.exports = model('Post', postSchema);
