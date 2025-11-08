// src/routes/calificacionTecnico.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/calificacionTecnico.controller');
const authMiddleware = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

// Aplicamos autenticación (JWT) a todas las rutas
router.use(authMiddleware);

// Roles
const admin = [1];
const adminYConsultor = [1, 2];

// Registrar una nueva calificación de técnico (Solo Admin)
router.post('/', checkRole(admin), controller.create);

// Ver todas las calificaciones de técnicos (Admin y Consultor)
router.get('/', checkRole(adminYConsultor), controller.getAll);

// Ver el resumen de calificaciones de todos los técnicos (Admin y Consultor)
router.get('/resumen', checkRole(adminYConsultor), controller.getResumen);

// Ver todas las calificaciones de un técnico específico (Admin y Consultor)
router.get('/tecnico/:tecnicoId', checkRole(adminYConsultor), controller.getByTecnico);

module.exports = router;
