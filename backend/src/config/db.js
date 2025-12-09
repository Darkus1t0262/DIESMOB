const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  // Registro en consola pero evitando datos sensibles
  console.error('Database pool error', err.message);
});

module.exports = { pool };
