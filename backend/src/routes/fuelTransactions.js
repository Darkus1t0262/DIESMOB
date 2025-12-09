const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { createFuelTransaction, listFuelTransactions } = require('../services/fuelService');
const { findVehicle } = require('../services/vehicleService');

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  authorizeRoles(['ADMIN', 'STATION_OPERATOR', 'FLEET_MANAGER']),
  [body('vehicleId').notEmpty(), body('stationId').notEmpty(), body('driverId').notEmpty(), body('datetime').notEmpty(), body('liters').isNumeric(), body('pricePerLiter').isNumeric()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const vehicle = await findVehicle(req.body.vehicleId);
      if (!vehicle) return res.status(400).json({ message: 'Invalid vehicle' });
      if (Number(req.body.liters) > Number(vehicle.tank_capacity) * 1.2) {
        return res.status(400).json({ message: 'Liters exceed tank capacity threshold' });
      }
      const totalCost = Number(req.body.liters) * Number(req.body.pricePerLiter);
      const tx = await createFuelTransaction({ ...req.body, totalCost });
      res.status(201).json(tx);
    } catch (err) {
      next(err);
    }
  }
);

router.get('/', authenticateToken, authorizeRoles(['ADMIN', 'FLEET_MANAGER', 'STATION_OPERATOR']), async (req, res, next) => {
  try {
    const txs = await listFuelTransactions();
    res.json(txs);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
