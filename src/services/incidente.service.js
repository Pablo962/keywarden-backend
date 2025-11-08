const incidenteRepo = require('../repositories/incidente.repository.js');
const servicioRepo = require('../repositories/servicio_tecnico.repository.js');
const tecnicoRepo = require('../repositories/tecnico.repository.js');

const createIncidente = async (data, usuarioId) => {
  return await incidenteRepo.create(data, usuarioId);
};

const getAllIncidentes = async () => {
  return await incidenteRepo.findAll();
};

const getIncidenteById = async (id) => {
  const incidente = await incidenteRepo.findById(id);
  if (!incidente) {
    throw new Error('Incidente no encontrado.');
  }
  return incidente;
};

const updateIncidente = async (id, data) => {
  const result = await incidenteRepo.update(id, data);
  if (result === 0) {
    throw new Error('Incidente no encontrado o datos sin cambios.');
  }
  return { id_actualizado: id, ...data };
};

const deleteIncidente = async (id) => {
  const result = await incidenteRepo.remove(id);
  if (result === 0) {
    throw new Error('Incidente no encontrado.');
  }
  return { message: 'Incidente eliminado.' };
};

const asignarTecnico = async (incidenteId, tecnicoId) => {
  // 1. Verificar que el incidente existe y está 'Abierto'
  const incidente = await incidenteRepo.findById(incidenteId);
  if (!incidente) throw new Error('Incidente no encontrado.');
  if (incidente.estado !== 'Abierto') {
    throw new Error('El incidente ya ha sido asignado o está resuelto.');
  }

  // 2. Buscar al técnico para obtener su ID de proveedor
  const tecnico = await tecnicoRepo.findById(tecnicoId);
  if (!tecnico) {
    throw new Error('Técnico no encontrado.');
  }
  
  // 3. Extraer el ID del proveedor del técnico
  const proveedorId = tecnico.proveedor_id_proveedor; 
  if (!proveedorId) {
    throw new Error('Error crítico: El técnico no tiene un proveedor asociado.');
  }

  // 4.El técnico debe pertenecer al proveedor del producto
  const proveedorProducto = incidente.proveedor_id_proveedor;
  if (proveedorId !== proveedorProducto) {
    throw new Error(
      `El técnico pertenece al proveedor ${tecnico.proveedor_id_proveedor}, ` +
      `pero el producto es del proveedor ${proveedorProducto}. ` +
      `Debe asignar un técnico del mismo proveedor.`
    );
  }

  // 6. Crear el registro de servicio
  await servicioRepo.crearServicio(incidenteId, tecnicoId, proveedorId);

  // 7. Actualizar el estado del incidente
  await incidenteRepo.updateEstado(incidenteId, 'En Progreso');
  
  return { message: 'Técnico asignado. Incidente "En Progreso".' };
};

const resolverIncidente = async (incidenteId, descripcion) => {
  // 1. Verificar que el incidente existe y está 'En Progreso'
  const incidente = await incidenteRepo.findById(incidenteId);
  if (!incidente) throw new Error('Incidente no encontrado.');
  if (incidente.estado !== 'En Progreso') {
    throw new Error('El incidente no está "En Progreso". No se puede resolver.');
  }

  // 2. Verificar que existe el servicio técnico
  const servicio = await servicioRepo.findByIncidenteId(incidenteId);
  if (!servicio) {
    throw new Error('Error crítico: El incidente está "En Progreso" pero no tiene servicio técnico asociado.');
  }

  // 3. Actualizar el servicio 
  await servicioRepo.resolverServicio(incidenteId, descripcion);

  // 4. Actualizar el estado del incidente
  await incidenteRepo.updateEstado(incidenteId, 'Resuelto');

  return { message: 'Incidente resuelto exitosamente.' };
};

module.exports = {
  createIncidente,
  getAllIncidentes,
  getIncidenteById,
  updateIncidente,
  deleteIncidente,
  asignarTecnico,
  resolverIncidente,
};