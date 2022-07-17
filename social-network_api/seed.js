/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const {
  Connection, Post, Comment, Profile, User,
} = require('./models');

function createUser(name) {
  return bcrypt.hash('12345', 15)
    .then((password) => new User({ user: name, password }).save()
      .then((user) => new Profile({ name, user: user._id }).save()
        .then((profile) => User.findByIdAndUpdate(user._id, { profile: profile._id })
          .then(() => profile))));
}

function createPost(profile) {
  return new Post({ title: 'post1', description: 'post1', profile: profile._id }).save()
    .then((post) => new Comment({ description: 'comment 1', post: post._id, profile: profile._id }).save()
      .then((comment) => Post.findByIdAndUpdate(post._id, { $push: { comments: comment._id } })));
}

function follow(profile1, profile2) {
  return Profile.findByIdAndUpdate(profile1._id, { $push: { following: profile2._id } })
    .then(() => Profile.findByIdAndUpdate(profile2._id, { $push: { followers: profile1._id } }));
}

Connection
  .then(() => Promise.all([
    'Barba',
    'Danilo',
    'Bruno',
    'Renan',
    'Samuel',
    'Teste 01',
    'Teste 02',
    'Teste 03',
    'Teste 04',
    'Teste 05',
  ].map((name) => createUser(name)))
    .then(([profile1, profile2]) => follow(profile1, profile2).then(() => ([profile1, profile2])))
    .then(([profile1, profile2]) => Promise.all([createPost(profile1), createPost(profile2)])))
  .then(() => console.log('mongo is seeded with success!'))
  .then(() => process.exit(0))
  .catch((err) => console.error(err));
