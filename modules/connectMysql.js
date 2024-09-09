require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const mySQL = async (sql, params) => {
  try {
    const [result] = await pool.execute(sql, params);
    return result;
  } catch (error) {
    console.error('MySQL Query Error:', error.message);
    throw error;
  }
};

module.exports = { mySQL };
