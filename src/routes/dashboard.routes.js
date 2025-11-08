// src/routes/dashboard.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard.controller.js');
const authMiddleware = require('../middleware/auth.middleware.js');
const checkRole = require('../middleware/role.middleware.js');

// Aplicamos autenticación (JWT) a todas las rutas
router.use(authMiddleware);

// Roles que pueden ver el dashboard (R10)
const adminYConsultor = [1, 2];

/**
 * GET /api/dashboard/
 * Endpoint principal para R10 y Reportes Ejecutivos.
 */
router.get('/', checkRole(adminYConsultor), controller.getReporte);

module.exports = router;