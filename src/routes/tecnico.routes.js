// src/routes/tecnico.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/tecnico.controller.js');
const authMiddleware = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

router.use(authMiddleware);

const admin = [1];
const adminYConsultor = [1, 2];

router.post('/', checkRole(admin), controller.create);
router.get('/', checkRole(adminYConsultor), controller.getAll);
router.get('/:id', checkRole(adminYConsultor), controller.getById);
router.put('/:id', checkRole(admin), controller.update);
router.delete('/:id', checkRole(admin), controller.remove); // Llama a la nueva 'remove'

module.exports = router;