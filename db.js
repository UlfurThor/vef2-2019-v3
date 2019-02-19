require('dotenv').config();

/**
 * Handles conection to database
 * Functions for individual tables
 *    are handled in classes
 *    dbApplications and dbUsers
 */

const connectionString = process.env.DATABASE_URL;
const {
  Client,
} = require('pg');


async function query(q, values = []) {
  console.info(`test db: ${connectionString}`);

  const client = new Client({
    connectionString,
  });

  await client.connect();

  try {
    const result = await client.query(q, values);

    return result;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

module.exports = {
  query,
};
