// src/controllers/reportes.controller.js

const reportesService = require('../services/reportes.service.js');

/**
 * GET /api/reportes/ranking-proveedores?limit=10
 * Ranking de proveedores por calificación (R3).
 */
const getRankingProveedores = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const ranking = await reportesService.getRankingProveedores(limit);
    res.status(200).json({
      reporte: 'Ranking de Proveedores',
      top: limit,
      proveedores: ranking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar ranking: ' + error.message });
  }
};

/**
 * GET /api/reportes/incidentes/proveedor/:id
 * Incidentes de un proveedor (R7).
 */
const getIncidentesPorProveedor = async (req, res) => {
  try {
    const incidentes = await reportesService.getIncidentesPorProveedor(req.params.id);
    res.status(200).json({
      reporte: 'Incidentes por Proveedor',
      proveedor_id: req.params.id,
      total_incidentes: incidentes.length,
      incidentes: incidentes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar reporte: ' + error.message });
  }
};

/**
 * GET /api/reportes/incidentes/producto/:id
 * Incidentes de un producto (R7).
 */
const getIncidentesPorProducto = async (req, res) => {
  try {
    const incidentes = await reportesService.getIncidentesPorProducto(req.params.id);
    res.status(200).json({
      reporte: 'Incidentes por Producto',
      producto_id: req.params.id,
      total_incidentes: incidentes.length,
      incidentes: incidentes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar reporte: ' + error.message });
  }
};

/**
 * GET /api/reportes/tecnicos/desempeno
 * Desempeño de técnicos (R4/R7).
 */
const getDesempenoTecnicos = async (req, res) => {
  try {
    const tecnicos = await reportesService.getDesempenoTecnicos();
    res.status(200).json({
      reporte: 'Desempeño de Técnicos',
      total_tecnicos: tecnicos.length,
      tecnicos: tecnicos
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar reporte: ' + error.message });
  }
};

/**
 * GET /api/reportes/financiero/proveedor/:id
 * Reporte financiero de un proveedor (R5/R9).
 */
const getFinancieroPorProveedor = async (req, res) => {
  try {
    const reporte = await reportesService.getFinancieroPorProveedor(req.params.id);
    res.status(200).json({
      reporte: 'Reporte Financiero por Proveedor',
      proveedor_id: req.params.id,
      ...reporte
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar reporte: ' + error.message });
  }
};

/**
 * GET /api/reportes/productos/garantias?estado=vencida
 * Productos por estado de garantía (R2).
 * Estados: todos, vencida, por_vencer, vigente
 */
const getProductosGarantia = async (req, res) => {
  try {
    const estado = req.query.estado || 'todos';
    const productos = await reportesService.getProductosGarantia(estado);
    res.status(200).json({
      reporte: 'Productos por Estado de Garantía',
      filtro: estado,
      total_productos: productos.length,
      productos: productos
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar reporte: ' + error.message });
  }
};

module.exports = {
  getRankingProveedores,
  getIncidentesPorProveedor,
  getIncidentesPorProducto,
  getDesempenoTecnicos,
  getFinancieroPorProveedor,
  getProductosGarantia,
};
