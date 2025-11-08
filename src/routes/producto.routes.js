// src/routes/producto.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/producto.controller.js');
const authMiddleware = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

// Aplicamos autenticación (JWT) a todas las rutas de productos
router.use(authMiddleware);

// Definimos los roles para cada acción
const admin = [1];
const adminYConsultor = [1, 2];

// Crear un producto (Solo Admin)
router.post('/', checkRole(admin), controller.create);

// Leer todos los productos (Admin y Consultor)
router.get('/', checkRole(adminYConsultor), controller.getAll);

// Leer un producto (Admin y Consultor) - Cumple R2
router.get('/:id', checkRole(adminYConsultor), controller.getById);

// Actualizar un producto (Solo Admin)
router.put('/:id', checkRole(admin), controller.update);

// Borrar (baja lógica) un producto (Solo Admin)
router.delete('/:id', checkRole(admin), controller.remove);

module.exports = router;