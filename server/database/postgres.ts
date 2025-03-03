import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Create a pool configuration with proper SSL settings
const pool = new Pool({
  host: 'amenities.postgres.database.azure.com',
  database: 'amenities',
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false // This allows connecting to servers with self-signed certificates
  }
});

export async function query(text: string, params?: any[]) {
  // Get a client from the pool
  let client;
  try {
    client = await pool.connect();
    // Execute the query
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    // Make sure to release the client before any error handling,
    // just in case the error handling itself throws an error
    if (client) {
      client.release();
    }
  }
}

// Add a function to test the connection
export async function testConnection() {
  try {
    const result = await query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}