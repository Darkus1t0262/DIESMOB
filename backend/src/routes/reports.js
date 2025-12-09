const express = require('express');
const { query, validationResult } = require('express-validator');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { consumptionByVehicle, consumptionByDriver } = require('../services/reportService');

const router = express.Router();

router.get('/vehicle', authenticateToken, authorizeRoles(['ADMIN', 'FLEET_MANAGER']), [query('start').isISO8601(), query('end').isISO8601()], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const rows = await consumptionByVehicle(req.query.start, req.query.end);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/driver', authenticateToken, authorizeRoles(['ADMIN', 'FLEET_MANAGER']), [query('start').isISO8601(), query('end').isISO8601()], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const rows = await consumptionByDriver(req.query.start, req.query.end);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
