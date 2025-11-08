// src/services/producto.service.js

const productoRepo = require('../repositories/producto.repository.js');

const createProducto = async (data) => {
  // Validación: La fecha de vencimiento de garantía debe ser posterior a la fecha de adquisición
  const fechaAdquisicion = new Date(data.fecha_adquisicion);
  const fechaGarantia = new Date(data.fecha_vencimiento_garantia);
  
  if (fechaGarantia <= fechaAdquisicion) {
    throw new Error('La fecha de vencimiento de garantía debe ser posterior a la fecha de adquisición.');
  }
  
  // Validación: La fecha de adquisición no puede ser futura
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (fechaAdquisicion > hoy) {
    throw new Error('La fecha de adquisición no puede ser futura.');
  }
  
  return await productoRepo.create(data);
};

const getAllProductos = async () => {
  return await productoRepo.findAll();
};

const getProductoById = async (id) => {
  const producto = await productoRepo.findById(id);
  if (!producto) {
    throw new Error('Producto (equipo) no encontrado.');
  }
  return producto;
};

const updateProducto = async (id, data) => {
  const result = await productoRepo.update(id, data);
  if (result === 0) {
    throw new Error('Producto no encontrado o datos sin cambios.');
  }
  return { id_actualizado: id, ...data };
};

const deleteProducto = async (id) => {
  const result = await productoRepo.logicalDelete(id);
  if (result === 0) {
    throw new Error('Producto no encontrado.');
  }
  return { message: 'Producto dado de baja (baja lógica).' };
};

module.exports = {
  createProducto,
  getAllProductos,
  getProductoById,
  updateProducto,
  deleteProducto,
};