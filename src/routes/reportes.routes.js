// src/routes/reportes.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportes.controller.js');
const authMiddleware = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

// Aplicamos autenticación (JWT) a todas las rutas
router.use(authMiddleware);

// Roles que pueden ver reportes (Admin y Consultor)
const adminYConsultor = [1, 2];

/**
 * REPORTES EJECUTIVOS
 * Todos los endpoints para toma de decisiones
 */

// Ranking de proveedores por calificación (R3)
router.get('/ranking-proveedores', checkRole(adminYConsultor), controller.getRankingProveedores);

// Incidentes por proveedor (R7)
router.get('/incidentes/proveedor/:id', checkRole(adminYConsultor), controller.getIncidentesPorProveedor);

// Incidentes por producto (R7)
router.get('/incidentes/producto/:id', checkRole(adminYConsultor), controller.getIncidentesPorProducto);

// Desempeño de técnicos (R4/R7)
router.get('/tecnicos/desempeno', checkRole(adminYConsultor), controller.getDesempenoTecnicos);

// Reporte financiero por proveedor (R5/R9)
router.get('/financiero/proveedor/:id', checkRole(adminYConsultor), controller.getFinancieroPorProveedor);

// Productos por estado de garantía (R2)
router.get('/productos/garantias', checkRole(adminYConsultor), controller.getProductosGarantia);

module.exports = router;
