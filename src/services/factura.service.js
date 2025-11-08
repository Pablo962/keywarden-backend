// src/services/factura.service.js

const facturaRepo = require('../repositories/factura.repository.js');
const ordenRepo = require('../repositories/orden_compra.repository.js');

const createFactura = async (data) => {
  const { orden_compra_id_orden_compra, items, info_pago } = data;

  // 1. Validar que la Orden de Compra exista
  const orden = await ordenRepo.findById(orden_compra_id_orden_compra);
  if (!orden) {
    throw new Error('La Orden de Compra asociada no existe.');
  }
  const idProveedorDeLaOrden = orden.proveedor_id_proveedor;

  // 2. Validar y calcular subtotales de items
  let importeFactura = 0;
  for (const item of items) {
    item.subtotal = item.cantidad * item.precio_unitario;
    importeFactura += item.subtotal;
  }

  // 3. Generar el Plan de Pagos 
  const cuotasGeneradas = [];
  const { cantidad_cuotas, primer_vencimiento } = info_pago;
  const importePorCuota = importeFactura / cantidad_cuotas;
  let fechaVencimiento = new Date(primer_vencimiento);
  let ultimaFechaVencimiento = new Date(fechaVencimiento); 

  for (let i = 1; i <= cantidad_cuotas; i++) {
    let fechaCuota = new Date(fechaVencimiento); 
    cuotasGeneradas.push({
      numero_cuota: i,
      importe: importePorCuota,
      fecha_vencimiento: fechaCuota,
    });
    ultimaFechaVencimiento = fechaCuota;
    fechaVencimiento.setDate(fechaVencimiento.getDate() + 30); 
  }

  // 4. Preparar la cabecera de la factura 
  const facturaData = {
    importe: importeFactura,
    fecha_vencimiento: ultimaFechaVencimiento,
    estado: 'Pendiente', 
    orden_compra_id_orden_compra: orden_compra_id_orden_compra,
    proveedor_id_proveedor: idProveedorDeLaOrden, 
    orden_compra_proveedor_id_proveedor: idProveedorDeLaOrden 
  };

  // 5. Llamar al repositorio para la transacción
  return await facturaRepo.create(facturaData, items, cuotasGeneradas);
};


const getAllFacturas = async () => {
  return await facturaRepo.findAll();
};

const getFacturaById = async (id) => {
  const factura = await facturaRepo.findById(id);
  if (!factura) {
    throw new Error('Factura no encontrada.');
  }
  return factura;
};

/**
 * Marca una cuota como pagada
 */
const pagarCuota = async (idCuota, dataPago) => {
  // 1. Verificar que la cuota existe
  const cuota = await facturaRepo.findCuotaById(idCuota);
  if (!cuota) {
    throw new Error('Cuota no encontrada.');
  }

  // 2. Verificar que está pendiente
  if (cuota.estado !== 'Pendiente') {
    throw new Error(`La cuota ya está en estado: ${cuota.estado}. No se puede pagar.`);
  }

  // 3. Validar método de pago
  const metodosValidos = ['Efectivo', 'Transferencia', 'Cheque', 'Tarjeta'];
  if (dataPago.metodo_pago && !metodosValidos.includes(dataPago.metodo_pago)) {
    throw new Error(`Método de pago inválido. Opciones: ${metodosValidos.join(', ')}`);
  }

  // 4. Registrar el pago
  const result = await facturaRepo.pagarCuota(idCuota, dataPago);
  if (result === 0) {
    throw new Error('No se pudo registrar el pago. La cuota podría haber sido modificada.');
  }

  return { 
    message: 'Cuota pagada exitosamente.',
    cuota_id: idCuota,
    fecha_pago: dataPago.fecha_pago || new Date(),
    metodo_pago: dataPago.metodo_pago
  };
};

module.exports = {
  createFactura,
  getAllFacturas,
  getFacturaById,
  pagarCuota,
};