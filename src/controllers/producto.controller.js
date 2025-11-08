// src/controllers/producto.controller.js

const productoService = require('../services/producto.service.js');

const create = async (req, res) => {
  try {
    // Validamos los campos obligatorios para R2
    const { 
      numero_de_serie, 
      marca, 
      modelo, 
      fecha_adquisicion, 
      fecha_vencimiento_garantia, 
      proveedor_id_proveedor 
    } = req.body;

    if (!numero_de_serie || !marca || !modelo || !fecha_adquisicion || !fecha_vencimiento_garantia || !proveedor_id_proveedor) {
      return res.status(400).json({ 
        message: 'Campos obligatorios faltantes: numero_de_serie, marca, modelo, fechas de adquisición/garantía y proveedor' 
      });
    }

    const newProductoId = await productoService.createProducto(req.body);
    res.status(201).json({ id: newProductoId, ...req.body });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const productos = await productoService.getAllProductos();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const producto = await productoService.getProductoById(req.params.id);
    res.status(200).json(producto);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const updatedProducto = await productoService.updateProducto(req.params.id, req.body);
    res.status(200).json(updatedProducto);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await productoService.deleteProducto(req.params.id);
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