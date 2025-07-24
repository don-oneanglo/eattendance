
import sql from 'mssql';

const sqlConfig = {
  server: 'srv1521.hstgr.io',
  user: 'u311154254_TADB',
  password: 'Anglo!123456',
  database: 'u311154254_TestAttendance',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // For Azure
    trustServerCertificate: true, // Change to true for local dev / self-signed certs
    connectionTimeout: 15000,
  }
};

let pool: sql.ConnectionPool;

const MAX_RETRIES = 5;
const RETRY_DELAY = 2000; // 2 seconds

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getConnection() {
  if (pool && pool.connected) {
    return pool;
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      pool = new sql.ConnectionPool(sqlConfig);
      await pool.connect();
      console.log('Database connection successful!');
      return pool;
    } catch (err: any) {
      console.error(`Database connection attempt ${attempt} failed:`, err.message);
      if (pool && !pool.connecting) {
        // Ensure pool is closed on failure only if it's not in the middle of connecting
        await pool.close();
      }
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

// Export sql object for use in transactions and queries
export { sql };
