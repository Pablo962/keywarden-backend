// src/services/reportes.service.js

const reportesRepo = require('../repositories/reportes.repository.js');

/**
 * Helper para formatear tiempos en segundos a formato legible.
 */
const formatearSegundos = (segundos) => {
  if (!segundos || segundos === null) return 'N/A';
  segundos = Math.floor(segundos);
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = segundos % 60;
  return `${h}h ${m}m ${s}s`;
};

/**
 * Ranking de proveedores por calificación.
 */
const getRankingProveedores = async (limit) => {
  const ranking = await reportesRepo.getRankingProveedores(limit);
  
  // Formatear calificación promedio
  return ranking.map(p => ({
    ...p,
    calificacion_promedio: p.calificacion_promedio ? parseFloat(p.calificacion_promedio).toFixed(2) : 'Sin calificaciones',
    tasa_resolucion: p.total_incidentes > 0 
      ? `${((p.incidentes_resueltos / p.total_incidentes) * 100).toFixed(1)}%` 
      : 'N/A'
  }));
};

/**
 * Incidentes por proveedor.
 */
const getIncidentesPorProveedor = async (proveedorId) => {
  const incidentes = await reportesRepo.getIncidentesPorProveedor(proveedorId);
  
  return incidentes.map(i => ({
    ...i,
    tiempo_respuesta: formatearSegundos(i.tiempo_respuesta_seg),
    tiempo_resolucion: formatearSegundos(i.tiempo_resolucion_seg),
    calificacion: i.calificacion ? parseFloat(i.calificacion).toFixed(2) : 'Sin calificar'
  }));
};

/**
 * Incidentes por producto.
 */
const getIncidentesPorProducto = async (productoId) => {
  const incidentes = await reportesRepo.getIncidentesPorProducto(productoId);
  
  return incidentes.map(i => ({
    ...i,
    tiempo_respuesta: formatearSegundos(i.tiempo_respuesta_seg),
    tiempo_resolucion: formatearSegundos(i.tiempo_resolucion_seg)
  }));
};

/**
 * Desempeño de técnicos.
 */
const getDesempenoTecnicos = async () => {
  const tecnicos = await reportesRepo.getDesempenoTecnicos();
  
  return tecnicos.map(t => ({
    ...t,
    tiempo_resolucion_promedio: formatearSegundos(t.tiempo_resolucion_promedio_seg),
    calificacion_promedio: t.calificacion_promedio ? parseFloat(t.calificacion_promedio).toFixed(2) : 'N/A',
    tasa_resolucion: t.servicios_totales > 0 
      ? `${((t.servicios_resueltos / t.servicios_totales) * 100).toFixed(1)}%` 
      : 'N/A'
  }));
};

/**
 * Reporte financiero por proveedor.
 */
const getFinancieroPorProveedor = async (proveedorId) => {
  const facturas = await reportesRepo.getFinancieroPorProveedor(proveedorId);
  
  // Calcular totales
  let totalFacturado = 0;
  let totalPagado = 0;
  let totalPendiente = 0;
  
  facturas.forEach(f => {
    totalFacturado += parseFloat(f.importe_total);
    totalPagado += parseFloat(f.monto_pagado);
    totalPendiente += parseFloat(f.saldo_pendiente);
  });
  
  return {
    resumen: {
      total_facturas: facturas.length,
      monto_total_facturado: totalFacturado.toFixed(2),
      monto_total_pagado: totalPagado.toFixed(2),
      saldo_total_pendiente: totalPendiente.toFixed(2),
      porcentaje_pagado: totalFacturado > 0 ? ((totalPagado / totalFacturado) * 100).toFixed(1) + '%' : 'N/A'
    },
    facturas: facturas.map(f => ({
      ...f,
      importe_total: parseFloat(f.importe_total).toFixed(2),
      monto_pagado: parseFloat(f.monto_pagado).toFixed(2),
      saldo_pendiente: parseFloat(f.saldo_pendiente).toFixed(2),
      porcentaje_pagado: f.importe_total > 0 ? ((f.monto_pagado / f.importe_total) * 100).toFixed(1) + '%' : '0%'
    }))
  };
};

/**
 * Productos con estado de garantía.
 */
const getProductosGarantia = async (estado) => {
  return await reportesRepo.getProductosGarantia(estado);
};

module.exports = {
  getRankingProveedores,
  getIncidentesPorProveedor,
  getIncidentesPorProducto,
  getDesempenoTecnicos,
  getFinancieroPorProveedor,
  getProductosGarantia,
};
