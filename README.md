# 🔐 Keywarden Backend

Sistema de gestión de proveedores de equipamiento informático con control de incidencias, servicios técnicos, facturación y reportes ejecutivos.

## 📋 Requerimientos del Sistema

- **R1:** Gestión de proveedores de equipamiento informático
- **R2:** Registro de equipos con fechas de adquisición y garantía
- **R3:** Calificación de proveedores según nivel de cumplimiento
- **R4:** Registro de técnicos autorizados por proveedor
- **R5:** Gestión de pagos diferidos con alertas de vencimientos
- **R7:** Historial de incidencias y servicios técnicos con medición de tiempos
- **R8:** Control de acceso por roles (Admin/Consultor)
- **R9:** Asociación de facturas y comprobantes a compras
- **R10:** Panel de KPIs para toma de decisiones ejecutivas

## 🚀 Instalación

### Prerrequisitos

- Node.js (v14 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd keywarden-backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus credenciales de MySQL
```

4. **Crear la base de datos**
```bash
mysql -u root -p < database/schema.sql
```

5. **Iniciar el servidor**
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
node app.js
```

El servidor estará corriendo en `http://localhost:4000`

## 📁 Estructura del Proyecto

```
keywarden-backend/
├── app.js                      # Punto de entrada
├── package.json
├── .env                        # Variables de entorno (NO subir a git)
├── .env.example                # Plantilla de variables de entorno
├── database/
│   └── schema.sql              # Script de creación de BD
├── src/
│   ├── config/
│   │   └── db.js               # Configuración de MySQL
│   ├── middleware/
│   │   ├── auth.middleware.js  # Autenticación JWT
│   │   └── role.middleware.js  # Autorización por roles
│   ├── routes/                 # Definición de endpoints
│   ├── controllers/            # Controladores de rutas
│   ├── services/               # Lógica de negocio
│   └── repositories/           # Acceso a datos
```

## 🔐 Autenticación

El sistema usa JWT (JSON Web Tokens) para autenticación.

### Registro de Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "rol": 1
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": 1
  }
}
```

### Usar el Token

Incluir en el header `Authorization` de todas las peticiones protegidas:

```http
GET /api/proveedores
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 👥 Roles

- **Rol 1 - Administrador:** Acceso completo (crear, editar, eliminar)
- **Rol 2 - Consultor:** Solo lectura/consulta

## 📡 Endpoints Principales

### Proveedores (R1)
- `POST /api/proveedores` - Crear proveedor (Admin)
- `GET /api/proveedores` - Listar proveedores (Admin, Consultor)
- `GET /api/proveedores/:id` - Ver proveedor (Admin, Consultor)
- `PUT /api/proveedores/:id` - Actualizar proveedor (Admin)
- `DELETE /api/proveedores/:id` - Eliminar proveedor (Admin)

### Productos/Equipos (R2)
- `POST /api/productos` - Registrar equipo (Admin)
- `GET /api/productos` - Listar equipos (Admin, Consultor)
- `GET /api/productos/:id` - Ver equipo con garantía (Admin, Consultor)
- `PUT /api/productos/:id` - Actualizar equipo (Admin)
- `DELETE /api/productos/:id` - Dar de baja equipo (Admin)

### Técnicos (R4)
- `POST /api/tecnicos` - Registrar técnico (Admin)
- `GET /api/tecnicos` - Listar técnicos (Admin, Consultor)
- `GET /api/tecnicos/:id` - Ver técnico (Admin, Consultor)
- `PUT /api/tecnicos/:id` - Actualizar técnico (Admin)
- `DELETE /api/tecnicos/:id` - Eliminar técnico (Admin)

### Incidentes (R7)
- `POST /api/incidentes` - Reportar incidente (Admin, Consultor)
- `GET /api/incidentes` - Listar incidentes (Admin, Consultor)
- `GET /api/incidentes/:id` - Ver incidente (Admin, Consultor)
- `POST /api/incidentes/:id/asignar` - Asignar técnico (Admin)
- `POST /api/incidentes/:id/resolver` - Resolver incidente (Admin)

### Órdenes de Compra (R9)
- `POST /api/ordenes-compra` - Crear orden (Admin)
- `GET /api/ordenes-compra` - Listar órdenes (Admin, Consultor)
- `GET /api/ordenes-compra/:id` - Ver orden (Admin, Consultor)

### Facturas (R5, R9)
- `POST /api/facturas` - Registrar factura con cuotas (Admin)
- `GET /api/facturas` - Listar facturas (Admin, Consultor)
- `GET /api/facturas/:id` - Ver factura completa (Admin, Consultor)
- `PUT /api/facturas/cuotas/:id/pagar` - **NUEVO:** Marcar cuota como pagada (Admin)

### Calificaciones (R3)
- `POST /api/calificaciones` - Calificar proveedor (Admin)
- `GET /api/calificaciones/proveedor/:id` - Ver calificaciones (Admin, Consultor)
- `GET /api/calificaciones/proveedor/:id/promedio` - Ver promedio (Admin, Consultor)

### Alertas (R5, R2)
- `GET /api/alertas/vencimientos?dias=30` - Alertas de cuotas por vencer (Admin, Consultor)
- `GET /api/alertas/garantias?dias=30` - **NUEVO:** Alertas de garantías por vencer (Admin, Consultor)

### Dashboard (R10)
- `GET /api/dashboard` - Reporte ejecutivo con KPIs (Admin, Consultor)

### Reportes Ejecutivos (NUEVO)
- `GET /api/reportes/ranking-proveedores?limit=10` - Ranking de proveedores por calificación
- `GET /api/reportes/incidentes/proveedor/:id` - Historial de incidentes por proveedor
- `GET /api/reportes/incidentes/producto/:id` - Historial de incidentes por producto
- `GET /api/reportes/tecnicos/desempeno` - Desempeño de técnicos
- `GET /api/reportes/financiero/proveedor/:id` - Reporte financiero detallado
- `GET /api/reportes/productos/garantias?estado=vencida` - Productos por estado de garantía

## 📊 Ejemplo de Respuesta del Dashboard

```json
{
  "reporte_generado": "2025-11-07T10:30:00.000Z",
  "kpis_generales": {
    "proveedores_activos": 15,
    "productos_registrados": 120,
    "incidentes_abiertos": 8
  },
  "kpis_financieros": {
    "total_deuda_pendiente": 250000.50,
    "cuotas_vencidas": 3
  },
  "kpis_servicio": {
    "tiempo_respuesta_promedio": "2h 15m 30s",
    "tiempo_resolucion_promedio": "5h 45m 20s"
  },
  "kpis_desempeno": {
    "calificacion_promedio": "4.35"
  }
}
```

## 🔧 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `4000` |
| `DB_HOST` | Host de MySQL | `localhost` |
| `DB_USER` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contraseña de MySQL | `tu_password` |
| `DB_NAME` | Nombre de la BD | `admtfi` |
| `JWT_SECRET` | Secreto para JWT | `frase_secreta_larga` |
| `NODE_ENV` | Entorno | `development` o `production` |

## 🛠️ Tecnologías

- **Node.js + Express** - Framework backend
- **MySQL2** - Base de datos relacional
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas
- **dotenv** - Variables de entorno
- **CORS** - Control de acceso cross-origin

## 📝 Scripts Disponibles

```bash
# Desarrollo con auto-restart
npm run dev

# Testing
npm test

# Producción
node app.js
```

## 🚨 Seguridad

- Las contraseñas se hashean con bcrypt antes de guardar
- JWT con expiración de 24 horas
- Validación de roles en cada endpoint
- CORS configurado
- SQL Injection protegido con prepared statements

---

**Desarrollado para la gestión eficiente de proveedores de TI** 🚀
