// src/repositories/alertas.repository.js
const pool = require('../config/db');

/**
 * Busca en 'plan_pago' todas las cuotas "Pendientes"
 * que venzan entre hoy y los próximos 'dias' especificados.
 */
const findVencimientosProximos = async (dias) => {
  
  // CURDATE() = Fecha de Hoy
  // DATE_ADD(CURDATE(), INTERVAL ? DAY) = Hoy + X días
  const query = `
    SELECT 
      pp.id_plan_pago,
      pp.numero_cuota,
      pp.importe,
      pp.fecha_vencimiento,
      pp.estado,
      f.id_factura,
      p.razon_social as proveedor_nombre
    FROM plan_pago pp
    JOIN factura f ON pp.factura_id_factura = f.id_factura
    JOIN proveedor p ON f.proveedor_id_proveedor = p.id_proveedor
    WHERE 
      pp.estado = 'Pendiente'
      AND pp.fecha_vencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
    ORDER BY 
      pp.fecha_vencimiento ASC;
  `;

  const [rows] = await pool.execute(query, [dias]);
  return rows;
};

/**
 * Busca productos cuya garantía vence en los próximos X días (R2).
 */
const findGarantiasProximas = async (dias) => {
  const query = `
    SELECT 
      p.id_producto,
      p.numero_de_serie,
      p.marca,
      p.modelo,
      p.fecha_adquisicion,
      p.fecha_vencimiento_garantia,
      DATEDIFF(p.fecha_vencimiento_garantia, CURDATE()) AS dias_restantes,
      pr.id_proveedor,
      pr.razon_social as proveedor_nombre,
      pr.telefono as proveedor_telefono,
      pr.email as proveedor_email
    FROM producto p
    JOIN proveedor pr ON p.proveedor_id_proveedor = pr.id_proveedor
    WHERE 
      p.estado_producto = 'Activo'
      AND p.fecha_vencimiento_garantia BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
    ORDER BY 
      p.fecha_vencimiento_garantia ASC;
  `;

  const [rows] = await pool.execute(query, [dias]);
  return rows;
};

module.exports = {
  findVencimientosProximos,
  findGarantiasProximas,
};