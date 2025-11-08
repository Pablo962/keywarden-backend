const calificacionRepo = require('../repositories/calificacion.repository.js');
const incidenteRepo = require('../repositories/incidente.repository.js');
const proveedorRepo = require('../repositories/proveedor.repository.js');

const createCalificacion = async (data) => {
  const { puntaje, incidente_idincidente, proveedor_id_proveedor } = data;

  // 1. Validar que el incidente exista
  const incidente = await incidenteRepo.findById(incidente_idincidente);
  if (!incidente) {
    throw new Error('El incidente asociado no existe.');
  }

  // 2. Lógica de Negocio: Solo se califican incidentes "Resueltos"
  if (incidente.estado !== 'Resuelto') {
    throw new Error('Solo se pueden calificar incidentes que ya han sido "Resueltos".');
  }
  
  // 3. Validar que el proveedor exista
  const proveedor = await proveedorRepo.findById(proveedor_id_proveedor);
  if (!proveedor) {
    throw new Error('El proveedor asociado no existe.');
  }
  
  // 4. Lógica de Negocio: Evitar calificaciones duplicadas
  const calificacionExistente = await calificacionRepo.findByIncidenteId(incidente_idincidente);
  if (calificacionExistente) {
    throw new Error('Este incidente ya ha sido calificado.');
  }
  
  // 5. Validar que el puntaje esté en rango
  if (puntaje < 1 || puntaje > 5) {
     throw new Error('El puntaje debe estar entre 1 y 5.');
  }

  return await calificacionRepo.create(data);
};

const getCalificacionesPorProveedor = async (proveedorId) => {
  return await calificacionRepo.findAllByProveedorId(proveedorId);
};

const getAllCalificaciones = async () => {
  return await calificacionRepo.findAll();
};

const getPromedioPorProveedor = async (proveedorId) => {
  const promedio = await calificacionRepo.getPromedioByProveedorId(proveedorId);
  return {
    proveedor_id: proveedorId,
    puntaje_promedio: promedio ? parseFloat(promedio).toFixed(2) : 'Sin calificaciones'
  };
};

module.exports = {
  createCalificacion,
  getCalificacionesPorProveedor,
  getAllCalificaciones,
  getPromedioPorProveedor,
};