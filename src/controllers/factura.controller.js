// src/controllers/factura.controller.js

const facturaService = require('../services/factura.service.js');

const create = async (req, res) => {
  try {
    const { orden_compra_id_orden_compra, items, info_pago } = req.body;

    // --- Validaciones del Body ---
    if (!orden_compra_id_orden_compra || !items || !info_pago) {
      return res.status(400).json({ 
        message: 'Campos obligatorios: orden_compra_id_orden_compra, array de items, y objeto info_pago' 
      });
    }
    if (!Array.isArray(items) || items.length === 0) {
       return res.status(400).json({ message: 'El campo "items" debe ser un array no vacío.' });
    }
    if (!info_pago.cantidad_cuotas || !info_pago.primer_vencimiento) {
       return res.status(400).json({ message: 'El campo "info_pago" debe contener: cantidad_cuotas y primer_vencimiento (YYYY-MM-DD)' });
    }

    const newFacturaId = await facturaService.createFactura(req.body);
    res.status(201).json({ id: newFacturaId, ...req.body });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const facturas = await facturaService.getAllFacturas();
    res.status(200).json(facturas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const factura = await facturaService.getFacturaById(req.params.id);
    res.status(200).json(factura);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * Marca una cuota como pagada (R5).
 */
const pagarCuota = async (req, res) => {
  try {
    const { id } = req.params; // ID de la cuota (plan_pago)
    const { fecha_pago, metodo_pago, observaciones } = req.body;

    console.log('[DEBUG] Datos recibidos para pagar cuota:', { id, fecha_pago, metodo_pago, observaciones });

    // Validar que al menos venga el método de pago
    if (!metodo_pago) {
      return res.status(400).json({ 
        message: 'El campo "metodo_pago" es obligatorio. Opciones: Efectivo, Transferencia, Cheque, Tarjeta' 
      });
    }

    const result = await facturaService.pagarCuota(id, { fecha_pago, metodo_pago, observaciones });
    res.status(200).json(result);
  } catch (error) {
    console.error('[ERROR] Error al pagar cuota:', error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  pagarCuota,
};