// src/routes/auth.routes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Ruta para registro
// POST /api/auth/register
router.post('/register', authController.register);

// Ruta para login
// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;