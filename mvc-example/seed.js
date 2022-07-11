const { Redact, Connection } = require('./models');

module.exports = Connection
  .then(() => Promise.all([
    'teste',
    'admin',
    'abc',
  ].map((term) => new Redact({ term }).save())))
  .then(() => console.log('mongo is seeded with terms'));
