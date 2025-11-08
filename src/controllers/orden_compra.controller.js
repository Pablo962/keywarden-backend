// src/services/orden_compra.service.js

// src/controllers/orden_compra.controller.js

const ordenCompraService = require('../services/orden_compra.service.js');

const create = async (req, res) => {
  try {
    // Leemos los campos de tu tabla 'orden_compra'
    const { cuotas, proveedor_id_proveedor, items } = req.body;

    if (cuotas === undefined || !proveedor_id_proveedor || !items) {
      return res.status(400).json({ 
        message: 'Campos obligatorios: cuotas, proveedor_id_proveedor, y un array de items' 
      });
    }
    
    if (!Array.isArray(items) || items.length === 0) {
       return res.status(400).json({ message: 'El campo "items" debe ser un array no vacío.' });
    }

    const newOrdenId = await ordenCompraService.createOrden(req.body);
    res.status(201).json({ id: newOrdenId, ...req.body });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const ordenes = await ordenCompraService.getAllOrdenes();
    res.status(200).json(ordenes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const orden = await ordenCompraService.getOrdenById(req.params.id);
    res.status(200).json(orden);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  create,
  getAll,
  getById,
};