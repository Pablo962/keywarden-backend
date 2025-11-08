// src/routes/alertas.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/alertas.controller.js');
const authMiddleware = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

// Aplicamos autenticación (JWT) a todas las rutas
router.use(authMiddleware);

// Roles que pueden ver reportes
const adminYConsultor = [1, 2];

/**
 * GET /api/alertas/vencimientos
 * Endpoint para R5/CU14.
 * Acepta un query param opcional: ?dias=X
 */
router.get('/vencimientos', checkRole(adminYConsultor), controller.getVencimientos);

/**
 * GET /api/alertas/garantias
 * Endpoint para R2 - Garantías próximas a vencer.
 * Acepta un query param opcional: ?dias=X (default: 30)
 */
router.get('/garantias', checkRole(adminYConsultor), controller.getGarantias);

module.exports = router;