const mongoose = require('mongoose');

const connect = mongoose.connect(
  `${(process.env.MONGODB || 'mongodb://localhost:27017/mydb')}_${process.env.NODE_ENV || 'development'}`,
);

exports.Post = require('./post');
exports.Comment = require('./comment');

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
