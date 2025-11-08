// src/repositories/incidente.repository.js
const pool = require('../config/db');

/**
 * Crea un nuevo incidente.
 * El estado por defecto es 'Abierto'.
 * La fecha_apertura es la fecha actual (NOW()).
 * usuario_id_usuario viene del token del usuario logueado.
 */
const create = async (data, usuarioId) => {
  // Usamos 'descripcion' y 'producto_id_producto' del body
  const { descripcion, producto_id_producto } = data;
  
  const [result] = await pool.execute(
    `INSERT INTO incidente 
     (descripcion, fecha_apertura, estado, usuario_id_usuario, producto_id_producto) 
     VALUES (?, NOW(), ?, ?, ?)`,
    [descripcion, 'Abierto', usuarioId, producto_id_producto]
  );
  return result.insertId; // Devuelve el idincidente (AI)
};

/**
 * Busca todos los incidentes.
 * Une con producto, usuario, servicio_tecnico y tecnico para dar más contexto.
 * Incluye si el incidente ya fue calificado (técnico)
 */
const findAll = async () => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
         i.idincidente, i.descripcion, i.fecha_apertura, i.estado,
         p.marca, p.modelo, p.numero_de_serie,
         p.proveedor_id_proveedor,
         u.nombre as reportado_por,
         COALESCE(t.nombre, '') as tecnico_nombre,
         COALESCE(st.tecnico_idtecnico, 0) as tecnico_id,
         CASE WHEN ct.id_calificacion_tecnico IS NOT NULL THEN 1 ELSE 0 END as ya_calificado
       FROM incidente i
       INNER JOIN producto p ON i.producto_id_producto = p.id_producto
       INNER JOIN usuario u ON i.usuario_id_usuario = u.id_usuario
       LEFT JOIN servicio_tecnico st ON i.idincidente = st.incidente_idincidente
       LEFT JOIN tecnico t ON st.tecnico_idtecnico = t.id_tecnico
       LEFT JOIN calificacion_tecnico ct ON i.idincidente = ct.incidente_idincidente
       ORDER BY i.fecha_apertura DESC`
    );
    return rows;
  } catch (error) {
    console.error('[REPOSITORY ERROR] Error en findAll:', error.message);
    throw new Error(`Error al obtener incidentes: ${error.message}`);
  }
};

/**
 * Busca un incidente específico.
 * (Tu ID es idincidente)
 */
const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT 
       i.*, 
       p.marca, p.modelo, p.numero_de_serie,
       p.proveedor_id_proveedor,
       u.nombre as reportado_por
     FROM incidente i
     JOIN producto p ON i.producto_id_producto = p.id_producto
     JOIN usuario u ON i.usuario_id_usuario = u.id_usuario
     WHERE i.idincidente = ?`,
    [id]
  );
  return rows[0];
};

/**
 * Actualiza el estado de un incidente.
 * Función clave para el flujo de trabajo (tu columna es 'estado').
 */
const updateEstado = async (id, estado) => {
  const [result] = await pool.execute(
    'UPDATE incidente SET estado = ? WHERE idincidente = ?',
    [estado, id]
  );
  return result.affectedRows;
};

/**
 * Actualiza la 'descripcion' de un incidente.
 */
const update = async (id, data) => {
  const { descripcion } = data;
  if (!descripcion) return 0; // Solo permitimos cambiar la descripción

  const [result] = await pool.execute(
    'UPDATE incidente SET descripcion = ? WHERE idincidente = ?',
    [descripcion, id]
  );
  return result.affectedRows;
};

/**
 * Elimina un incidente (Baja Física).
 */
const remove = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM incidente WHERE idincidente = ?',
    [id]
  );
  return result.affectedRows;
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
  updateEstado, // ¡Función clave!
};