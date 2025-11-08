// src/controllers/incidente.controller.js

const incidenteService = require('../services/incidente.service.js');

const create = async (req, res) => {
  try {
    const { descripcion, producto_id_producto } = req.body;
    // El ID del usuario que reporta lo sacamos del token
    const usuarioId = req.user.id; 

    if (!descripcion || !producto_id_producto) {
      return res.status(400).json({ message: 'Campos obligatorios: descripcion y producto_id_producto' });
    }

    const newId = await incidenteService.createIncidente(req.body, usuarioId);
    res.status(201).json({ id: newId, ...req.body });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    console.log('[DEBUG] Llamando a getAllIncidentes...');
    const incidentes = await incidenteService.getAllIncidentes();
    console.log('[DEBUG] Incidentes obtenidos exitosamente:', incidentes.length);
    res.status(200).json(incidentes);
  } catch (error) {
    console.error('[ERROR] Error completo en getAll:', error);
    res.status(500).json({ message: error.message, error: error.toString() });
  }
};

const getById = async (req, res) => {
  try {
    // Tu ID es 'idincidente', pero el parámetro en la URL es 'id'
    const incidente = await incidenteService.getIncidenteById(req.params.id);
    res.status(200).json(incidente);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const updated = await incidenteService.updateIncidente(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await incidenteService.deleteIncidente(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// --- Controladores de Flujo de Trabajo (R7) ---

const asignar = async (req, res) => {
  try {
    const { id } = req.params; // ID del incidente
    const { tecnico_id_tecnico } = req.body;

    if (!tecnico_id_tecnico) {
      return res.status(400).json({ message: 'El campo "tecnico_id_tecnico" es obligatorio.' });
    }
    
    const result = await incidenteService.asignarTecnico(id, tecnico_id_tecnico);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const resolver = async (req, res) => {
  try {
    const { id } = req.params; // ID del incidente
    // Tu columna es 'descripcion', no 'descripcion_solucion'
    const { descripcion } = req.body; 

    if (!descripcion) {
      return res.status(400).json({ message: 'El campo "descripcion" de la solución es obligatorio.' });
    }

    const result = await incidenteService.resolverIncidente(id, descripcion);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  asignar,
  resolver,
};