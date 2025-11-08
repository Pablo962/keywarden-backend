const alertasService = require('../services/alertas.service.js');

const getVencimientos = async (req, res) => {
  try {
    // req.query será { dias: '30' } si la URL es ...?dias=30
    const alertas = await alertasService.getAlertasDeVencimiento(req.query);
    res.status(200).json(alertas);
  } catch (error) {
    res.status(500).json({ message: 'Error al generar el reporte de alertas: ' + error.message });
  }
};

/**
 * GET /api/alertas/garantias
 * Endpoint para R2 - Alertas de garantías próximas a vencer.
 */
const getGarantias = async (req, res) => {
  try {
    const alertas = await alertasService.getAlertasDeGarantia(req.query);
    res.status(200).json(alertas);
  } catch (error) {
    res.status(500).json({ message: 'Error al generar el reporte de garantías: ' + error.message });
  }
};

module.exports = {
  getVencimientos,
  getGarantias,
};