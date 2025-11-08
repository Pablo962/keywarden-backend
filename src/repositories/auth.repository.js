// src/repositories/auth.repository.js

const pool = require('../config/db');

const findUserByEmail = async (email) => {
  const [rows] = await pool.execute(
    'SELECT * FROM usuario WHERE email = ?',
    [email]
  );
  return rows[0];
};

/**
 * 1. RECIBE id_usuario como PRIMER argumento
 */
const createUser = async (nombre, email, hashedPassword, rolId) => {
  
  const [result] = await pool.execute(
    'INSERT INTO usuario (nombre, email, password, rol_id_rol) VALUES (?, ?, ?, ?)',
    [
      nombre,
      email,
      hashedPassword,
      rolId
    ]
  );

  return result.insertId;
};

module.exports = {
  findUserByEmail,
  createUser,
};