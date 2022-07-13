const { Schema, model } = require('mongoose');

/**
 * @typedef User
 * @property {string} _id
 * @property {string} name.required
 * @property {string} user.required
 * @property {string} password.required
 */

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
  },
  user: {
    type: String,
    unique: true,
    required: true,
    minLength: 2,
  },
  password: {
    type: String,
    required: true,
    minLength: 2,
  },
  following: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = model('User', userSchema);
