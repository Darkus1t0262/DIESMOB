const { pool } = require('../config/db');

async function consumptionByVehicle(startDate, endDate) {
  const { rows } = await pool.query(
    `SELECT vehicle_id, SUM(liters) as total_liters, SUM(total_cost) as total_cost
     FROM fuel_transactions
     WHERE datetime BETWEEN $1 AND $2
     GROUP BY vehicle_id`,
    [startDate, endDate],
  );
  return rows;
}

async function consumptionByDriver(startDate, endDate) {
  const { rows } = await pool.query(
    `SELECT driver_id, SUM(liters) as total_liters, SUM(total_cost) as total_cost
     FROM fuel_transactions
     WHERE datetime BETWEEN $1 AND $2
     GROUP BY driver_id`,
    [startDate, endDate],
  );
  return rows;
}

module.exports = { consumptionByVehicle, consumptionByDriver };
