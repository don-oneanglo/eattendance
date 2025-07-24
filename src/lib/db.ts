import mysql from 'mysql2/promise';

const sqlConfig = {
  host: 'srv1521.hstgr.io',
  user: 'u311154254_TADB',
  password: 'Anglo!123456',
  database: 'u311154254_TestAttendance',
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
