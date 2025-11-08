// src/repositories/proveedor.repository.js

const pool = require('../config/db');

// CU02 (Alta)
const create = async (proveedorData) => {
  // Desestructuramos los datos que vienen del body
  const {razon_social, email, telefono, cuit } = proveedorData;
  
  // Usamos tus nombres de columna exactos
  // Asignamos 'Activo' por defecto a 'estado_proveedor' (Baja Lógica RF-02)
  const [result] = await pool.execute(
    'INSERT INTO proveedor (razon_social, email, telefono, estado_proveedor, cuit) VALUES (?, ?, ?, ?, ?)',
    [razon_social, email, telefono, 'Activo', cuit]
  );
  
  // Devolvemos el ID (ya que lo provees tú)
  return result.insertId;
};

// Validar CUIT duplicado (Regla R1)
const findByCuit = async (cuit) => {
  const [rows] = await pool.execute(
    'SELECT * FROM proveedor WHERE cuit = ?',
    [cuit]
  );
  return rows[0];
};

// Listar todos los proveedores (solo activos)
const findAll = async () => {
  const [rows] = await pool.execute(
    "SELECT * FROM proveedor WHERE estado_proveedor = 'Activo'"
  );
  return rows;
};

// Encontrar uno por ID (solo si está activo)
const findById = async (id) => {
  const [rows] = await pool.execute(
    "SELECT * FROM proveedor WHERE id_proveedor = ? AND estado_proveedor = 'Activo'",
    [id]
  );
  return rows[0];
};

// CU03 (Modificar)
const update = async (id, proveedorData) => {
  // proveedorData es el req.body. Ej: { razon_social: "Nuevo Nombre", telefono: "123" }

  const fields = []; // Array para guardar "columna = ?"
  const values = []; // Array para guardar los valores

  // Rellenamos los arrays dinámicamente
  if (proveedorData.razon_social !== undefined) {
    fields.push('razon_social = ?');
    values.push(proveedorData.razon_social);
  }
  if (proveedorData.email !== undefined) {
    fields.push('email = ?');
    values.push(proveedorData.email);
  }
  if (proveedorData.telefono !== undefined) {
    fields.push('telefono = ?');
    values.push(proveedorData.telefono);
  }

  // Si el body vino vacío o con campos que no se pueden actualizar
  if (fields.length === 0) {
    return 0; // No hay nada que actualizar
  }

  // Construimos la consulta: "UPDATE proveedor SET razon_social = ?, telefono = ? WHERE ..."
  const sqlQuery = `UPDATE proveedor SET ${fields.join(', ')} WHERE id_proveedor = ?`;
  
  // Añadimos el ID al final del array de valores
  values.push(id); 

  // Ejecutamos la consulta dinámica
  const [result] = await pool.execute(sqlQuery, values);
  return result.affectedRows;
};

// CU04 (Baja Lógica)
const logicalDelete = async (id) => {
  const [result] = await pool.execute(
    "UPDATE proveedor SET estado_proveedor = 'Inactivo' WHERE id_proveedor = ?",
    [id]
  );
  return result.affectedRows;
};

module.exports = {
  create,
  findByCuit,
  findAll,
  findById,
  update,
  logicalDelete,
};