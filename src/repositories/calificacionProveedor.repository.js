// src/repositories/calificacionProveedor.repository.js
const pool = require('../config/db');

/**
 * Crea una calificación para un proveedor
 */
const create = async (data) => {
  const { 
    servicio_postventa,
    precios,
    tiempos_entrega,
    calidad_productos,
    comentario, 
    proveedor_id_proveedor, 
    incidente_idincidente 
  } = data;
  
  const [result] = await pool.execute(
    `INSERT INTO calificacion_proveedor 
     (servicio_postventa, precios, tiempos_entrega, calidad_productos, comentario, proveedor_id_proveedor, incidente_idincidente, fecha_calificacion) 
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
    [
      servicio_postventa, 
      precios, 
      tiempos_entrega, 
      calidad_productos, 
      comentario || null, 
      proveedor_id_proveedor, 
      incidente_idincidente
    ]
  );
  return result.insertId;
};

/**
 * Obtiene todas las calificaciones de proveedores con información detallada
 */
const findAll = async () => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
         cp.*,
         p.razon_social AS proveedor_nombre,
         i.descripcion AS incidente_descripcion,
         i.fecha_apertura,
         prod.marca,
         prod.modelo
       FROM calificacion_proveedor cp
       INNER JOIN proveedor p ON cp.proveedor_id_proveedor = p.id_proveedor
       INNER JOIN incidente i ON cp.incidente_idincidente = i.idincidente
       LEFT JOIN producto prod ON i.producto_id_producto = prod.id_producto
       ORDER BY cp.fecha_calificacion DESC`
    );
    return rows;
  } catch (error) {
    console.error('❌ Error en calificacionProveedor.repository.findAll:', error.message);
    throw error;
  }
};

/**
 * Obtiene el resumen de calificaciones por proveedor
 * Incluye el estado del proveedor (Activo/Inactivo)
 */
const getResumenProveedores = async () => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        v.*,
        p.estado_proveedor
      FROM v_resumen_proveedores v
      LEFT JOIN proveedor p ON v.id_proveedor = p.id_proveedor
      ORDER BY v.promedio_general DESC
    `);
    return rows;
  } catch (error) {
    console.error('❌ Error en calificacionProveedor.repository.getResumenProveedores:', error.message);
    throw error;
  }
};

/**
 * Verifica si un incidente ya tiene calificación de proveedor
 */
const findByIncidenteId = async (incidenteId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM calificacion_proveedor WHERE incidente_idincidente = ?',
    [incidenteId]
  );
  return rows[0];
};

/**
 * Obtiene todas las calificaciones de un proveedor específico
 */
const findByProveedorId = async (proveedorId) => {
  const [rows] = await pool.execute(
    `SELECT 
       cp.*,
       i.descripcion as incidente_descripcion,
       i.fecha_apertura
     FROM calificacion_proveedor cp
     INNER JOIN incidente i ON cp.incidente_idincidente = i.idincidente
     WHERE cp.proveedor_id_proveedor = ?
     ORDER BY cp.fecha_calificacion DESC`,
    [proveedorId]
  );
  return rows;
};

module.exports = {
  create,
  findAll,
  getResumenProveedores,
  findByIncidenteId,
  findByProveedorId,
};
