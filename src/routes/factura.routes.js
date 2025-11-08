// src/routes/factura.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/factura.controller.js');
const authMiddleware = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

// Aplicamos autenticación (JWT) a todas las rutas
router.use(authMiddleware);

// Roles
const admin = [1];
const adminYConsultor = [1, 2];

// Cargar una Factura (Solo Admin)
router.post('/', checkRole(admin), controller.create);

// Leer todas las Facturas (Admin y Consultor)
router.get('/', checkRole(adminYConsultor), controller.getAll);

// Leer una Factura completa (detalles y cuotas) (Admin y Consultor)
router.get('/:id', checkRole(adminYConsultor), controller.getById);

// Pagar una cuota específica (R5 - Solo Admin)
router.put('/cuotas/:id/pagar', checkRole(admin), controller.pagarCuota);

module.exports = router;