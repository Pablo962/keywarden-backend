// src/routes/proveedor.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/proveedor.controller');

// Importamos AMBOS middlewares
const authMiddleware = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

// ¡IMPORTANTE!
// Aplicamos el 'authMiddleware' (autenticación) a TODAS las rutas.
// Nadie sin un token válido puede siquiera intentar acceder.
router.use(authMiddleware);

// --- APLICACIÓN DE ROLES (AUTORIZACIÓN) ---

// (CU02) Crear: Solo Administradores (Rol 1)
// Express nos permite pasar un array de middlewares.
router.post('/', checkRole([1]), controller.create);

// Leer Todos: Administradores (1) y Consultores (2)
router.get('/', checkRole([1, 2]), controller.getAll);

// Leer Uno: Administradores (1) y Consultores (2)
router.get('/:id', checkRole([1, 2]), controller.getById);

// (CU03) Modificar: Solo Administradores (Rol 1)
router.put('/:id', checkRole([1]), controller.update);

// (CU04) Baja: Solo Administradores (Rol 1)
router.delete('/:id', checkRole([1]), controller.remove);

module.exports = router;