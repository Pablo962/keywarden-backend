// src/controllers/calificacionTecnico.controller.js
const calificacionTecService = require('../services/calificacionTecnico.service');

const create = async (req, res) => {
  try {
    const { puntaje, comentario, tecnico_id_tecnico, incidente_idincidente } = req.body;

    if (!puntaje || !tecnico_id_tecnico || !incidente_idincidente) {
      return res.status(400).json({ 
        message: 'Campos obligatorios: puntaje, tecnico_id_tecnico, incidente_idincidente' 
      });
    }
    
    const newId = await calificacionTecService.createCalificacion(req.body);
    res.status(201).json({ id: newId, ...req.body });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    console.log('🔍 GET /api/calificaciones/tecnicos - Usuario:', req.user);
    const calificaciones = await calificacionTecService.getAllCalificaciones();
    console.log('✅ Calificaciones obtenidas:', calificaciones.length);
    res.status(200).json(calificaciones);
  } catch (error) {
    console.error('❌ Error en getAll tecnicos:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getResumen = async (req, res) => {
  try {
    console.log('🔍 GET /api/calificaciones/tecnicos/resumen - Usuario:', req.user);
    const resumen = await calificacionTecService.getResumenTecnicos();
    console.log('✅ Resumen obtenido, técnicos:', resumen.length);
    res.status(200).json(resumen);
  } catch (error) {
    console.error('❌ Error en getResumen tecnicos:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getByTecnico = async (req, res) => {
  try {
    const { tecnicoId } = req.params;
    const calificaciones = await calificacionTecService.getCalificacionesPorTecnico(tecnicoId);
    res.status(200).json(calificaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  create,
  getAll,
  getResumen,
  getByTecnico,
};
