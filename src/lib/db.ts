import mysql from 'mysql2/promise';

const sqlConfig = {
  host: 'srv1521.hstgr.io',
  user: 'u311154254_TADB',
  password: 'Anglo!123456',
  database: 'u311154254_TestAttendance',
  connectTimeout: 10000, // 10 seconds
};

let pool: mysql.Pool;

const MAX_RETRIES = 5;
const RETRY_DELAY = 2000; // 2 seconds

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getConnection() {
  if (pool) {
    return pool;
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      pool = mysql.createPool(sqlConfig);
      // Try to get a connection to see if the pool is valid
      const connection = await pool.getConnection();
      connection.release();
      console.log('Database connection successful!');
      return pool;
    } catch (err: any) {
      console.error(`Database connection attempt ${attempt} failed:`, err.message);
      if (attempt === MAX_RETRIES) {
        throw new Error(`Failed to connect to the database after ${MAX_RETRIES} attempts.`);
      }
      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
      await sleep(RETRY_DELAY);
    }
  }
  // This line should be unreachable, but typescript needs it to know a value is always returned.
  throw new Error('Failed to connect to the database.');
}
