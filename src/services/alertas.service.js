const alertasRepo = require('../repositories/alertas.repository.js');

const getAlertasDeVencimiento = async (queryParams) => {
  
  const dias = queryParams.dias || 7;

  const vencimientos = await alertasRepo.findVencimientosProximos(dias);
  
  return {
    buscando_en_proximos_dias: dias,
    cantidad_alertas: vencimientos.length,
    vencimientos: vencimientos,
  };
};

const getAlertasDeGarantia = async (queryParams) => {

  const dias = queryParams.dias || 30;

  const garantias = await alertasRepo.findGarantiasProximas(dias);
  
  return {
    buscando_en_proximos_dias: dias,
    cantidad_alertas: garantias.length,
    garantias: garantias,
  };
};

module.exports = {
  getAlertasDeVencimiento,
  getAlertasDeGarantia,
};