const dashboardService = require('../services/dashboard.service.js');

const getReporte = async (req, res) => {
  try {
    const reporte = await dashboardService.getReporteEjecutivo();
    res.status(200).json(reporte);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al generar el reporte ejecutivo: ' + error.message 
    });
  }
};

module.exports = {
  getReporte,
};