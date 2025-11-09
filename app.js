// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db');

const authRoutes = require('./src/routes/auth.routes');
const proveedorRoutes = require('./src/routes/proveedor.routes');
const productoRoutes = require('./src/routes/producto.routes');
const tecnicoRoutes = require('./src/routes/tecnico.routes');
const incidenteRoutes = require('./src/routes/incidente.routes');
const ordenCompraRoutes = require('./src/routes/orden_compra.routes');
const facturaRoutes = require('./src/routes/factura.routes');
const calificacionTecnicoRoutes = require('./src/routes/calificacionTecnico.routes');
const calificacionProveedorRoutes = require('./src/routes/calificacionProveedor.routes');
const alertasRoutes = require('./src/routes/alertas.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');
const reportesRoutes = require('./src/routes/reportes.routes');

// Inicializar la aplicación
const app = express();
app.use(express.json());

// Configuración CORS para permitir frontend en Vercel
app.use(cors({
  origin: [
    'http://localhost:5173',           // Desarrollo local
    'http://localhost:3000',           // Desarrollo local alternativo
    process.env.FRONTEND_URL,          // URL de Vercel (configurar en Railway)
    /\.vercel\.app$/                   // Cualquier subdominio de Vercel
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Rutas ---
app.get('/api', (req, res) => {
  res.json({ message: '¡API de Keywarden funcionando!' });
});

// --- HEALTH CHECK (para servicios de hosting) ---
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// --- NUEVA RUTA DE PRUEBA DE BASE DE DATOS ---
app.get('/api/test-db', async (req, res) => {
  try {
    // 1. Obtener una conexión del pool
    const connection = await pool.getConnection();
    
    // 2. Ejecutar una consulta de prueba simple
    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    
    // 3. Devolver la conexión al pool (¡muy importante!)
    connection.release();
    
    // 4. Enviar el resultado al cliente
    res.json(rows[0]); // rows[0] será { result: 2 }

  } catch (error) {
    // 5. Manejar cualquier error
    console.error('Error en /api/test-db:', error);
    res.status(500).json({ error: 'Error al conectar o consultar la base de datos' });
  }
});

// ENDPOINT DE PRUEBA CALIFICACIONES (SIN AUTH)
app.get('/api/test-calificaciones', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Verificar tablas
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'calificacion%'"
    );
    
    // Verificar vistas
    const [views] = await connection.execute(
      "SHOW FULL TABLES WHERE table_type = 'VIEW' AND Tables_in_admtfi LIKE 'v_resumen%'"
    );
    
    // Intentar query a vista técnicos
    let resumenTecnicos = null;
    let errorTecnicos = null;
    try {
      const [rows] = await connection.execute('SELECT * FROM v_resumen_tecnicos LIMIT 5');
      resumenTecnicos = rows;
    } catch (err) {
      errorTecnicos = err.message;
    }
    
    // Intentar query a vista proveedores
    let resumenProveedores = null;
    let errorProveedores = null;
    try {
      const [rows] = await connection.execute('SELECT * FROM v_resumen_proveedores LIMIT 5');
      resumenProveedores = rows;
    } catch (err) {
      errorProveedores = err.message;
    }
    
    connection.release();
    
    res.json({
      tables,
      views,
      resumenTecnicos,
      errorTecnicos,
      resumenProveedores,
      errorProveedores
    });
  } catch (error) {
    console.error('Error en test-calificaciones:', error);
    res.status(500).json({ error: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/tecnicos', tecnicoRoutes);
app.use('/api/incidentes', incidenteRoutes);
app.use('/api/ordenes-compra', ordenCompraRoutes);
app.use('/api/facturas', facturaRoutes);
app.use('/api/calificaciones/tecnicos', calificacionTecnicoRoutes);
app.use('/api/calificaciones/proveedores', calificacionProveedorRoutes);
app.use('/api/alertas', alertasRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reportes', reportesRoutes);

// --- Iniciar el Servidor ---
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});