// src/repositories/calificacionTecnico.repository.js
const pool = require('../config/db');

/**
 * Crea una calificación para un técnico
 */
const create = async (data) => {
  const { puntaje, comentario, tecnico_id_tecnico, incidente_idincidente } = data;
  
  const [result] = await pool.execute(
    `INSERT INTO calificacion_tecnico 
     (puntaje, comentario, tecnico_id_tecnico, incidente_idincidente, fecha_calificacion) 
     VALUES (?, ?, ?, ?, NOW())`,
    [puntaje, comentario || null, tecnico_id_tecnico, incidente_idincidente]
  );
  return result.insertId;
};

/**
 * Obtiene todas las calificaciones de técnicos con información detallada
 */
const findAll = async () => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
         ct.*,
         t.nombre as tecnico_nombre,
         t.especialidad,
         t.documento,
         i.descripcion as incidente_descripcion,
         i.fecha_apertura,
         p.marca,
         p.modelo
       FROM calificacion_tecnico ct
       INNER JOIN tecnico t ON ct.tecnico_id_tecnico = t.id_tecnico
       INNER JOIN incidente i ON ct.incidente_idincidente = i.idincidente
       LEFT JOIN producto p ON i.producto_id_producto = p.id_producto
       ORDER BY ct.fecha_calificacion DESC`
    );
    return rows;
  } catch (error) {
    console.error('❌ Error en calificacionTecnico.repository.findAll:', error.message);
    throw error;
  }
};

/**
 * Obtiene el resumen de calificaciones por técnico
 */
const getResumenTecnicos = async () => {
  try {
    const [rows] = await pool.execute('SELECT * FROM v_resumen_tecnicos ORDER BY promedio_calificacion DESC');
    return rows;
  } catch (error) {
    console.error('❌ Error en calificacionTecnico.repository.getResumenTecnicos:', error.message);
    throw error;
  }
};

/**
 * Verifica si un incidente ya tiene calificación de técnico
 */
const findByIncidenteId = async (incidenteId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM calificacion_tecnico WHERE incidente_idincidente = ?',
    [incidenteId]
  );
  return rows[0];
};

/**
 * Obtiene todas las calificaciones de un técnico específico
 */
const findByTecnicoId = async (tecnicoId) => {
  const [rows] = await pool.execute(
    `SELECT 
       ct.*,
       i.descripcion as incidente_descripcion,
       i.fecha_apertura
     FROM calificacion_tecnico ct
     INNER JOIN incidente i ON ct.incidente_idincidente = i.idincidente
     WHERE ct.tecnico_id_tecnico = ?
     ORDER BY ct.fecha_calificacion DESC`,
    [tecnicoId]
  );
  return rows;
};

module.exports = {
  create,
  findAll,
  getResumenTecnicos,
  findByIncidenteId,
  findByTecnicoId,
};
