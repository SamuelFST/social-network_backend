const { Schema, model } = require('mongoose');

/**
 * @typedef Post
 * @property {string} _id
 * @property {string} title.required
 * @property {string} description.required
 * @property {Profile} profile.required
 * @property {Array.<Comment>} comments
 */

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
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Profile',
  }],
  image: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Post', postSchema);
