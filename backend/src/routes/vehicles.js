const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { createVehicle, listVehicles, findVehicle, updateVehicle } = require('../services/vehicleService');

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  authorizeRoles(['ADMIN', 'FLEET_MANAGER']),
  [
    body('plate').notEmpty(),
    body('model').notEmpty(),
    body('brand').notEmpty(),
    body('tankCapacity').isNumeric(),
    body('fuelType').notEmpty(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const vehicle = await createVehicle(req.body);
      res.status(201).json(vehicle);
    } catch (err) {
      next(err);
    }
  }
);

router.get('/', authenticateToken, authorizeRoles(['ADMIN', 'FLEET_MANAGER', 'STATION_OPERATOR', 'DRIVER']), async (req, res, next) => {
  try {
    const vehicles = await listVehicles();
    res.json(vehicles);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const vehicle = await findVehicle(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Not found' });
    res.json(vehicle);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticateToken, authorizeRoles(['ADMIN', 'FLEET_MANAGER']), async (req, res, next) => {
  try {
    const updated = await updateVehicle(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/image', authenticateToken, authorizeRoles(['ADMIN', 'FLEET_MANAGER']), upload.single('image'), async (req, res, next) => {
  try {
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const updated = await updateVehicle(req.params.id, { imageUrl: fileUrl });
    if (!updated) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ imageUrl: fileUrl });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
