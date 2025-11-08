// src/repositories/producto.repository.js

const pool = require('../config/db');

/**
 * --- FUNCIÓN CREATE (ESTÁTICA) ---
 * Esta función es para POST. Espera TODOS los campos del body.
 */
const create = async (data) => {
  // Leemos los campos exactos de tu tabla
  const { 
    marca, 
    categoria, 
    numero_de_serie, 
    fecha_adquisicion, 
    fecha_vencimiento_garantia, 
    modelo, 
    proveedor_id_proveedor 
  } = data;

  // El INSERT es estático, siempre espera 7 campos + 1 (estado)
  const [result] = await pool.execute(
    `INSERT INTO producto 
     (marca, categoria, numero_de_serie, fecha_adquisicion, fecha_vencimiento_garantia, modelo, proveedor_id_proveedor, estado_producto) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      marca, 
      categoria, 
      numero_de_serie, 
      fecha_adquisicion, 
      fecha_vencimiento_garantia, 
      modelo, 
      proveedor_id_proveedor, 
      'Activo'
    ]
  );
  return result.insertId;
};

/**
 * --- FUNCIÓN UPDATE (DINÁMICA) ---
 * Esta función es para PUT. Construye la consulta dinámicamente.
 */
const update = async (id, data) => {
  const fields = [];
  const values = [];

  const allowedFields = {
    marca: data.marca,
    categoria: data.categoria,
    numero_de_serie: data.numero_de_serie,
    fecha_adquisicion: data.fecha_adquisicion,
    fecha_vencimiento_garantia: data.fecha_vencimiento_garantia,
    modelo: data.modelo,
    proveedor_id_proveedor: data.proveedor_id_proveedor
  };

  for (const [key, value] of Object.entries(allowedFields)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return 0; // Nada que actualizar

  const sqlQuery = `UPDATE producto SET ${fields.join(', ')} WHERE id_producto = ?`;
  values.push(id);

  const [result] = await pool.execute(sqlQuery, values);
  return result.affectedRows;
};

// --- (El resto de funciones: findAll, findById, logicalDelete) ---

const findAll = async () => {
  const [rows] = await pool.execute(
    `SELECT p.*, prov.razon_social as proveedor_nombre 
     FROM producto p
     JOIN proveedor prov ON p.proveedor_id_proveedor = prov.id_proveedor
     WHERE p.estado_producto = 'Activo'`
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT p.*, prov.razon_social as proveedor_nombre 
     FROM producto p
     JOIN proveedor prov ON p.proveedor_id_proveedor = prov.id_proveedor
     WHERE p.id_producto = ? AND p.estado_producto = 'Activo'`,
    [id]
  );
  return rows[0];
};

const logicalDelete = async (id) => {
  const [result] = await pool.execute(
    "UPDATE producto SET estado_producto = 'Inactivo' WHERE id_producto = ?",
    [id]
  );
  return result.affectedRows;
};

// --- Exportaciones ---
module.exports = {
  create,
  findAll,
  findById,
  update,
  logicalDelete,
};