// src/repositories/tecnico.repository.js

const pool = require('../config/db');

/**
 * Registra un nuevo técnico (Auto-Incremental).
 */
const create = async (data) => {
  const { 
    nombre, 
    documento, // Usamos 'documento'
    email, 
    telefono, 
    vigencia_desde, // Usamos 'vigencia_desde'
    vigencia_hasta, // Usamos 'vigencia_hasta'
    especialidad, 
    proveedor_id_proveedor 
  } = data;

  // No hay 'apellido' ni 'estado_tecnico' en tu tabla
  const [result] = await pool.execute(
    `INSERT INTO tecnico 
     (nombre, documento, email, telefono, vigencia_desde, vigencia_hasta, especialidad, proveedor_id_proveedor) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [nombre, documento, email, telefono, vigencia_desde, vigencia_hasta, especialidad, proveedor_id_proveedor]
  );
  return result.insertId; // Devuelve el ID auto-generado
};

/**
 * Busca un técnico por DNI para evitar duplicados.
 */
const findByDocumento = async (documento) => {
  const [rows] = await pool.execute(
    'SELECT * FROM tecnico WHERE documento = ?', // No filtramos por estado
    [documento]
  );
  return rows[0];
};

/**
 * Devuelve todos los técnicos (ya no filtra por estado).
 */
const findAll = async (filtros) => {
  // Query base con el JOIN a proveedor
  let baseQuery = 
    `SELECT t.*, p.razon_social as proveedor_nombre
     FROM tecnico t
     JOIN proveedor p ON t.proveedor_id_proveedor = p.id_proveedor`;

  const whereClauses = []; // Array para guardar las cláusulas WHERE
  const values = [];       // Array para guardar los valores de forma segura

  // --- Construcción dinámica de la consulta ---

  // Filtro 1: Por nombre (búsqueda parcial)
  if (filtros.nombre) {
    whereClauses.push("t.nombre LIKE ?");
    values.push(`%${filtros.nombre}%`);
  }

  // Filtro 2: Por documento (búsqueda exacta)
  if (filtros.documento) {
    whereClauses.push("t.documento = ?");
    values.push(filtros.documento);
  }

  // Filtro 3: Por especialidad (búsqueda parcial)
  if (filtros.especialidad) {
    whereClauses.push("t.especialidad LIKE ?");
    values.push(`%${filtros.especialidad}%`);
  }

  // Filtro 4: Por ID de Proveedor (búsqueda exacta)
  if (filtros.proveedor) {
    whereClauses.push("t.proveedor_id_proveedor = ?");
    values.push(filtros.proveedor);
  }
  
  // --- Ensamblaje final de la consulta ---
  if (whereClauses.length > 0) {
    baseQuery += " WHERE " + whereClauses.join(" AND ");
  }

  // Ejecutamos la consulta final
  const [rows] = await pool.execute(baseQuery, values);
  return rows;
};

/**
 * Devuelve un técnico específico por su ID.
 */
const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT t.*, p.razon_social as proveedor_nombre
     FROM tecnico t
     JOIN proveedor p ON t.proveedor_id_proveedor = p.id_proveedor
     WHERE t.id_tecnico = ?`,
    [id]
  );
  return rows[0];
};

/**
 * Actualiza un técnico (lógica dinámica).
 */
const update = async (id, data) => {
  const fields = [];
  const values = [];

  // Usamos los campos de tu captura
  const allowedFields = {
    nombre: data.nombre,
    documento: data.documento,
    email: data.email,
    telefono: data.telefono,
    vigencia_desde: data.vigencia_desde,
    vigencia_hasta: data.vigencia_hasta,
    especialidad: data.especialidad,
    proveedor_id_proveedor: data.proveedor_id_proveedor
  };

  for (const [key, value] of Object.entries(allowedFields)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return 0; // Nada que actualizar

  const sqlQuery = `UPDATE tecnico SET ${fields.join(', ')} WHERE id_tecnico = ?`;
  values.push(id);

  const [result] = await pool.execute(sqlQuery, values);
  return result.affectedRows;
};

/**
 * ¡CAMBIO! Realiza una BAJA FÍSICA.
 */
const remove = async (id) => {
  const [result] = await pool.execute(
    "DELETE FROM tecnico WHERE id_tecnico = ?",
    [id]
  );
  return result.affectedRows; // 1 si borró, 0 si no
};

module.exports = {
  create,
  findByDocumento, // Renombrado
  findAll,
  findById,
  update,
  remove, // Renombrado
};