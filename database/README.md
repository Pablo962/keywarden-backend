# Base de Datos KeyWarden

## Instrucciones de Configuración

### Desarrollo Local (MySQL en tu PC)

1. Abrir MySQL Workbench o línea de comandos
2. Ejecutar el archivo `schema.sql`:
```sql
SOURCE C:/Users/pc/keywarden-backend/database/schema.sql;
```

O copiar y pegar el contenido de `schema.sql` directamente.

### Producción (Base de datos en la nube)

#### Opción A: Railway
1. Crear proyecto en Railway.app
2. Agregar servicio MySQL
3. Copiar las credenciales
4. Conectarse con MySQL Workbench usando las credenciales de Railway
5. Ejecutar `schema.sql` para crear las tablas

#### Opción B: PlanetScale
1. Crear cuenta en PlanetScale.com
2. Crear nueva base de datos
3. Obtener string de conexión
4. Usar el CLI o interface web para ejecutar `schema.sql`

## Variables de Entorno

Configurar en el servicio de hosting:

```env
DB_HOST=<host-de-railway-o-planetscale>
DB_USER=<usuario>
DB_PASSWORD=<contraseña>
DB_NAME=keywarden
DB_PORT=3306
JWT_SECRET=<generar-clave-segura>
PORT=4000
```

## Datos Iniciales

El archivo `schema.sql` incluye:
- ✅ Estructura de todas las tablas
- ✅ Índices y relaciones
- ✅ Usuario administrador inicial (usuario: admin@keywarden.com, password: Admin123)

### Agregar Datos de Ejemplo (Opcional)

Para llenar la base de datos con datos de prueba visibles en el frontend:

1. **Primero ejecutar** `schema.sql`
2. **Luego ejecutar** `seeds.sql`:

```sql
SOURCE C:/Users/pc/keywarden-backend/database/seeds.sql;
```

O en producción (Railway/PlanetScale):
- Copiar el contenido de `seeds.sql`
- Pegarlo en la consola SQL de la plataforma
- Ejecutar

El archivo `seeds.sql` incluye:
- 4 proveedores
- 4 técnicos  
- 10 productos (notebooks, desktops, servidores, monitores)
- 4 órdenes de compra con items
- 3 facturas con planes de pago
- 4 incidentes (algunos resueltos, otros en progreso)
- Servicios técnicos asignados
- Calificaciones de ejemplo

**Estos datos aparecerán inmediatamente en el frontend desplegado en Vercel** ✅

## Seguridad

⚠️ **IMPORTANTE**: Cambiar la contraseña del usuario admin después del primer login en producción.
