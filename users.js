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
};


async function test() {
  console.info('test start --------------------------');
  const adminPlain = 'asdfasdf';
  const adminHashed = await hash(adminPlain);
  console.log(adminPlain, '>', adminHashed);
  console.log(await comparePasswords(adminPlain, adminHashed));
  const userPlain = '12341234';
  const userHashed = await hash(userPlain);
  console.log(userPlain, '>', userHashed);
  console.log(await comparePasswords(userPlain, userHashed));
  console.info('test end  --------------------------');

  const admin = await dbUsers.getUserByUserName('admin');
  console.log(admin);
  console.log(await comparePasswords(adminPlain, admin.password));
}
// test();
