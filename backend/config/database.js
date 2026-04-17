const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000
};

let pool;

const getPool = () => {
  if (!pool) {
    try {
      pool = mysql.createPool(dbConfig);
      console.log('Database pool created successfully');
    } catch (error) {
      console.error('Failed to create database pool:', error.message);
      throw error;
    }
  }
  return pool;
};

// Create a connection without specifying database for initial setup
const getConnection = () => {
  try {
    return mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectTimeout: 60000
    });
  } catch (error) {
    console.error('Failed to create database connection:', error.message);
    throw error;
  }
};

module.exports = getPool;
module.exports.getConnection = getConnection;