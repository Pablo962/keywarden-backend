// src/controllers/tecnico.controller.js

const tecnicoService = require('../services/tecnico.service.js');

const create = async (req, res) => {
  try {
    // Validamos los campos que marcaste como 'NN' (Not Null)
    const { 
      nombre, 
      documento, 
      email, 
      telefono,
      vigencia_desde,
      vigencia_hasta,
      especialidad,
      proveedor_id_proveedor 
    } = req.body;

    if (!nombre || !documento || !email || !telefono || !vigencia_desde || !vigencia_hasta || !especialidad || !proveedor_id_proveedor) {
      return res.status(400).json({ 
        message: 'Todos los campos son obligatorios: nombre, documento, email, telefono, vigencias, especialidad y proveedor.' 
      });
    }

    const newTecnicoId = await tecnicoService.createTecnico(req.body);
    res.status(201).json({ id: newTecnicoId, ...req.body });
  } catch (error) {
    // Captura el error de DNI duplicado del servicio
    res.status(400).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    // req.query contendrá: { nombre: 'Roberto', especialidad: 'Redes' }
    const filtros = req.query; 
    
    const tecnicos = await tecnicoService.getAllTecnicos(filtros);
    res.status(200).json(tecnicos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const tecnico = await tecnicoService.getTecnicoById(req.params.id);
    res.status(200).json(tecnico);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const updatedTecnico = await tecnicoService.updateTecnico(req.params.id, req.body);
    res.status(200).json(updatedTecnico);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await tecnicoService.deleteTecnico(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};