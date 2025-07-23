import sql from 'mssql';

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER!,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false, // Use true for Azure SQL Database, or if you have an SSL certificate
    trustServerCertificate: true, // Change to false for production with a trusted certificate
  },
};

let pool: sql.ConnectionPool;

export async function getConnection() {
  if (!pool) {
    try {
      pool = await sql.connect(sqlConfig);
    } catch (err) {
      console.error('Database connection failed:', err);
      // The app will not be able to function without a DB connection.
      // You can add more robust error handling here.
      throw new Error('Failed to connect to the database.');
    }
  }
  return pool.request();
}
