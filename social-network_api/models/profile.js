const { Schema, model } = require('mongoose');

/**
 * @typedef Profile
 * @property {string} _id
 * @property {string} name.required
 * @property {User} user.required - user
 * @property {Array.<Profile>} following - following profiles
 */

const profileSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'Profile',
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'Profile',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

profileSchema.index({ name: 'text' });
module.exports = model('Profile', profileSchema);
