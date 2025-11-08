// src/routes/calificacion.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/calificacion.controller.js');
const authMiddleware = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

// Aplicamos autenticación (JWT) a todas las rutas
router.use(authMiddleware);

// Roles
const admin = [1];
const adminYConsultor = [1, 2];

// Registrar una nueva calificación (Solo Admin)
router.post('/', checkRole(admin), controller.create);

// Ver todas las calificaciones (Admin y Consultor)
router.get('/', checkRole(adminYConsultor), controller.getAll);

// Ver todas las calificaciones de un proveedor (Admin y Consultor)
router.get('/proveedor/:proveedorId', checkRole(adminYConsultor), controller.getAllByProveedor);

// (R3/R10) Ver el promedio de un proveedor (Admin y Consultor)
router.get('/proveedor/:proveedorId/promedio', checkRole(adminYConsultor), controller.getPromedio);

module.exports = router;