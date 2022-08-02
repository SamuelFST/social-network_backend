/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const http = require('http');
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const { User: UserModel } = require('./models');

const pubsub = require('./lib/pubsub');
const app = require('./app');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'someSuperSecretToken123';
const port = process.env.PORT || 4000;

const server = http.Server(app);
const io = socketio(server, {
  cors: {
    origin: '*',
  },
});

const liveData = io.of('/v1');

liveData.use((socket, next) => {
  if (socket.handshake.auth && socket.handshake.auth.token) {
    jwt.verify(socket.handshake.auth.token, accessTokenSecret, (err, user) => {
      if (err) {
        return next(new Error('Authentication error'));
      }
      UserModel.findOne({ _id: user._id }).populate('profile')
        .then((u) => {
          if (u) {
            socket.profile = u.profile;
            next();
          } else {
            next(new Error('Authentication error'));
          }
        });
    });
  } else {
    next(new Error('Authentication error'));
  }
});

liveData.on('connection', (socket) => {
  console.warn(`a user connected live ${socket.profile.name}`);

  socket.on('disconnect', () => {
    console.log(socket.connected);
  });
  socket.on('error', (err) => {
    console.error(err);
  });
  socket.emit('connected_profile', socket.profile);
});

pubsub.sub().then((sub) => {
  sub.on('message', (message, content, ackOrNack) => {
    ackOrNack();
    Object.entries(Object.fromEntries(liveData.sockets))
      .filter(([, v]) => content.keys.includes(v.profile._id.toString()))
      .map(([k, v]) => {
        return v.emit(content.type, content.payload);
      });
  });
}).catch((err) => console.error(err));

server.listen(port, () => {
  console.log(`server running on http://localhost:${port}/api-docs`);
});
