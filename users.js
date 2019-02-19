const bcrypt = require('bcrypt');
const dbUsers = require('./dbUsers');

async function hash(password) {
  return bcrypt.hash(password, 10);
}

module.exports = {
  db: dbUsers,
  hash,
};
