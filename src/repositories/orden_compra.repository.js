// src/repositories/orden_compra.repository.js
const pool = require('../config/db');

/**
 * Crea una nueva Orden de Compra y sus líneas de detalle
 * usando una transacción para asegurar la integridad (R9).
 */
const create = async (ordenData) => {
  const { cuotas, proveedor_id_proveedor, items } = ordenData;
  
  // 1. Obtener una conexión del pool
  const connection = await pool.getConnection();

  try {
    // 2. Iniciar la transacción
    await connection.beginTransaction();

    // 3. Insertar la Orden de Compra (tabla 'madre')
    // Usamos NOW() para 'fecha' y tus columnas 'cuotas' y 'proveedor_id_proveedor'
    const [ordenResult] = await connection.execute(
      `INSERT INTO orden_compra 
       (fecha, cuotas, proveedor_id_proveedor) 
       VALUES (NOW(), ?, ?)`,
      [cuotas, proveedor_id_proveedor]
    );
    
    const newOrdenId = ordenResult.insertId;

    // 4. Preparar la consulta para las líneas de detalle
    // (Ajustada a tus 6 columnas en 'linea_orden_compra')
    const queryItems = 
      `INSERT INTO linea_orden_compra 
       (cantidad, precio_unitario, subtotal, orden_compra_id_orden_compra, orden_compra_proveedor_id_proveedor, producto_id_producto) 
       VALUES (?, ?, ?, ?, ?, ?)`;

    // 5. Iterar e insertar cada ítem (producto)
    await Promise.all(
      items.map(item => {
        return connection.execute(queryItems, [
          item.cantidad,
          item.precio_unitario,
          item.subtotal, // Este valor fue calculado en el Servicio
          newOrdenId,
          proveedor_id_proveedor, // Tu FK compuesta
          item.producto_id_producto
        ]);
      })
    );

    // 6. Si todo salió bien, confirmar la transacción
    await connection.commit();
    return newOrdenId;

  } catch (error) {
    // 7. Si algo falló, deshacer todo
    await connection.rollback();
    console.error('Error en la transacción de Orden de Compra:', error);
    throw new Error('Error al crear la orden de compra: ' + error.message);
  } finally {
    // 8. Siempre liberar la conexión
    connection.release();
  }
};

/**
 * Devuelve todas las Órdenes de Compra con el monto total calculado.
 */
const findAll = async () => {
  const [rows] = await pool.execute(
    `SELECT 
       oc.id_orden_compra,
       oc.fecha,
       oc.cuotas,
       oc.proveedor_id_proveedor,
       p.razon_social as proveedor_nombre,
       COALESCE(SUM(loc.subtotal), 0) as monto_total
     FROM orden_compra oc
     JOIN proveedor p ON oc.proveedor_id_proveedor = p.id_proveedor
     LEFT JOIN linea_orden_compra loc ON oc.id_orden_compra = loc.orden_compra_id_orden_compra
     GROUP BY oc.id_orden_compra, oc.fecha, oc.cuotas, oc.proveedor_id_proveedor, p.razon_social
     ORDER BY oc.fecha DESC`
  );
  return rows;
};

/**
 * Devuelve una Orden de Compra completa (cabecera + líneas de detalle).
 */
const findById = async (id) => {
  // 1. Obtener la cabecera
  const [ordenRows] = await pool.execute(
    `SELECT oc.*, p.razon_social as proveedor_nombre 
     FROM orden_compra oc
     JOIN proveedor p ON oc.proveedor_id_proveedor = p.id_proveedor
     WHERE oc.id_orden_compra = ?`,
    [id]
  );

  if (!ordenRows[0]) return undefined; // No se encontró

  // 2. Obtener las líneas de detalle (items)
  const [itemsRows] = await pool.execute(
    `SELECT loc.*, p.marca, p.modelo 
     FROM linea_orden_compra loc
     JOIN producto p ON loc.producto_id_producto = p.id_producto
     WHERE loc.orden_compra_id_orden_compra = ?`,
    [id]
  );

  // 3. Combinar todo
  const ordenCompleta = ordenRows[0];
  ordenCompleta.items = itemsRows;

  return ordenCompleta;
};

module.exports = {
  create,
  findAll,
  findById,
  // Omitimos 'update' y 'delete' por ahora, ya que las órdenes no se editan,
  // se cancelan (lo cual requiere un campo 'estado' que no tienes)
};