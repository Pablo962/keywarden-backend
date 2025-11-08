// src/services/calificacionProveedor.service.js
const calificacionProvRepo = require('../repositories/calificacionProveedor.repository');
const incidenteRepo = require('../repositories/incidente.repository');
const proveedorRepo = require('../repositories/proveedor.repository');

const createCalificacion = async (data) => {
  const { incidente_idincidente, proveedor_id_proveedor } = data;

  // Validar que el incidente exista
  const incidente = await incidenteRepo.findById(incidente_idincidente);
  if (!incidente) {
    throw new Error('El incidente no existe.');
  }

  // Solo se califican incidentes "Resueltos"
  if (incidente.estado !== 'Resuelto') {
    throw new Error('Solo se pueden calificar incidentes resueltos.');
  }
  
  // Validar que el proveedor exista
  const proveedor = await proveedorRepo.findById(proveedor_id_proveedor);
  if (!proveedor) {
    throw new Error('El proveedor no existe.');
  }
  
  // Evitar calificaciones duplicadas
  const calificacionExistente = await calificacionProvRepo.findByIncidenteId(incidente_idincidente);
  if (calificacionExistente) {
    throw new Error('Este incidente ya tiene una calificación de proveedor.');
  }

  return await calificacionProvRepo.create(data);
};

const getAllCalificaciones = async () => {
  return await calificacionProvRepo.findAll();
};

const getResumenProveedores = async () => {
  return await calificacionProvRepo.getResumenProveedores();
};

const getCalificacionesPorProveedor = async (proveedorId) => {
  return await calificacionProvRepo.findByProveedorId(proveedorId);
};

module.exports = {
  createCalificacion,
  getAllCalificaciones,
  getResumenProveedores,
  getCalificacionesPorProveedor,
};
