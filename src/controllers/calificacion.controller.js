// src/controllers/calificacion.controller.js

const calificacionService = require('../services/calificacion.service.js');

const create = async (req, res) => {
  try {
    const { 
      puntaje, 
      servicio_postventa,
      precios,
      tiempos_entrega,
      calidad_productos,
      comentario, 
      proveedor_id_proveedor, 
      incidente_idincidente 
    } = req.body;

    if (!puntaje || !proveedor_id_proveedor || !incidente_idincidente) {
      return res.status(400).json({ 
        message: 'Campos obligatorios: puntaje, proveedor_id_proveedor, incidente_idincidente' 
      });
    }
    
    // Pasamos el body completo (incluyendo campos opcionales)
    const newId = await calificacionService.createCalificacion(req.body);
    res.status(201).json({ id: newId, ...req.body });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const calificaciones = await calificacionService.getAllCalificaciones();
    res.status(200).json(calificaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllByProveedor = async (req, res) => {
  try {
    const { proveedorId } = req.params;
    const calificaciones = await calificacionService.getCalificacionesPorProveedor(proveedorId);
    res.status(200).json(calificaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Endpoint clave para R3/R10
const getPromedio = async (req, res) => {
  try {
    const { proveedorId } = req.params;
    const promedio = await calificacionService.getPromedioPorProveedor(proveedorId);
    res.status(200).json(promedio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  create,
  getAll,
  getAllByProveedor,
  getPromedio,
};