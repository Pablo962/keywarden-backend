const dashboardRepo = require('../repositories/dashboard.repository.js');

const getReporteEjecutivo = async () => {
 
  const [
    kpiCounts,
    kpiFinanciero,
    kpiTiemposServicio,
    kpiDesempeno
  ] = await Promise.all([
    dashboardRepo.getKpiCounts(),
    dashboardRepo.getKpiFinanciero(),
    dashboardRepo.getKpiTiemposServicio(),
    dashboardRepo.getKpiDesempeno()
  ]);

  const reporte = {
    reporte_generado: new Date().toISOString(),
    kpis_generales: kpiCounts,
    kpis_financieros: kpiFinanciero,
    kpis_servicio: kpiTiemposServicio,
    kpis_desempeno: kpiDesempeno,
  };

  return reporte;
};

module.exports = {
  getReporteEjecutivo,
};