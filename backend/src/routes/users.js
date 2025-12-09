const express = require('express');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { listUsers } = require('../services/userService');

const router = express.Router();

router.get('/', authenticateToken, authorizeRoles(['ADMIN']), async (req, res, next) => {
  try {
    const users = await listUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
