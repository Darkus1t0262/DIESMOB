const { pool } = require('../config/db');

async function createFuelTransaction(data) {
  const { vehicleId, stationId, driverId, datetime, liters, pricePerLiter, totalCost, subsidized, notes } = data;
  const { rows } = await pool.query(
    'INSERT INTO fuel_transactions (vehicle_id, station_id, driver_id, datetime, liters, price_per_liter, total_cost, subsidized, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
    [vehicleId, stationId, driverId, datetime, liters, pricePerLiter, totalCost, subsidized ?? true, notes || null],
  );
  return rows[0];
}

async function listFuelTransactions() {
  const { rows } = await pool.query(
    `SELECT fuel_transactions.*, vehicles.plate, drivers.name AS driver_name, fuel_stations.name AS station_name
     FROM fuel_transactions
     JOIN vehicles ON vehicles.id = fuel_transactions.vehicle_id
     JOIN drivers ON drivers.id = fuel_transactions.driver_id
     JOIN fuel_stations ON fuel_stations.id = fuel_transactions.station_id
     ORDER BY fuel_transactions.created_at DESC`
  );
  return rows;
}

async function findTransactionsByVehicle(vehicleId) {
  const { rows } = await pool.query(
    `SELECT * FROM fuel_transactions WHERE vehicle_id=$1 ORDER BY datetime DESC`,
    [vehicleId],
  );
  return rows;
}

module.exports = { createFuelTransaction, listFuelTransactions, findTransactionsByVehicle };
