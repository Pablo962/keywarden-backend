// src/routes/orden_compra.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/orden_compra.controller.js');
const authMiddleware = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

// Aplicamos autenticación (JWT) a todas las rutas
router.use(authMiddleware);

// Roles
const admin = [1];
const adminYConsultor = [1, 2];

// Crear una Orden de Compra (Solo Admin)
router.post('/', checkRole(admin), controller.create);

// Leer todas las Órdenes (Admin y Consultor)
router.get('/', checkRole(adminYConsultor), controller.getAll);

// Leer una Orden completa con sus items (Admin y Consultor)
router.get('/:id', checkRole(adminYConsultor), controller.getById);

module.exports = router;