const bcrypt = require('bcrypt');
const dbUsers = require('./dbUsers');

async function hash(plainPassword) {
  return bcrypt.hash(plainPassword, 11);
}


async function comparePasswords(plainPassword, hashed) {
  const result = await bcrypt.compare(plainPassword, hashed);

  return result;
}


module.exports = {
  db: dbUsers,
  hash,
  comparePasswords,
};


// eslint-disable-next-line no-unused-vars
async function test() {
  console.info('test start --------------------------');
  const adminPlain = 'asdfasdf';
  const adminHashed = await hash(adminPlain);
  console.info(adminPlain, '>', adminHashed);
  console.info(await comparePasswords(adminPlain, adminHashed));
  const userPlain = '12341234';
  const userHashed = await hash(userPlain);
  console.info(userPlain, '>', userHashed);
  console.info(await comparePasswords(userPlain, userHashed));
  console.info('test end  --------------------------');

  const admin = await dbUsers.getUserByusername('admin');
  console.info(admin);
  console.info('pass match >', await comparePasswords(adminPlain, admin.password));
}
// test();
