const { pool } = require('../config/db');

async function findUserByEmail(email) {
  const { rows } = await pool.query('SELECT users.id, email, password_hash, full_name, roles.name as role FROM users JOIN roles ON roles.id = users.role_id WHERE email = $1', [email]);
  return rows[0];
}

async function createUser({ email, passwordHash, fullName, roleName }) {
  const roleResult = await pool.query('SELECT id FROM roles WHERE name = $1', [roleName]);
  if (roleResult.rowCount === 0) {
    throw new Error('Invalid role');
  }
  const roleId = roleResult.rows[0].id;
  const { rows } = await pool.query(
    'INSERT INTO users (email, password_hash, full_name, role_id) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name',
    [email, passwordHash, fullName, roleId],
  );
  return rows[0];
}

async function listUsers() {
  const { rows } = await pool.query('SELECT users.id, email, full_name, roles.name as role FROM users JOIN roles ON roles.id = users.role_id ORDER BY created_at DESC');
  return rows;
}

module.exports = { findUserByEmail, createUser, listUsers };
