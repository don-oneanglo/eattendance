import sql from 'mssql';

const sqlConfig = {
  server: 'DATABASE',
  user: 'sa',
  password: 'AngloSingapore2014',
  database: 'TestAttendanceDB',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // For Azure
    trustServerCertificate: true, // Change to true for local dev / self-signed certs
    connectionTimeout: 30000, // 30 seconds
  }
};

let pool: sql.ConnectionPool;

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
      pool = new sql.ConnectionPool(sqlConfig);
      await pool.connect();
      console.log('Database connection successful!');
      return pool;
    } catch (err: any) {
      console.error(`Database connection attempt ${attempt} failed:`, err.message);
      if (pool) {
        // Ensure pool is closed on failure
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
