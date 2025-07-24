import mysql from 'mysql2/promise';

const sqlConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

let pool: mysql.Pool;

export async function getConnection() {
  if (!pool) {
    try {
      pool = mysql.createPool(sqlConfig);
    } catch (err) {
      console.error('Database connection failed:', err);
      // The app will not be able to function without a DB connection.
      // You can add more robust error handling here.
      throw new Error('Failed to connect to the database.');
    }
  }
  return pool;
}
