// src/services/tecnico.service.js

const tecnicoRepo = require('../repositories/tecnico.repository.js');

const createTecnico = async (data) => {
  // Lógica de negocio: Validar DNI único
  const existing = await tecnicoRepo.findByDocumento(data.documento); // Usamos 'documento'
  if (existing) {
    throw new Error('El Documento ingresado ya pertenece a otro técnico.');
  }
  return await tecnicoRepo.create(data);
};

const getAllTecnicos = async (filtros) => {
  return await tecnicoRepo.findAll(filtros);
};

const getTecnicoById = async (id) => {
  const tecnico = await tecnicoRepo.findById(id);
  if (!tecnico) {
    throw new Error('Técnico no encontrado.');
  }
  return tecnico;
};

const updateTecnico = async (id, data) => {
  const result = await tecnicoRepo.update(id, data);
  if (result === 0) {
    throw new Error('Técnico no encontrado o datos sin cambios.');
  }
  return { id_actualizado: id, ...data };
};

// ¡CAMBIO! Usamos 'remove' (baja física)
const deleteTecnico = async (id) => {
  const result = await tecnicoRepo.remove(id);
  if (result === 0) {
    throw new Error('Técnico no encontrado.');
  }
  return { message: 'Técnico eliminado físicamente.' }; // Mensaje actualizado
};

module.exports = {
  createTecnico,
  getAllTecnicos,
  getTecnicoById,
  updateTecnico,
  deleteTecnico,
};