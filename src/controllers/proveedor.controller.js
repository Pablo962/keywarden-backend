// src/controllers/proveedor.controller.js

const proveedorService = require('../services/proveedor.service');

// POST / (CU02)
const create = async (req, res) => {
  try {
    // Validamos los campos que esperamos del body (según tus columnas)
    const {razon_social, email, telefono, cuit } = req.body;
    if (!razon_social || !cuit || !email) {
      return res.status(400).json({ 
        message: 'Campos obligatorios faltantes: razon_social, email, cuit' 
      });
    }
    const newProveedorId = await proveedorService.createProveedor(req.body);
    res.status(201).json({ id: newProveedorId, ...req.body });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /
const getAll = async (req, res) => {
  try {
    const proveedores = await proveedorService.getAllProveedores();
    res.status(200).json(proveedores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /:id
const getById = async (req, res) => {
  try {
    const proveedor = await proveedorService.getProveedorById(req.params.id);
    res.status(200).json(proveedor);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// PUT /:id (CU03)
const update = async (req, res) => {
  try {
    const updatedProveedor = await proveedorService.updateProveedor(req.params.id, req.body);
    res.status(200).json(updatedProveedor);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// DELETE /:id (CU04)
const remove = async (req, res) => {
  try {
    const result = await proveedorService.deleteProveedor(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};