require('dotenv').config();

const {
  query,
} = require('./db');

/**
 * Inserts new row into table users
 * @param {inserted data} data
 */
async function createUser(data) {
  const queryString = `
  INSERT INTO users
  (
    username,
    name,
    password,
    email,
    passwordPLAIN
    )
  VALUES ( $1, $2, $3, $4, $5)`;
  const queryData = [
    data.username, // $1
    data.name, // $2
    data.hashedPass, // $3
    data.email, // $4
    data.password01, // $3
  ];
  try {
    return query(queryString, queryData);
  } catch (err) {
    throw new Error('error creating user');
  }
}

/**
 * Returns the content of table Users, ordered by id
 */
async function readUsers() {
  const queryString = `
    SELECT *
    FROM users
    WHERE deleted IS NULL
    ORDER BY id;
    `;
  try {
    const result = await query(queryString);
    return result.rows;
  } catch (err) {
    throw new Error('error reading table Users');
  }
}

/**
 * returns the user with selected username
 * @param {*} username
 */
async function getUserByusername(username) {
  const queryString = `
    SELECT *
    FROM users
    WHERE
      deleted IS NULL AND
      username = $1
    ORDER BY id;
    `;
  try {
    const result = await query(queryString, [username]);
    return result.rows[0];
  } catch (err) {
    throw new Error('error reading table Users');
  }
}

/**
 * returns the user with selected username
 * @param {*} username
 */
async function getUserByID(id) {
  const queryString = `
    SELECT *
    FROM users
    WHERE
      deleted IS NULL AND
      id = $1
    ORDER BY id;
    `;
  try {
    const result = await query(queryString, [id]);
    return result.rows[0];
  } catch (err) {
    throw new Error('error reading table Users');
  }
}

/**
 * Returns true if the given username is taken
 * @param {*} username
 */
async function getIfusernameTaken(username) {
  const queryString = `
    SELECT id
    FROM users
    WHERE username = $1;
    `;
  try {
    const result = await query(queryString, [username]);
    if (result.rowCount === 0) {
      return false;
    }
    return true;
  } catch (err) {
    throw new Error('error reading table Users');
  }
}

/**
 * Returns true if the given username is taken
 * @param {*} username
 */
async function getIfEmailTaken(email) {
  const queryString = `
    SELECT id
    FROM users
    WHERE email = $1;
    `;
  try {
    const result = await query(queryString, [email]);
    if (result.rowCount === 0) {
      return false;
    }
    return true;
  } catch (err) {
    throw new Error('error reading table Users');
  }
}


async function getByAdmin(admin) {
  const queryString = `
    SELECT id
    FROM users
    WHERE admin = $1;
    `;
  try {
    const result = await query(queryString, [admin]);
    return result.rows;
  } catch (err) {
    throw new Error('error reading table Users');
  }
}

async function updateUser(id, admin) {
  const queryString = `
  UPDATE Users
  SET
    admin = $1,
    updated = current_timestamp
  WHERE
    id = $2 AND
    deleted IS NULL
  `;

  try {
    return await query(queryString, [admin, id]);
  } catch (err) {
    throw new Error('error updating User');
  }
}

async function updateUsers(admin = []) {
  let adminList = await getByAdmin(true);
  adminList = adminList.map(x => x.id);
  let nonadminList = await getByAdmin(false);
  nonadminList = nonadminList.map(x => x.id);

  const newAdmin = admin.filter(x => nonadminList.includes(x));
  const newUser = adminList.filter(x => !admin.includes(x));

  newAdmin.forEach(async (id) => {
    await updateUser(id, true);
  });

  newUser.forEach(async (id) => {
    await updateUser(id, false);
  });
}

/**
 * Deletes the selected User
 * @param {id key for aplication to be removed} key
 */
async function deleteUsers(id) {
  /*
  const queryString = `
  DELETE FROM Users
  WHERE id = $1
  `;
  */
  const queryString = `
  UPDATE Users
  SET deleted = current_timestamp
  WHERE
    id = $1 AND
    deleted IS NULL
  `;

  try {
    return await query(queryString, [id]);
  } catch (err) {
    throw new Error('error deleting User');
  }
}

module.exports = {
  createUser,
  readUsers,
  updateUsers,
  deleteUsers,
  getIfusernameTaken,
  getIfEmailTaken,
  getUserByusername,
  getUserByID,
};

// eslint-disable-next-line no-unused-vars
async function test() {
  const data = await readUsers();
  console.info('test start --------------------------');
  console.info(data);
  const exists = await getIfEmailTaken('admin');
  console.info(exists);
  console.info('test end  --------------------------');
}
// test(); // used to test reading the database, red evry time the page is saved
