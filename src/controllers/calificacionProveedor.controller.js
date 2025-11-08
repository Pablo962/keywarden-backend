// src/controllers/calificacionProveedor.controller.js
const calificacionProvService = require('../services/calificacionProveedor.service');

const create = async (req, res) => {
  try {
    const { 
      servicio_postventa,
      precios,
      tiempos_entrega,
      calidad_productos,
      proveedor_id_proveedor, 
      incidente_idincidente 
    } = req.body;

    if (!servicio_postventa || !precios || !tiempos_entrega || !calidad_productos || !proveedor_id_proveedor || !incidente_idincidente) {
      return res.status(400).json({ 
        message: 'Campos obligatorios: servicio_postventa, precios, tiempos_entrega, calidad_productos, proveedor_id_proveedor, incidente_idincidente' 
      });
    }
    
    const newId = await calificacionProvService.createCalificacion(req.body);
    res.status(201).json({ id: newId, ...req.body });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    console.log('🔍 GET /api/calificaciones/proveedores - Usuario:', req.user);
    const calificaciones = await calificacionProvService.getAllCalificaciones();
    console.log('✅ Calificaciones proveedores obtenidas:', calificaciones.length);
    res.status(200).json(calificaciones);
  } catch (error) {
    console.error('❌ Error en getAll proveedores:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getResumen = async (req, res) => {
  try {
    console.log('🔍 GET /api/calificaciones/proveedores/resumen - Usuario:', req.user);
    const resumen = await calificacionProvService.getResumenProveedores();
    console.log('✅ Resumen proveedores obtenido:', resumen.length);
    res.status(200).json(resumen);
  } catch (error) {
    console.error('❌ Error en getResumen proveedores:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getByProveedor = async (req, res) => {
  try {
    const { proveedorId } = req.params;
    const calificaciones = await calificacionProvService.getCalificacionesPorProveedor(proveedorId);
    res.status(200).json(calificaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  create,
  getAll,
  getResumen,
  getByProveedor,
};
