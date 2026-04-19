const { Pool } = require('pg');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || process.env.DB_HOSTNAME,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 60000
};

if (process.env.DB_SSL === 'true') {
  dbConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(dbConfig);

const placeholderize = (query) => {
  let index = 0;
  return query.replace(/\?/g, () => `$${++index}`);
};

const wrapResult = (result, originalQuery) => {
  const adapted = {
    rows: result.rows,
    fields: result.fields,
    rowCount: result.rowCount,
    affectedRows: result.rowCount
  };

  if (/^\s*INSERT\s+/i.test(originalQuery) && result.rows && result.rows[0] && result.rows[0].id !== undefined) {
    adapted.insertId = result.rows[0].id;
  }

  return adapted;
};

const executeQuery = async (client, query, params = []) => {
  let pgQuery = query;
  const hasReturning = /\bRETURNING\b/i.test(query);

  if (/^\s*INSERT\s+/i.test(query) && !hasReturning) {
    pgQuery = query.replace(/;?\s*$/, ' RETURNING id');
  }

  pgQuery = placeholderize(pgQuery);
  const result = await client.query(pgQuery, params);
  return [result.rows, wrapResult(result, query)];
};

const createConnectionWrapper = (client) => ({
  execute: (query, params) => executeQuery(client, query, params),
  query: (query, params = []) => client.query(placeholderize(query), params),
  beginTransaction: async () => {
    await client.query('BEGIN');
  },
  commit: async () => {
    await client.query('COMMIT');
  },
  rollback: async () => {
    await client.query('ROLLBACK');
  },
  release: () => client.release()
});

const getPool = () => ({
  execute: (query, params) => executeQuery(pool, query, params),
  query: (query, params = []) => pool.query(placeholderize(query), params),
  getConnection: async () => createConnectionWrapper(await pool.connect()),
  end: () => pool.end()
});

module.exports = getPool;
module.exports.getConnection = async () => createConnectionWrapper(await pool.connect());

