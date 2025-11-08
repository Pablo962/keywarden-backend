// src/repositories/dashboard.repository.js
const pool = require('../config/db');

/**
 * KPI 1: Contadores Generales (Proveedores Activos, Productos, Incidentes Abiertos)
 */
const getKpiCounts = async () => {
  // Ejecutamos 3 consultas de conteo en paralelo
  const [proveedorRows] = await pool.execute(
    "SELECT COUNT(id_proveedor) as total_proveedores_activos FROM proveedor WHERE estado_proveedor = 'Activo'"
  );
  const [productoRows] = await pool.execute(
    "SELECT COUNT(id_producto) as total_productos FROM producto WHERE estado_producto = 'Activo'"
  );
  const [incidenteRows] = await pool.execute(
    "SELECT COUNT(idincidente) as total_incidentes_abiertos FROM incidente WHERE estado = 'Abierto' OR estado = 'En Progreso'"
  );

  return {
    proveedores_activos: proveedorRows[0].total_proveedores_activos,
    productos_registrados: productoRows[0].total_productos,
    incidentes_abiertos: incidenteRows[0].total_incidentes_abiertos,
  };
};

/**
 * KPI 2: Métricas Financieras (R5 - Deuda y Vencimientos)
 */
const getKpiFinanciero = async () => {
  const [deudaRows] = await pool.execute(
    "SELECT SUM(importe) as total_deuda_pendiente FROM plan_pago WHERE estado = 'Pendiente'"
  );
  const [vencidosRows] = await pool.execute(
    "SELECT COUNT(id_plan_pago) as cuotas_vencidas FROM plan_pago WHERE estado = 'Pendiente' AND fecha_vencimiento < CURDATE()"
  );

  return {
    total_deuda_pendiente: parseFloat(deudaRows[0].total_deuda_pendiente || 0),
    cuotas_vencidas: vencidosRows[0].cuotas_vencidas,
  };
};

/**
 * KPI 3: Tiempos de Servicio (R7 - Respuesta y Resolución)
 */
const getKpiTiemposServicio = async () => {
  // Usamos TIMESTAMPDIFF para calcular la diferencia en SEGUNDOS
  const [rows] = await pool.execute(
    `SELECT
      AVG(TIMESTAMPDIFF(SECOND, i.fecha_apertura, st.fecha_inicio)) as tiempo_respuesta_avg_seg,
      AVG(TIMESTAMPDIFF(SECOND, st.fecha_inicio, st.fecha_final)) as tiempo_resolucion_avg_seg  -- <-- CORREGIDO
     FROM servicio_tecnico st
     JOIN incidente i ON st.incidente_idincidente = i.idincidente
     WHERE 
       st.fecha_inicio IS NOT NULL 
       AND st.fecha_final IS NOT NULL` // <-- CORREGIDO
  );

  // Función para convertir segundos a un formato legible (ej: "1h 30m 15s")
  const formatearSegundos = (segundos) => {
    if (!segundos) return 'N/A';
    segundos = Math.floor(segundos);
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return {
    tiempo_respuesta_promedio: formatearSegundos(rows[0].tiempo_respuesta_avg_seg),
    tiempo_resolucion_promedio: formatearSegundos(rows[0].tiempo_resolucion_avg_seg),
  };
};

/**
 * KPI 4: Desempeño de Proveedores y Técnicos (Calificación Promedio)
 */
const getKpiDesempeno = async () => {
  // Promedio de calificaciones de proveedores
  const [provRows] = await pool.execute(
    `SELECT AVG(puntaje_promedio) as calificacion_promedio_proveedores 
     FROM calificacion_proveedor`
  );
  
  // Promedio de calificaciones de técnicos
  const [tecRows] = await pool.execute(
    `SELECT AVG(puntaje) as calificacion_promedio_tecnicos 
     FROM calificacion_tecnico`
  );
  
  const promedioProveedores = provRows[0].calificacion_promedio_proveedores;
  const promedioTecnicos = tecRows[0].calificacion_promedio_tecnicos;

  return {
    calificacion_promedio_proveedores: promedioProveedores ? parseFloat(promedioProveedores).toFixed(2) : 'N/A',
    calificacion_promedio_tecnicos: promedioTecnicos ? parseFloat(promedioTecnicos).toFixed(2) : 'N/A'
  };
};


module.exports = {
  getKpiCounts,
  getKpiFinanciero,
  getKpiTiemposServicio,
  getKpiDesempeno,
};