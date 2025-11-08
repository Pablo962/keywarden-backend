-- ============================================
-- KEYWARDEN - DATOS DE EJEMPLO PARA PRODUCCIÓN
-- ============================================
-- Ejecutar DESPUÉS de schema.sql
-- Estos datos son visibles inmediatamente en el frontend

-- ============================================
-- PROVEEDORES (3 ejemplos)
-- ============================================
INSERT INTO proveedor (razon_social, cuit, email, telefono, estado_proveedor) VALUES
('TechSupply Argentina S.A.', '30-12345678-9', 'contacto@techsupply.com.ar', '1145678900', 'Activo'),
('CompuWorld Distribuciones', '30-98765432-1', 'ventas@compuworld.com.ar', '1156789012', 'Activo'),
('InfoTech Solutions S.R.L.', '30-11223344-5', 'info@infotech.com.ar', '1167890123', 'Activo'),
('Digital Systems S.A.', '30-55667788-9', 'sistemas@digitalsys.com.ar', '1178901234', 'Activo');

-- ============================================
-- TÉCNICOS (uno por proveedor)
-- ============================================
INSERT INTO tecnico (nombre, documento, email, telefono, especialidad, vigencia_desde, vigencia_hasta, proveedor_id_proveedor) VALUES
('Juan Pérez', '12345678', 'jperez@techsupply.com.ar', '1145678901', 'Hardware y Redes', '2024-01-01', '2025-12-31', 1),
('María González', '23456789', 'mgonzalez@compuworld.com.ar', '1156789013', 'Soporte Técnico', '2024-02-01', '2025-12-31', 2),
('Carlos Rodríguez', '34567890', 'crodriguez@infotech.com.ar', '1167890124', 'Reparación y Mantenimiento', '2024-03-01', '2025-12-31', 3),
('Ana Martínez', '45678901', 'amartinez@digitalsys.com.ar', '1178901235', 'Redes y Conectividad', '2024-01-15', '2025-12-31', 4);

-- ============================================
-- PRODUCTOS (Equipos informáticos)
-- ============================================
INSERT INTO producto (marca, modelo, categoria, numero_de_serie, fecha_adquisicion, fecha_vencimiento_garantia, proveedor_id_proveedor, estado_producto) VALUES
-- Notebooks
('Dell', 'Latitude 5420', 'Notebook', 'DL-SN-001234', '2024-01-15', '2026-01-15', 1, 'Activo'),
('HP', 'ProBook 450 G9', 'Notebook', 'HP-SN-567890', '2024-02-20', '2026-02-20', 2, 'Activo'),
('Lenovo', 'ThinkPad X1 Carbon', 'Notebook', 'LN-SN-112233', '2024-03-10', '2026-03-10', 3, 'Activo'),
('Asus', 'ZenBook 14', 'Notebook', 'AS-SN-445566', '2024-04-05', '2026-04-05', 4, 'Activo'),

-- Computadoras de Escritorio
('Dell', 'OptiPlex 7090', 'Desktop', 'DL-SN-778899', '2024-01-20', '2026-01-20', 1, 'Activo'),
('HP', 'ProDesk 600', 'Desktop', 'HP-SN-334455', '2024-02-25', '2026-02-25', 2, 'Activo'),

-- Servidores
('Dell', 'PowerEdge R740', 'Servidor', 'DL-SRV-998877', '2024-01-10', '2027-01-10', 1, 'Activo'),
('HP', 'ProLiant DL380', 'Servidor', 'HP-SRV-665544', '2024-02-15', '2027-02-15', 2, 'Activo'),

-- Monitores
('Samsung', 'S24F350', 'Monitor', 'SM-MON-123456', '2024-03-01', '2025-03-01', 3, 'Activo'),
('LG', '27UL500', 'Monitor', 'LG-MON-789012', '2024-03-05', '2025-03-05', 4, 'Activo');

-- ============================================
-- ÓRDENES DE COMPRA
-- ============================================
INSERT INTO orden_compra (fecha_emision, proveedor_id_proveedor, importe_total, estado) VALUES
('2024-01-05', 1, 45000.00, 'Entregada'),
('2024-02-10', 2, 32000.00, 'Entregada'),
('2024-03-01', 3, 58000.00, 'Entregada'),
('2024-04-01', 4, 28000.00, 'Pendiente');

-- ============================================
-- ITEMS DE ÓRDENES DE COMPRA
-- ============================================
-- Orden 1
INSERT INTO item_orden_compra (orden_compra_id_orden_compra, producto_id_producto, cantidad, precio_unitario) VALUES
(1, 1, 2, 22500.00),  -- 2 Dell Latitude
(1, 5, 1, 18000.00);  -- 1 Dell OptiPlex (Desktop)

-- Orden 2
INSERT INTO item_orden_compra (orden_compra_id_orden_compra, producto_id_producto, cantidad, precio_unitario) VALUES
(2, 2, 1, 25000.00),  -- 1 HP ProBook
(2, 6, 1, 7000.00);   -- 1 HP ProDesk

-- Orden 3
INSERT INTO item_orden_compra (orden_compra_id_orden_compra, producto_id_producto, cantidad, precio_unitario) VALUES
(3, 3, 2, 29000.00);  -- 2 Lenovo ThinkPad

-- Orden 4
INSERT INTO item_orden_compra (orden_compra_id_orden_compra, producto_id_producto, cantidad, precio_unitario) VALUES
(4, 4, 1, 28000.00);  -- 1 Asus ZenBook

-- ============================================
-- FACTURAS (asociadas a órdenes)
-- ============================================
INSERT INTO factura (numero_factura, fecha_emision, orden_compra_id_orden_compra, proveedor_id_proveedor, importe_total, estado) VALUES
('FAC-0001-00000123', '2024-01-20', 1, 1, 45000.00, 'Pendiente'),
('FAC-0002-00000456', '2024-02-25', 2, 2, 32000.00, 'Pagada'),
('FAC-0003-00000789', '2024-03-15', 3, 3, 58000.00, 'Pendiente');

-- ============================================
-- PLANES DE PAGO (cuotas de facturas)
-- ============================================
-- Factura 1: 3 cuotas de $15,000
INSERT INTO plan_pago (factura_id_factura, numero_cuota, importe, fecha_vencimiento, estado) VALUES
(1, 1, 15000.00, '2024-02-20', 'Pagado'),
(1, 2, 15000.00, '2024-03-20', 'Pendiente'),
(1, 3, 15000.00, '2024-04-20', 'Pendiente');

-- Factura 2: 2 cuotas de $16,000
INSERT INTO plan_pago (factura_id_factura, numero_cuota, importe, fecha_vencimiento, estado) VALUES
(2, 1, 16000.00, '2024-03-25', 'Pagado'),
(2, 2, 16000.00, '2024-04-25', 'Pagado');

-- Factura 3: 4 cuotas de $14,500
INSERT INTO plan_pago (factura_id_factura, numero_cuota, importe, fecha_vencimiento, estado) VALUES
(3, 1, 14500.00, '2024-04-15', 'Pendiente'),
(3, 2, 14500.00, '2024-05-15', 'Pendiente'),
(3, 3, 14500.00, '2024-06-15', 'Pendiente'),
(3, 4, 14500.00, '2024-07-15', 'Pendiente');

-- ============================================
-- INCIDENTES
-- ============================================
-- Usuario admin tiene id_usuario = 1 (del schema.sql)
INSERT INTO incidente (descripcion, fecha_apertura, estado, usuario_id_usuario, producto_id_producto) VALUES
('Problemas con la pantalla del notebook Dell Latitude', '2024-03-01 10:30:00', 'Resuelto', 1, 1),
('No enciende el equipo HP ProBook', '2024-03-15 14:00:00', 'En Progreso', 1, 2),
('Lentitud en el sistema operativo', '2024-04-01 09:15:00', 'Abierto', 1, 3),
('Servidor presenta errores de conectividad', '2024-04-05 11:45:00', 'Abierto', 1, 7);

-- ============================================
-- SERVICIOS TÉCNICOS (solo para incidentes asignados)
-- ============================================
-- Incidente 1: Resuelto por Juan Pérez
INSERT INTO servicio_tecnico (fecha_inicio, fecha_final, descripcion, tecnico_idtecnico, tecnico_proveedor_id_proveedor, incidente_idincidente) VALUES
('2024-03-01 11:00:00', '2024-03-01 16:00:00', 'Se reemplazó el panel LCD defectuoso. Equipo funcionando correctamente.', 1, 1, 1);

-- Incidente 2: En progreso con María González
INSERT INTO servicio_tecnico (fecha_inicio, fecha_final, descripcion, tecnico_idtecnico, tecnico_proveedor_id_proveedor, incidente_idincidente) VALUES
('2024-03-15 15:00:00', NULL, NULL, 2, 2, 2);

-- ============================================
-- CALIFICACIONES DE PROVEEDORES
-- ============================================
INSERT INTO calificacion_proveedor (puntaje, comentario, fecha_calificacion, incidente_idincidente, proveedor_id_proveedor) VALUES
(4.5, 'Excelente atención y rapidez en la resolución del problema', '2024-03-02 09:00:00', 1, 1),
(4.0, 'Buen servicio, aunque tardaron un poco en responder', '2024-02-20 10:30:00', 1, 1);

-- ============================================
-- CALIFICACIONES DE TÉCNICOS
-- ============================================
INSERT INTO calificacion_tecnico (puntaje, comentario, fecha_calificacion, servicio_tecnico_id_servicio_tecnico, tecnico_idtecnico) VALUES
(5.0, 'Muy profesional y eficiente. Resolvió el problema rápidamente.', '2024-03-02 09:30:00', 1, 1);

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Ejecutar estas queries para verificar que todo se insertó correctamente:

-- SELECT COUNT(*) as total_proveedores FROM proveedor;
-- SELECT COUNT(*) as total_tecnicos FROM tecnico;
-- SELECT COUNT(*) as total_productos FROM producto;
-- SELECT COUNT(*) as total_ordenes FROM orden_compra;
-- SELECT COUNT(*) as total_facturas FROM factura;
-- SELECT COUNT(*) as total_incidentes FROM incidente;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. Estos datos aparecerán INMEDIATAMENTE en el frontend de Vercel
-- 2. El usuario admin (admin@keywarden.com / Admin123) puede ver todo
-- 3. Los IDs se asignan automáticamente (AUTO_INCREMENT)
-- 4. Las fechas están en formato 'YYYY-MM-DD' o 'YYYY-MM-DD HH:MM:SS'
-- 5. Todos los estados son válidos según el schema

-- ============================================
-- FIN DEL ARCHIVO
-- ============================================
