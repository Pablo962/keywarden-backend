// src/routes/incidente.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/incidente.controller.js');
const authMiddleware = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

// Aplicamos autenticación (JWT) a todas las rutas
router.use(authMiddleware);

// Roles
const admin = [1];
const adminYConsultor = [1, 2]; // Asumo que 2=Consultor

// --- CRUD BÁSICO ---

// Crear un incidente (Admin y Consultor pueden reportar)
router.post('/', checkRole(adminYConsultor), controller.create);

// Leer todos (Admin y Consultor)
router.get('/', checkRole(adminYConsultor), controller.getAll);

// Leer uno (Admin y Consultor)
router.get('/:id', checkRole(adminYConsultor), controller.getById);

// Actualizar descripción (Solo Admin)
router.put('/:id', checkRole(admin), controller.update);

// Eliminar un incidente (Solo Admin)
router.delete('/:id', checkRole(admin), controller.remove);

// --- FLUJO DE TRABAJO (R7) ---

// Asignar un técnico (Solo Admin)
router.post('/:id/asignar', checkRole(admin), controller.asignar);

// Resolver un incidente (Solo Admin)
router.post('/:id/resolver', checkRole(admin), controller.resolver);

module.exports = router;