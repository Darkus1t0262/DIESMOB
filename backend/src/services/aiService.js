const { pool } = require('../config/db');

async function anomalyCheck(vehicleId, liters) {
  const { rows } = await pool.query('SELECT tank_capacity FROM vehicles WHERE id=$1', [vehicleId]);
  if (!rows[0]) return { riskScore: 1, message: 'Vehicle not found' };
  const tankCapacity = Number(rows[0].tank_capacity);
  const { rows: history } = await pool.query('SELECT AVG(liters) as avg_liters, STDDEV(liters) as std_dev FROM fuel_transactions WHERE vehicle_id=$1', [vehicleId]);
  const avg = Number(history[0].avg_liters || 0);
  const std = Number(history[0].std_dev || 0);
  const threshold = avg + (std || tankCapacity * 0.1) + tankCapacity * 0.2;
  const suspicious = liters > Math.max(threshold, tankCapacity * 1.1);
  const riskScore = Math.min(1, liters / (threshold || tankCapacity));
  return {
    riskScore: Number(riskScore.toFixed(2)),
    suspicious,
    message: suspicious ? 'Fuel load exceeds normal range' : 'Fuel load within expected range',
  };
}

async function vehicleRisk(vehicleId) {
  const { rows } = await pool.query(
    `SELECT liters, datetime FROM fuel_transactions WHERE vehicle_id=$1 ORDER BY datetime DESC LIMIT 20`,
    [vehicleId],
  );
  if (rows.length === 0) return { riskScore: 0.1, message: 'No data yet' };
  const litersArr = rows.map((r) => Number(r.liters));
  const avg = litersArr.reduce((a, b) => a + b, 0) / litersArr.length;
  const last = litersArr[0];
  const variance = litersArr.reduce((acc, n) => acc + Math.pow(n - avg, 2), 0) / litersArr.length;
  const std = Math.sqrt(variance);
  const score = Math.min(1, (last - avg + std) / (avg + std || 1));
  return { riskScore: Number(score.toFixed(2)), message: 'Risk based on recent variance' };
}

module.exports = { anomalyCheck, vehicleRisk };
