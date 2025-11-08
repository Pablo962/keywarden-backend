// src/repositories/servicio_tecnico.repository.js
const pool = require('../config/db');

/**
 * "Asigna" un incidente.
 * CORREGIDO: Inserta solo los campos obligatorios al inicio.
 * 'descripcion' y 'fecha_final' se omiten (serán NULL).
 */
const crearServicio = async (incidenteId, tecnicoId, proveedorId) => {
  const [result] = await pool.execute(
    `INSERT INTO servicio_tecnico 
     (fecha_inicio, tecnico_idtecnico, tecnico_proveedor_id_proveedor, incidente_idincidente) 
     VALUES (NOW(), ?, ?, ?)`,
    [tecnicoId, proveedorId, incidenteId]
  );
  return result.insertId;
};

/**
 * "Resuelve" un incidente.
 * Este UPDATE AHORA SÍ establece la 'descripcion' y 'fecha_final'.
 */
const resolverServicio = async (incidenteId, descripcion) => {
  const [result] = await pool.execute(
    `UPDATE servicio_tecnico 
     SET fecha_final = NOW(), descripcion = ? 
     WHERE incidente_idincidente = ?`,
    [descripcion, incidenteId]
  );
  return result.affectedRows;
};

const findByIncidenteId = async (incidenteId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM servicio_tecnico WHERE incidente_idincidente = ?',
    [incidenteId]
  );
  return rows[0];
};

module.exports = {
  crearServicio,
  resolverServicio,
  findByIncidenteId,
};