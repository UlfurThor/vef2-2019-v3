require('dotenv').config();

const {
  query,
} = require('./db');

/**
 * Inserts new row into table applications
 * @param {inserted data} data
 */
async function createApplication(data) {
  const queryString = `
  INSERT INTO applications
  (name, email, phone, comment, jobTitle)
  VALUES ( $1, $2, $3, $4, $5)`;
  const queryData = [
    data.name, // $1
    data.email, // $2
    data.phone, // $3
    data.comment, // $4
    data.jobTitle, // $5
  ];
  try {
    return query(queryString, queryData);
  } catch (err) {
    throw new Error('error creating application');
  }
}

/**
 * Returns the content of table applications, ordered by id
 */
async function readApplications() {
  const queryString = `
    SELECT *
    FROM applications
    WHERE deleted IS NULL
    ORDER BY id;
    `;
  try {
    const result = await query(queryString);
    return result.rows;
  } catch (err) {
    throw new Error('error reading table applications');
  }
}

/**
 * Sets the selected application to processed,
 *  and updates the updated timestamp
 * @param {id for application to be updated} id
 */
async function updateApplications(id) {
  const queryString = `
  UPDATE applications
  SET
    processed = true,
    updated = current_timestamp
  WHERE
    id = $1 AND
    deleted IS NULL
  `;

  try {
    return await query(queryString, [id]);
  } catch (err) {
    throw new Error('error updating application');
  }
}

/**
 * Deletes the selected application
 * @param {id key for aplication to be removed} key
 */
async function deleteApplications(id) {
  /*
  const queryString = `
  DELETE FROM applications
  WHERE id = $1
  `;
  */
  const queryString = `
  UPDATE applications
  SET deleted = current_timestamp
  WHERE
    id = $1 AND
    deleted IS NULL
  `;

  try {
    return await query(queryString, [id]);
  } catch (err) {
    throw new Error('error deleting application');
  }
}

module.exports = {
  createApplication,
  readApplications,
  updateApplications,
  deleteApplications,
};

// eslint-disable-next-line no-unused-vars
async function test() {
  const data = await readApplications();
  console.info('test start --------------------------');
  console.info(data);
  console.info('test end  --------------------------');
}
// test(); // used to test reading the database, red evry time the page is saved
