const { pool } = require('../config/db');

async function createStation(data) {
  const { name, location, code, active } = data;
  const { rows } = await pool.query(
    'INSERT INTO fuel_stations (name, location, code, active) VALUES ($1,$2,$3,$4) RETURNING *',
    [name, location, code, active ?? true],
  );
  return rows[0];
}

async function listStations() {
  const { rows } = await pool.query('SELECT * FROM fuel_stations ORDER BY created_at DESC');
  return rows;
}

module.exports = { createStation, listStations };
