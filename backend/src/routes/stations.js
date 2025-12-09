const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { createStation, listStations } = require('../services/stationService');

const router = express.Router();

router.post('/', authenticateToken, authorizeRoles(['ADMIN', 'FLEET_MANAGER']), [body('name').notEmpty(), body('code').notEmpty()], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const station = await createStation(req.body);
    res.status(201).json(station);
  } catch (err) {
    next(err);
  }
});

router.get('/', authenticateToken, authorizeRoles(['ADMIN', 'FLEET_MANAGER', 'STATION_OPERATOR']), async (req, res, next) => {
  try {
    const stations = await listStations();
    res.json(stations);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
