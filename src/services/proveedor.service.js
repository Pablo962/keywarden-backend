// src/services/proveedor.service.js

const proveedorRepo = require('../repositories/proveedor.repository');

const createProveedor = async (data) => {
  // Regla de Negocio (R1): Validar CUIT único
  const existing = await proveedorRepo.findByCuit(data.cuit);
  if (existing) {
    throw new Error('El CUIT ingresado ya pertenece a otro proveedor.');
  }
  return await proveedorRepo.create(data);
};

const getAllProveedores = async () => {
  return await proveedorRepo.findAll();
};

const getProveedorById = async (id) => {
  const proveedor = await proveedorRepo.findById(id);
  if (!proveedor) {
    throw new Error('Proveedor no encontrado.');
  }
  return proveedor;
};

const updateProveedor = async (id, data) => {
  // Verificamos que al menos uno de los campos válidos venga
  const { razon_social, email, telefono } = data;
  if (razon_social === undefined && email === undefined && telefono === undefined) {
    throw new Error('No hay datos válidos para actualizar. Envíe al menos: razon_social, email, o telefono');
  }

  const result = await proveedorRepo.update(id, data);
  
  if (result === 0) {
    // Esto ahora significa "Proveedor no encontrado" O "No se envió ningún campo válido"
    throw new Error('Proveedor no encontrado o ningún dato válido para actualizar.');
  }
  
  // Devuelve solo los datos que se enviaron (o puedes hacer un findById para devolver el objeto completo)
  return { id_actualizado: id, ...data }; 
};

const deleteProveedor = async (id) => {
  const result = await proveedorRepo.logicalDelete(id);
  if (result === 0) {
    throw new Error('Proveedor no encontrado.');
  }
  return { message: 'Proveedor dado de baja (baja lógica).' };
};

module.exports = {
  createProveedor,
  getAllProveedores,
  getProveedorById,
  updateProveedor,
  deleteProveedor,
};