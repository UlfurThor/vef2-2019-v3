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
  (username, name, password, email)
  VALUES ( $1, $2, $3, $4)`;
  const queryData = [
    data.userName, // $1
    data.name, // $2
    data.email, // $2
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
 * Returns true if the given username is taken
 * @param {*} username
 */
async function getIfUsernameTaken(username) {
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
 * Sets the selected User to processed,
 *  and updates the updated timestamp
 * @param {id for User to be updated} id
 */
async function updateUsers(id, admin) {
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
  getIfUsernameTaken,
};

// eslint-disable-next-line no-unused-vars
async function test() {
  const data = await readUsers();
  console.info('test start --------------------------');
  console.info(data);
  const exists = await getIfUsernameTaken('admin');
  console.info(exists);
  console.info('test end  --------------------------');
}
// test(); // used to test reading the database, red evry time the page is saved
