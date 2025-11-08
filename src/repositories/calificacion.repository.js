// src/repositories/calificacion.repository.js
const pool = require('../config/db');

/**
 * Registra una new calificación.
 * La 'fecha_calificacion' se inserta automáticamente (DEFAULT CURRENT_TIMESTAMP).
 */
const create = async (data) => {
  const { 
    puntaje, 
    servicio_postventa,
    precios,
    tiempos_entrega,
    calidad_productos,
    comentario, 
    proveedor_id_proveedor, 
    incidente_idincidente 
  } = data;

  try {
    // Intentar insertar con las nuevas columnas
    const [result] = await pool.execute(
      `INSERT INTO calificacion_proveedor 
       (puntaje, servicio_postventa, precios, tiempos_entrega, calidad_productos, comentario, proveedor_id_proveedor, incidente_idincidente, fecha_calificacion) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        puntaje, 
        servicio_postventa || null, 
        precios || null, 
        tiempos_entrega || null, 
        calidad_productos || null, 
        comentario || null, 
        proveedor_id_proveedor, 
        incidente_idincidente
      ]
    );
    return result.insertId;
  } catch (error) {
    // Si falla por columnas inexistentes, usar solo las columnas básicas
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      console.log('Usando formato antiguo de calificación (sin criterios detallados)');
      const [result] = await pool.execute(
        `INSERT INTO calificacion_proveedor 
         (puntaje, comentario, proveedor_id_proveedor, incidente_idincidente, fecha_calificacion) 
         VALUES (?, ?, ?, ?, NOW())`,
        [puntaje, comentario || null, proveedor_id_proveedor, incidente_idincidente]
      );
      return result.insertId;
    }
    throw error;
  }
};

/**
 * Busca si un incidente ya fue calificado para evitar duplicados.
 */
const findByIncidenteId = async (incidenteId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM calificacion_proveedor WHERE incidente_idincidente = ?',
    [incidenteId]
  );
  return rows[0];
};

/**
 * Devuelve todas las calificaciones de un proveedor específico.
 */
const findAllByProveedorId = async (proveedorId) => {
  const [rows] = await pool.execute(
    `SELECT * FROM calificacion_proveedor 
     WHERE proveedor_id_proveedor = ? 
     ORDER BY fecha_calificacion DESC`,
    [proveedorId]
  );
  return rows;
};

/**
 * Devuelve todas las calificaciones con información del incidente y proveedor.
 */
const findAll = async () => {
  const [rows] = await pool.execute(
    `SELECT 
       c.*,
       i.descripcion as incidente_descripcion,
       i.estado as incidente_estado,
       p.razon_social as proveedor_nombre,
       prod.marca,
       prod.modelo,
       t.nombre as tecnico_nombre
     FROM calificacion_proveedor c
     INNER JOIN incidente i ON c.incidente_idincidente = i.idincidente
     INNER JOIN proveedor p ON c.proveedor_id_proveedor = p.id_proveedor
     LEFT JOIN producto prod ON i.producto_id_producto = prod.id_producto
     LEFT JOIN servicio_tecnico st ON i.idincidente = st.incidente_idincidente
     LEFT JOIN tecnico t ON st.tecnico_idtecnico = t.id_tecnico
     ORDER BY c.fecha_calificacion DESC`
  );
  return rows;
};

/**
 * (Para R3/R10) Calcula el puntaje promedio de un proveedor.
 */
const getPromedioByProveedorId = async (proveedorId) => {
  const [rows] = await pool.execute(
    `SELECT AVG(puntaje) as promedio 
     FROM calificacion_proveedor 
     WHERE proveedor_id_proveedor = ?`,
    [proveedorId]
  );
  // Devuelve el promedio, o null si no tiene calificaciones
  return rows[0].promedio; 
};

module.exports = {
  create,
  findByIncidenteId,
  findAllByProveedorId,
  findAll,
  getPromedioByProveedorId,
};