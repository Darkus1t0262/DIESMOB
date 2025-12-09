const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../services/userService');
require('dotenv').config();

const router = express.Router();

router.post(
  '/register',
  [body('email').isEmail(), body('password').isLength({ min: 6 }), body('fullName').notEmpty(), body('role').notEmpty()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password, fullName, role } = req.body;
      const existing = await findUserByEmail(email);
      if (existing) {
        return res.status(409).json({ message: 'Email already exists' });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await createUser({ email, passwordHash, fullName, roleName: role });
      res.status(201).json({ id: user.id, email: user.email, fullName: user.full_name });
    } catch (err) {
      next(err);
    }
  }
);

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, fullName: user.full_name } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
