const mongoose = require('mongoose');

/**
 * @typedef Login
 * @property {string} user.required
 * @property {string} password.required
 */
/**
 * @typedef Registry
 * @property {string} name
 * @property {string} user.required
 * @property {string} password.required
 */

const connect = mongoose.connect(
  `${(process.env.MONGODB || 'mongodb://localhost:27017/mydb')}_${process.env.NODE_ENV || 'development'}`,
  {
    serverSelectionTimeoutMS: (!process.env.NODE_ENV) ? 5000 : 30000,
  },
).catch((err) => console.error(err));

exports.Post = require('./post');
exports.Comment = require('./comment');
exports.User = require('./user');
exports.Profile = require('./profile');

mongoose.connection.on('error', () => {
  console.error('Mongo not connected');
});

mongoose.connection.on('connected', () => {
  console.warn('Mongo connected');
});

mongoose.connection.on('disconnected', () => {
  console.error('Mongo disconnected');
});

exports.Connection = connect;
