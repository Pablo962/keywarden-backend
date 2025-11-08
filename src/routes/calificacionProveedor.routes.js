// src/routes/calificacionProveedor.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/calificacionProveedor.controller');
const authMiddleware = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

// Aplicamos autenticación (JWT) a todas las rutas
router.use(authMiddleware);

// Roles
const admin = [1];
const adminYConsultor = [1, 2];

// Registrar una nueva calificación de proveedor (Solo Admin)
router.post('/', checkRole(admin), controller.create);

// Ver todas las calificaciones de proveedores (Admin y Consultor)
router.get('/', checkRole(adminYConsultor), controller.getAll);

// Ver el resumen de calificaciones de todos los proveedores (Admin y Consultor)
router.get('/resumen', checkRole(adminYConsultor), controller.getResumen);

// Ver todas las calificaciones de un proveedor específico (Admin y Consultor)
router.get('/proveedor/:proveedorId', checkRole(adminYConsultor), controller.getByProveedor);

module.exports = router;
