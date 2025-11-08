// src/repositories/reportes.repository.js
const pool = require('../config/db');

/**
 * Ranking de proveedores por calificación promedio (R3).
 */
const getRankingProveedores = async (limit = 10) => {
  const [rows] = await pool.execute(
    `SELECT 
       p.id_proveedor,
       p.razon_social,
       p.CUIT,
       p.telefono,
       p.email,
       COUNT(DISTINCT prod.id_producto) as total_productos,
       COUNT(DISTINCT i.idincidente) as total_incidentes,
       COUNT(DISTINCT CASE WHEN i.estado = 'Resuelto' THEN i.idincidente END) as incidentes_resueltos,
       AVG(cp.puntaje_promedio) as calificacion_promedio,
       COUNT(cp.id_calificacion_proveedor) as total_calificaciones
     FROM proveedor p
     LEFT JOIN producto prod ON p.id_proveedor = prod.proveedor_id_proveedor
     LEFT JOIN incidente i ON prod.id_producto = i.producto_id_producto
     LEFT JOIN calificacion_proveedor cp ON p.id_proveedor = cp.proveedor_id_proveedor
     WHERE p.estado_proveedor = 'Activo'
     GROUP BY p.id_proveedor, p.razon_social, p.CUIT, p.telefono, p.email
     ORDER BY calificacion_promedio DESC, total_calificaciones DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
};

/**
 * Reporte de incidentes por proveedor (R7).
 */
const getIncidentesPorProveedor = async (proveedorId) => {
  const [rows] = await pool.execute(
    `SELECT 
       i.idincidente,
       i.descripcion,
       i.fecha_apertura,
       i.estado,
       p.numero_de_serie,
       p.marca,
       p.modelo,
       u.nombre as reportado_por,
       t.nombre as tecnico_nombre,
       t.apellido as tecnico_apellido,
       st.fecha_inicio,
       st.fecha_final,
       TIMESTAMPDIFF(SECOND, i.fecha_apertura, st.fecha_inicio) as tiempo_respuesta_seg,
       TIMESTAMPDIFF(SECOND, st.fecha_inicio, st.fecha_final) as tiempo_resolucion_seg,
       c.puntaje as calificacion,
       c.comentario as calificacion_comentario
     FROM incidente i
     JOIN producto p ON i.producto_id_producto = p.id_producto
     JOIN usuario u ON i.usuario_id_usuario = u.id_usuario
     LEFT JOIN servicio_tecnico st ON i.idincidente = st.incidente_idincidente
     LEFT JOIN tecnico t ON st.tecnico_idtecnico = t.idtecnico
     LEFT JOIN calificacion_proveedor c ON i.idincidente = c.incidente_idincidente
     WHERE p.proveedor_id_proveedor = ?
     ORDER BY i.fecha_apertura DESC`,
    [proveedorId]
  );
  return rows;
};

/**
 * Reporte de incidentes por producto (R7).
 */
const getIncidentesPorProducto = async (productoId) => {
  const [rows] = await pool.execute(
    `SELECT 
       i.idincidente,
       i.descripcion,
       i.fecha_apertura,
       i.estado,
       u.nombre as reportado_por,
       t.nombre as tecnico_nombre,
       t.apellido as tecnico_apellido,
       st.fecha_inicio,
       st.fecha_final,
       st.descripcion as solucion,
       TIMESTAMPDIFF(SECOND, i.fecha_apertura, st.fecha_inicio) as tiempo_respuesta_seg,
       TIMESTAMPDIFF(SECOND, st.fecha_inicio, st.fecha_final) as tiempo_resolucion_seg
     FROM incidente i
     JOIN usuario u ON i.usuario_id_usuario = u.id_usuario
     LEFT JOIN servicio_tecnico st ON i.idincidente = st.incidente_idincidente
     LEFT JOIN tecnico t ON st.tecnico_idtecnico = t.idtecnico
     WHERE i.producto_id_producto = ?
     ORDER BY i.fecha_apertura DESC`,
    [productoId]
  );
  return rows;
};

/**
 * Desempeño de técnicos (R4/R7).
 */
const getDesempenoTecnicos = async () => {
  const [rows] = await pool.execute(
    `SELECT 
       t.idtecnico,
       t.nombre,
       COALESCE(t.apellido, '') as apellido,
       t.especialidad,
       pr.razon_social as proveedor_nombre,
       COUNT(st.id_servicio_tecnico) as servicios_totales,
       COUNT(CASE WHEN i.estado = 'Resuelto' THEN 1 END) as servicios_resueltos,
       AVG(TIMESTAMPDIFF(SECOND, st.fecha_inicio, st.fecha_final)) as tiempo_resolucion_promedio_seg,
       AVG(ct.puntaje) as calificacion_promedio,
       COUNT(ct.id_calificacion_tecnico) as total_calificaciones
     FROM tecnico t
     JOIN proveedor pr ON t.proveedor_id_proveedor = pr.id_proveedor
     LEFT JOIN servicio_tecnico st ON t.idtecnico = st.tecnico_idtecnico
     LEFT JOIN incidente i ON st.incidente_idincidente = i.idincidente
     LEFT JOIN calificacion_tecnico ct ON t.idtecnico = ct.tecnico_id_tecnico
     WHERE t.estado = 'Activo'
     GROUP BY t.idtecnico, t.nombre, t.apellido, t.especialidad, pr.razon_social
     ORDER BY calificacion_promedio DESC, servicios_resueltos DESC`
  );
  return rows;
};

/**
 * Reporte financiero detallado por proveedor (R5/R9).
 */
const getFinancieroPorProveedor = async (proveedorId) => {
  const [rows] = await pool.execute(
    `SELECT 
       f.id_factura,
       f.fecha_emision,
       f.fecha_vencimiento,
       f.importe as importe_total,
       f.estado as estado_factura,
       oc.id_orden_compra,
       oc.fecha_orden,
       COUNT(pp.id_plan_pago) as total_cuotas,
       COUNT(CASE WHEN pp.estado = 'Pagado' THEN 1 END) as cuotas_pagadas,
       COUNT(CASE WHEN pp.estado = 'Pendiente' THEN 1 END) as cuotas_pendientes,
       SUM(CASE WHEN pp.estado = 'Pagado' THEN pp.importe ELSE 0 END) as monto_pagado,
       SUM(CASE WHEN pp.estado = 'Pendiente' THEN pp.importe ELSE 0 END) as saldo_pendiente
     FROM factura f
     JOIN orden_compra oc ON f.orden_compra_id_orden_compra = oc.id_orden_compra
     LEFT JOIN plan_pago pp ON f.id_factura = pp.factura_id_factura
     WHERE f.proveedor_id_proveedor = ?
     GROUP BY f.id_factura, f.fecha_emision, f.fecha_vencimiento, f.importe, f.estado, oc.id_orden_compra, oc.fecha_orden
     ORDER BY f.fecha_emision DESC`,
    [proveedorId]
  );
  return rows;
};

/**
 * Productos con garantía próxima a vencer o vencida (R2).
 */
const getProductosGarantia = async (estado = 'todos') => {
  let whereClause = "p.estado_producto = 'Activo'";
  
  if (estado === 'vencida') {
    whereClause += " AND p.fecha_vencimiento_garantia < CURDATE()";
  } else if (estado === 'por_vencer') {
    whereClause += " AND p.fecha_vencimiento_garantia BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 60 DAY)";
  } else if (estado === 'vigente') {
    whereClause += " AND p.fecha_vencimiento_garantia > DATE_ADD(CURDATE(), INTERVAL 60 DAY)";
  }

  const [rows] = await pool.execute(
    `SELECT 
       p.id_producto,
       p.numero_de_serie,
       p.marca,
       p.modelo,
       p.fecha_adquisicion,
       p.fecha_vencimiento_garantia,
       DATEDIFF(p.fecha_vencimiento_garantia, CURDATE()) as dias_restantes,
       CASE 
         WHEN p.fecha_vencimiento_garantia < CURDATE() THEN 'Vencida'
         WHEN DATEDIFF(p.fecha_vencimiento_garantia, CURDATE()) <= 30 THEN 'Por Vencer (30 días)'
         WHEN DATEDIFF(p.fecha_vencimiento_garantia, CURDATE()) <= 60 THEN 'Por Vencer (60 días)'
         ELSE 'Vigente'
       END as estado_garantia,
       pr.id_proveedor,
       pr.razon_social as proveedor_nombre,
       pr.telefono as proveedor_telefono,
       pr.email as proveedor_email
     FROM producto p
     JOIN proveedor pr ON p.proveedor_id_proveedor = pr.id_proveedor
     WHERE ${whereClause}
     ORDER BY p.fecha_vencimiento_garantia ASC`
  );
  return rows;
};

module.exports = {
  getRankingProveedores,
  getIncidentesPorProveedor,
  getIncidentesPorProducto,
  getDesempenoTecnicos,
  getFinancieroPorProveedor,
  getProductosGarantia,
};
