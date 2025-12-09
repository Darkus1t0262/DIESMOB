const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { anomalyCheck, vehicleRisk } = require('../services/aiService');

const router = express.Router();

router.post('/anomaly-check', authenticateToken, authorizeRoles(['ADMIN', 'FLEET_MANAGER', 'STATION_OPERATOR']), [body('vehicleId').notEmpty(), body('liters').isNumeric()], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const result = await anomalyCheck(req.body.vehicleId, Number(req.body.liters));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/vehicle-risk/:vehicleId', authenticateToken, authorizeRoles(['ADMIN', 'FLEET_MANAGER']), async (req, res, next) => {
  try {
    const result = await vehicleRisk(req.params.vehicleId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
