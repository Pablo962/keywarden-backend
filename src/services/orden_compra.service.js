// src/services/orden_compra.service.js

const ordenCompraRepo = require('../repositories/orden_compra.repository.js');
const productoRepo = require('../repositories/producto.repository.js');
const proveedorRepo = require('../repositories/proveedor.repository.js');

const createOrden = async (data) => {
  const { proveedor_id_proveedor, items } = data;

  // 1. Validar que el proveedor exista
  const proveedor = await proveedorRepo.findById(proveedor_id_proveedor);
  if (!proveedor) {
    throw new Error('El proveedor especificado no existe.');
  }

  // 2. Validar que la lista de items no esté vacía
  if (!items || items.length === 0) {
    throw new Error('La orden de compra debe tener al menos un ítem.');
  }

  // 3. Validar productos y CALCULAR SUBTOTALES
  for (const item of items) {
    // Validar que el producto exista
    const producto = await productoRepo.findById(item.producto_id_producto);
    if (!producto) {
      throw new Error(`El producto con ID ${item.producto_id_producto} no existe.`);
    }
    
    // Validar campos del item
    if (!item.cantidad || !item.precio_unitario) {
       throw new Error(`El ítem ${item.producto_id_producto} no tiene cantidad o precio.`);
    }

    // ¡Cálculo del subtotal!
    item.subtotal = item.cantidad * item.precio_unitario;
  }

  // 4. Llamar al repositorio con los 'items' ya modificados (con el subtotal)
  return await ordenCompraRepo.create(data);
};

const getAllOrdenes = async () => {
  return await ordenCompraRepo.findAll();
};

const getOrdenById = async (id) => {
  const orden = await ordenCompraRepo.findById(id);
  if (!orden) {
    throw new Error('Orden de Compra no encontrada.');
  }
  return orden;
};

module.exports = {
  createOrden,
  getAllOrdenes,
  getOrdenById,
};