const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { createDriver, listDrivers } = require('../services/driverService');

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  authorizeRoles(['ADMIN', 'FLEET_MANAGER']),
  [body('name').notEmpty(), body('documentId').notEmpty()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const driver = await createDriver(req.body);
      res.status(201).json(driver);
    } catch (err) {
      next(err);
    }
  }
);

router.get('/', authenticateToken, authorizeRoles(['ADMIN', 'FLEET_MANAGER', 'STATION_OPERATOR']), async (req, res, next) => {
  try {
    const drivers = await listDrivers();
    res.json(drivers);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
