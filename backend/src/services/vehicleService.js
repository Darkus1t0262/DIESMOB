const { pool } = require('../config/db');

async function createVehicle(data) {
  const { plate, model, brand, tankCapacity, fuelType, imageUrl, status } = data;
  const { rows } = await pool.query(
    'INSERT INTO vehicles (plate, model, brand, tank_capacity, fuel_type, image_url, status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
    [plate, model, brand, tankCapacity, fuelType, imageUrl || null, status || 'ACTIVE'],
  );
  return rows[0];
}

async function listVehicles() {
  const { rows } = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC');
  return rows;
}

async function findVehicle(id) {
  const { rows } = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
  return rows[0];
}

async function updateVehicle(id, data) {
  const existing = await findVehicle(id);
  if (!existing) return null;
  const merged = { ...existing, ...data };
  const { rows } = await pool.query(
    'UPDATE vehicles SET plate=$1, model=$2, brand=$3, tank_capacity=$4, fuel_type=$5, image_url=$6, status=$7 WHERE id=$8 RETURNING *',
    [merged.plate, merged.model, merged.brand, merged.tank_capacity || merged.tankCapacity, merged.fuel_type || merged.fuelType, merged.image_url || merged.imageUrl, merged.status, id],
  );
  return rows[0];
}

module.exports = { createVehicle, listVehicles, findVehicle, updateVehicle };
