// src/services/calificacionTecnico.service.js
const calificacionTecRepo = require('../repositories/calificacionTecnico.repository');
const incidenteRepo = require('../repositories/incidente.repository');
const tecnicoRepo = require('../repositories/tecnico.repository');

const createCalificacion = async (data) => {
  const { puntaje, tecnico_id_tecnico, incidente_idincidente } = data;

  // Validar que el incidente exista
  const incidente = await incidenteRepo.findById(incidente_idincidente);
  if (!incidente) {
    throw new Error('El incidente no existe.');
  }

  // Solo se califican incidentes "Resueltos"
  if (incidente.estado !== 'Resuelto') {
    throw new Error('Solo se pueden calificar incidentes resueltos.');
  }
  
  // Validar que el técnico exista
  const tecnico = await tecnicoRepo.findById(tecnico_id_tecnico);
  if (!tecnico) {
    throw new Error('El técnico no existe.');
  }
  
  // Evitar calificaciones duplicadas
  const calificacionExistente = await calificacionTecRepo.findByIncidenteId(incidente_idincidente);
  if (calificacionExistente) {
    throw new Error('Este incidente ya tiene una calificación de técnico.');
  }
  
  // Validar rango de puntaje
  if (puntaje < 1 || puntaje > 5) {
     throw new Error('El puntaje debe estar entre 1 y 5.');
  }

  return await calificacionTecRepo.create(data);
};

const getAllCalificaciones = async () => {
  return await calificacionTecRepo.findAll();
};

const getResumenTecnicos = async () => {
  return await calificacionTecRepo.getResumenTecnicos();
};

const getCalificacionesPorTecnico = async (tecnicoId) => {
  return await calificacionTecRepo.findByTecnicoId(tecnicoId);
};

module.exports = {
  createCalificacion,
  getAllCalificaciones,
  getResumenTecnicos,
  getCalificacionesPorTecnico,
};
