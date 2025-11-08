// src/repositories/factura.repository.js
const pool = require('../config/db');

/**
 * Crea una Factura, sus Detalles y su Plan de Pagos (Cuotas)
 * usando una transacción para asegurar la integridad (R5 y R9).
 */
const create = async (facturaData, items, cuotas) => {
  // --- CORREGIDO: Leemos 'importe' y 'fecha_vencimiento' ---
  const { 
    importe, 
    fecha_vencimiento, 
    estado, 
    orden_compra_id_orden_compra, 
    proveedor_id_proveedor, 
    orden_compra_proveedor_id_proveedor // <-- La que faltaba
  } = facturaData;
  
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 3. Insertar la Factura (CORREGIDO)
    const [facturaResult] = await connection.execute(
      `INSERT INTO factura 
       (fecha_emision, fecha_vencimiento, importe, estado, orden_compra_id_orden_compra, proveedor_id_proveedor, orden_compra_proveedor_id_proveedor) 
       VALUES (NOW(), ?, ?, ?, ?, ?, ?)`, // <-- 7 columnas
      [
        fecha_vencimiento, 
        importe, 
        estado, 
        orden_compra_id_orden_compra, 
        proveedor_id_proveedor, 
        orden_compra_proveedor_id_proveedor // <-- El valor que faltaba
      ]
    );
    const newFacturaId = facturaResult.insertId;

    // 4. Insertar los Detalles de la Factura (Sin cambios)
    const queryDetalles = 
      `INSERT INTO detalle_factura 
       (cantidad, precio_unitario, subtotal, factura_id_factura, producto_id_producto) 
       VALUES (?, ?, ?, ?, ?)`;
    
    await Promise.all(
      items.map(item => {
        return connection.execute(queryDetalles, [
          item.cantidad, item.precio_unitario, item.subtotal, newFacturaId, item.producto_id_producto
        ]);
      })
    );

    // 5. Insertar el Plan de Pagos (Sin cambios)
    const queryCuotas = 
      `INSERT INTO plan_pago
       (factura_id_factura, numero_cuota, importe, fecha_vencimiento, estado)
       VALUES (?, ?, ?, ?, ?)`;
    
    await Promise.all(
      cuotas.map(cuota => {
        return connection.execute(queryCuotas, [
          newFacturaId, cuota.numero_cuota, cuota.importe, cuota.fecha_vencimiento, 'Pendiente'
        ]);
      })
    );

    await connection.commit();
    return newFacturaId;

  } catch (error) {
    await connection.rollback();
    console.error('Error en la transacción de Factura:', error);
    throw new Error('Error al registrar la factura: ' + error.message);
  } finally {
    connection.release();
  }
};

/**
 * Devuelve todas las Facturas con sus datos completos.
 */
const findAll = async () => {
  const [rows] = await pool.execute(
    `SELECT 
       f.id_factura,
       f.fecha_emision,
       f.fecha_vencimiento,
       f.importe as monto_total,
       f.estado,
       f.orden_compra_id_orden_compra,
       f.proveedor_id_proveedor,
       p.razon_social as proveedor_nombre,
       oc.id_orden_compra,
       COUNT(pp.id_plan_pago) as cuotas
     FROM factura f
     JOIN proveedor p ON f.proveedor_id_proveedor = p.id_proveedor
     JOIN orden_compra oc ON f.orden_compra_id_orden_compra = oc.id_orden_compra
     LEFT JOIN plan_pago pp ON f.id_factura = pp.factura_id_factura
     GROUP BY f.id_factura, f.fecha_emision, f.fecha_vencimiento, f.importe, f.estado, 
              f.orden_compra_id_orden_compra, f.proveedor_id_proveedor, p.razon_social, oc.id_orden_compra
     ORDER BY f.fecha_emision DESC`
  );
  return rows;
};

/**
 * Devuelve una Factura completa (cabecera + detalles + plan de pagos).
 */
const findById = async (id) => {
  // 1. Obtener la cabecera
  const [facturaRows] = await pool.execute(
    `SELECT f.*, p.razon_social as proveedor_nombre
     FROM factura f
     JOIN proveedor p ON f.proveedor_id_proveedor = p.id_proveedor
     WHERE f.id_factura = ?`,
    [id]
  );
  if (!facturaRows[0]) return undefined;

  // 2. Obtener los detalles (items)
  const [itemsRows] = await pool.execute(
    `SELECT d.*, p.marca, p.modelo
     FROM detalle_factura d
     JOIN producto p ON d.producto_id_producto = p.id_producto
     WHERE d.factura_id_factura = ?`,
    [id]
  );

  // 3. Obtener el plan de pagos (cuotas)
  const [cuotasRows] = await pool.execute(
    `SELECT * FROM plan_pago WHERE factura_id_factura = ? ORDER BY numero_cuota ASC`,
    [id]
  );

  // 4. Combinar todo
  const facturaCompleta = facturaRows[0];
  facturaCompleta.items = itemsRows;
  facturaCompleta.plan_pago = cuotasRows;

  return facturaCompleta;
};

/**
 * Marca una cuota como pagada (R5).
 */
const pagarCuota = async (idCuota, dataPago) => {
  const { fecha_pago, metodo_pago, observaciones } = dataPago;
  
  const [result] = await pool.execute(
    `UPDATE plan_pago 
     SET estado = 'Pagado', fecha_pago = ?, metodo_pago = ?, observaciones = ?
     WHERE id_plan_pago = ? AND estado = 'Pendiente'`,
    [fecha_pago || new Date(), metodo_pago, observaciones, idCuota]
  );
  
  return result.affectedRows;
};

/**
 * Obtiene una cuota específica.
 */
const findCuotaById = async (idCuota) => {
  const [rows] = await pool.execute(
    `SELECT pp.*, f.id_factura, f.importe as importe_factura, pr.razon_social as proveedor_nombre
     FROM plan_pago pp
     JOIN factura f ON pp.factura_id_factura = f.id_factura
     JOIN proveedor pr ON f.proveedor_id_proveedor = pr.id_proveedor
     WHERE pp.id_plan_pago = ?`,
    [idCuota]
  );
  return rows[0];
};

module.exports = {
  create,
  findAll,
  findById,
  pagarCuota,
  findCuotaById,
};