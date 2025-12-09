const { pool } = require('../config/db');

async function createDriver(data) {
  const { name, documentId, phone, assignedVehicleId } = data;
  const { rows } = await pool.query(
    'INSERT INTO drivers (name, document_id, phone, assigned_vehicle_id) VALUES ($1,$2,$3,$4) RETURNING *',
    [name, documentId, phone, assignedVehicleId || null],
  );
  return rows[0];
}

async function listDrivers() {
  const { rows } = await pool.query('SELECT * FROM drivers ORDER BY created_at DESC');
  return rows;
}

module.exports = { createDriver, listDrivers };
