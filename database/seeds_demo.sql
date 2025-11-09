-- ============================================
-- KEYWARDEN - DATOS DE DEMO COMPLETOS
-- ============================================
-- Datos realistas para demostrar todas las funcionalidades
-- Incluye: CRUD completo + Baja lógica + Calificaciones
-- ============================================

SET FOREIGN_KEY_CHECKS=0;

-- ============================================
-- 1. ROLES Y USUARIOS
-- ============================================

INSERT INTO rol (id_rol, nombre) VALUES
(1, 'Administrador'),
(2, 'Consultor'),
(3, 'Gerente')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

INSERT INTO usuario (id_usuario, nombre, email, password, rol_id_rol) VALUES
(1, 'Admin Principal', 'admin@keywarden.com', '$2a$10$kZXvhF3qXyKjYvXGJ5tHqO8yYxJ6mZYKZqJKqJKqJKqJKqJKqJKqJ', 1),
(2, 'María García', 'maria.garcia@keywarden.com', '$2a$10$kZXvhF3qXyKjYvXGJ5tHqO8yYxJ6mZYKZqJKqJKqJKqJKqJKqJKqJ', 2),
(3, 'Carlos Rodríguez', 'carlos.rodriguez@keywarden.com', '$2a$10$kZXvhF3qXyKjYvXGJ5tHqO8yYxJ6mZYKZqJKqJKqJKqJKqJKqJKqJ', 2),
(4, 'Ana Martínez', 'ana.martinez@keywarden.com', '$2a$10$kZXvhF3qXyKjYvXGJ5tHqO8yYxJ6mZYKZqJKqJKqJKqJKqJKqJKqJ', 3)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- ============================================
-- 2. SLA (Service Level Agreement)
-- ============================================

INSERT INTO sla (id_sla, nombre, tiempo_respuesta, penalidad, metrica_aplicacion) VALUES
(1, 'SLA Premium 24/7', '4 horas', '5% descuento mensual', 'Tiempo resolución < 24h'),
(2, 'SLA Estándar', '8 horas', '3% descuento mensual', 'Tiempo resolución < 48h'),
(3, 'SLA Básico', '24 horas', '2% descuento mensual', 'Tiempo resolución < 72h')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- ============================================
-- 3. PROVEEDORES (con estados activos e inactivos)
-- ============================================

INSERT INTO proveedor (id_proveedor, razon_social, email, telefono, estado_proveedor, cuit) VALUES
(1, 'HP Argentina S.A.', 'ventas@hp.com.ar', '011-4000-1234', 'Activo', '30-71234567-8'),
(2, 'Dell Technologies Argentina', 'soporte@dell.com.ar', '011-4000-5678', 'Activo', '30-71234568-9'),
(3, 'Lenovo Argentina', 'contacto@lenovo.com.ar', '011-4000-9012', 'Activo', '30-71234569-0'),
(4, 'Epson Argentina', 'info@epson.com.ar', '011-4000-3456', 'Activo', '30-71234570-1'),
(5, 'Cisco Systems Argentina', 'ventas@cisco.com.ar', '011-4000-7890', 'Activo', '30-71234571-2'),
(6, 'Microsoft Argentina', 'licencias@microsoft.com.ar', '011-4000-2345', 'Activo', '30-71234572-3'),
(7, 'Apple Argentina', 'business@apple.com.ar', '011-4000-6789', 'Inactivo', '30-71234573-4'),
(8, 'Samsung Electronics', 'corporate@samsung.com.ar', '011-4000-0123', 'Activo', '30-71234574-5'),
(9, 'TP-Link Argentina', 'soporte@tp-link.com.ar', '011-4000-4567', 'Inactivo', '30-71234575-6'),
(10, 'Asus Argentina', 'ventas@asus.com.ar', '011-4000-8901', 'Activo', '30-71234576-7')
ON DUPLICATE KEY UPDATE razon_social=VALUES(razon_social);

-- ============================================
-- 4. TÉCNICOS (asignados a proveedores)
-- ============================================

INSERT INTO tecnico (id_tecnico, nombre, documento, email, telefono, vigencia_desde, vigencia_hasta, especialidad, proveedor_id_proveedor) VALUES
-- HP (id 1)
(1, 'Roberto Fernández', '33456789', 'roberto.fernandez@hp.com.ar', '11-5678-1234', '2024-01-01', '2025-12-31', 'Hardware y Servidores', 1),
(2, 'Laura Gómez', '34567890', 'laura.gomez@hp.com.ar', '11-5678-5678', '2024-01-01', '2025-12-31', 'Impresoras y Periféricos', 1),
-- Dell (id 2)
(3, 'Martín López', '35678901', 'martin.lopez@dell.com.ar', '11-5678-9012', '2024-02-01', '2025-12-31', 'Laptops y Workstations', 2),
(4, 'Carla Sánchez', '36789012', 'carla.sanchez@dell.com.ar', '11-5678-3456', '2024-02-01', '2025-12-31', 'Servidores y Storage', 2),
-- Lenovo (id 3)
(5, 'Diego Pérez', '37890123', 'diego.perez@lenovo.com.ar', '11-5678-7890', '2024-03-01', '2025-12-31', 'ThinkPad y ThinkCentre', 3),
(6, 'Sofía Ramírez', '38901234', 'sofia.ramirez@lenovo.com.ar', '11-5678-2345', '2024-03-01', '2025-12-31', 'Tablets y Smartphones', 3),
-- Epson (id 4)
(7, 'Fernando Castro', '39012345', 'fernando.castro@epson.com.ar', '11-5678-6789', '2024-01-15', '2025-12-31', 'Impresoras Multifunción', 4),
-- Cisco (id 5)
(8, 'Gabriela Moreno', '40123456', 'gabriela.moreno@cisco.com.ar', '11-5678-0123', '2024-04-01', '2025-12-31', 'Redes y Switches', 5),
(9, 'Pablo Silva', '41234567', 'pablo.silva@cisco.com.ar', '11-5678-4567', '2024-04-01', '2025-12-31', 'Seguridad y Firewall', 5),
-- Samsung (id 8)
(10, 'Lucía Torres', '42345678', 'lucia.torres@samsung.com.ar', '11-5678-8901', '2024-05-01', '2025-12-31', 'Monitores y Displays', 8)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- ============================================
-- 5. PRODUCTOS (variedad de equipos)
-- ============================================

INSERT INTO producto (id_producto, marca, categoria, numero_de_serie, fecha_adquisicion, fecha_vencimiento_garantia, modelo, estado_producto, proveedor_id_proveedor) VALUES
-- HP
(1, 'HP', 'Laptop', 'HP-LAP-001-2024', '2024-01-15', '2027-01-15', 'EliteBook 840 G9', 'En uso', 1),
(2, 'HP', 'Servidor', 'HP-SRV-001-2024', '2024-02-01', '2027-02-01', 'ProLiant DL380 Gen10', 'En uso', 1),
(3, 'HP', 'Impresora', 'HP-IMP-001-2024', '2024-03-10', '2026-03-10', 'LaserJet Pro M404dn', 'En reparación', 1),
-- Dell
(4, 'Dell', 'Laptop', 'DELL-LAP-001-2024', '2024-01-20', '2027-01-20', 'Latitude 7430', 'En uso', 2),
(5, 'Dell', 'Workstation', 'DELL-WKS-001-2024', '2024-02-15', '2027-02-15', 'Precision 5820 Tower', 'En uso', 2),
(6, 'Dell', 'Monitor', 'DELL-MON-001-2024', '2024-03-05', '2027-03-05', 'UltraSharp U2723DE 27"', 'Disponible', 2),
-- Lenovo
(7, 'Lenovo', 'Laptop', 'LEN-LAP-001-2024', '2024-02-10', '2027-02-10', 'ThinkPad X1 Carbon Gen 11', 'En uso', 3),
(8, 'Lenovo', 'Desktop', 'LEN-DKT-001-2024', '2024-03-20', '2027-03-20', 'ThinkCentre M90q Gen 3', 'En uso', 3),
(9, 'Lenovo', 'Tablet', 'LEN-TAB-001-2024', '2024-04-01', '2026-04-01', 'Tab P11 Pro Gen 2', 'Dado de baja', 3),
-- Epson
(10, 'Epson', 'Impresora', 'EPS-IMP-001-2024', '2024-01-25', '2026-01-25', 'EcoTank L3250', 'En uso', 4),
(11, 'Epson', 'Scanner', 'EPS-SCN-001-2024', '2024-02-20', '2026-02-20', 'WorkForce DS-530', 'En reparación', 4),
-- Cisco
(12, 'Cisco', 'Switch', 'CSC-SWH-001-2024', '2024-03-15', '2029-03-15', 'Catalyst 9300 48-port', 'En uso', 5),
(13, 'Cisco', 'Router', 'CSC-RTR-001-2024', '2024-04-10', '2029-04-10', 'ISR 4331', 'En uso', 5),
(14, 'Cisco', 'Firewall', 'CSC-FWL-001-2024', '2024-05-05', '2029-05-05', 'Firepower 2130', 'En uso', 5),
-- Samsung
(15, 'Samsung', 'Monitor', 'SAM-MON-001-2024', '2024-02-28', '2027-02-28', 'Odyssey G7 32"', 'En uso', 8),
(16, 'Samsung', 'SSD', 'SAM-SSD-001-2024', '2024-03-25', '2029-03-25', '990 PRO 2TB NVMe', 'Disponible', 8),
-- Asus
(17, 'Asus', 'Laptop', 'ASU-LAP-001-2024', '2024-04-15', '2026-04-15', 'ZenBook 14 OLED', 'Dado de baja', 10),
(18, 'Asus', 'Router', 'ASU-RTR-001-2024', '2024-05-20', '2027-05-20', 'RT-AX86U Pro', 'En uso', 10)
ON DUPLICATE KEY UPDATE marca=VALUES(marca);

-- ============================================
-- 6. CONTRATOS
-- ============================================

INSERT INTO contrato (id_contrato, nombre, estado_contrato, fecha_inicio, fecha_fin, cobertura, adjunto_url, sla_id_sla, proveedor_id_proveedor) VALUES
(1, 'Contrato Soporte HP 2024', 'Vigente', '2024-01-01', '2024-12-31', 'Soporte integral hardware', '/contratos/hp-2024.pdf', 1, 1),
(2, 'Contrato Dell Enterprise', 'Vigente', '2024-02-01', '2025-01-31', 'Servidores y workstations', '/contratos/dell-2024.pdf', 1, 2),
(3, 'Contrato Lenovo Business', 'Vigente', '2024-03-01', '2024-12-31', 'Equipos corporativos', '/contratos/lenovo-2024.pdf', 2, 3),
(4, 'Contrato Epson Impresión', 'Vencido', '2023-06-01', '2024-05-31', 'Impresoras y consumibles', '/contratos/epson-2023.pdf', 3, 4),
(5, 'Contrato Cisco Networking', 'Vigente', '2024-04-01', '2025-03-31', 'Infraestructura de red', '/contratos/cisco-2024.pdf', 1, 5)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- ============================================
-- 7. INCIDENTES (variados estados)
-- ============================================

INSERT INTO incidente (idincidente, descripcion, fecha_apertura, estado, usuario_id_usuario, producto_id_producto) VALUES
-- Incidentes CERRADOS (para calificaciones)
(1, 'Laptop HP no enciende - Falla en fuente', '2024-06-01', 'Cerrado', 2, 1),
(2, 'Impresora HP con error de papel atascado', '2024-06-15', 'Cerrado', 3, 3),
(3, 'Monitor Dell sin señal de video', '2024-07-01', 'Cerrado', 2, 6),
(4, 'Switch Cisco sobrecalentamiento', '2024-07-10', 'Cerrado', 4, 12),
-- Incidentes EN PROGRESO
(5, 'Laptop Lenovo lenta - Posible virus', '2024-08-01', 'En progreso', 2, 7),
(6, 'Scanner Epson no reconoce documentos', '2024-08-15', 'En progreso', 3, 11),
(7, 'Desktop Lenovo pantalla azul frecuente', '2024-09-01', 'En progreso', 4, 8),
-- Incidentes ABIERTOS (recientes)
(8, 'Router Cisco pérdida intermitente conexión', '2024-10-01', 'Abierto', 2, 13),
(9, 'Laptop Dell batería no carga', '2024-10-15', 'Abierto', 3, 4),
(10, 'Servidor HP alto uso de CPU', '2024-11-01', 'Abierto', 4, 2),
(11, 'Firewall Cisco requiere actualización firmware', '2024-11-05', 'Abierto', 2, 14),
(12, 'Monitor Samsung parpadeo pantalla', '2024-11-08', 'Abierto', 3, 15)
ON DUPLICATE KEY UPDATE descripcion=VALUES(descripcion);

-- ============================================
-- 8. SERVICIOS TÉCNICOS
-- ============================================

INSERT INTO servicio_tecnico (id_servicio_tecnico, descripcion, fecha_inicio, fecha_final, tecnico_idtecnico, tecnico_proveedor_id_proveedor, incidente_idincidente) VALUES
-- Servicios COMPLETADOS
(1, 'Reemplazo de fuente de alimentación HP', '2024-06-02', '2024-06-05', 1, 1, 1),
(2, 'Limpieza y mantenimiento impresora HP', '2024-06-16', '2024-06-18', 2, 1, 2),
(3, 'Reemplazo cable HDMI monitor Dell', '2024-07-02', '2024-07-03', 3, 2, 3),
(4, 'Limpieza ventiladores switch Cisco', '2024-07-11', '2024-07-15', 8, 5, 4),
-- Servicios EN CURSO
(5, 'Escaneo antivirus y optimización Lenovo', '2024-08-02', NULL, 5, 3, 5),
(6, 'Calibración y limpieza scanner Epson', '2024-08-16', NULL, 7, 4, 6),
(7, 'Diagnóstico hardware Desktop Lenovo', '2024-09-02', NULL, 5, 3, 7),
-- Servicios PENDIENTES ASIGNACIÓN
(8, 'Diagnóstico router Cisco', '2024-10-02', NULL, 9, 5, 8),
(9, 'Revisión batería laptop Dell', '2024-10-16', NULL, 3, 2, 9),
(10, 'Monitoreo servidor HP', '2024-11-02', NULL, 1, 1, 10)
ON DUPLICATE KEY UPDATE descripcion=VALUES(descripcion);

-- ============================================
-- 9. CALIFICACIONES DE TÉCNICOS
-- ============================================

INSERT INTO calificacion_tecnico (id_calificacion_tecnico, puntaje, comentario, fecha_calificacion, tecnico_id_tecnico, incidente_idincidente) VALUES
(1, 5, 'Excelente servicio, rápido y profesional. Solucionó el problema en tiempo récord.', '2024-06-06 10:30:00', 1, 1),
(2, 4, 'Buen trabajo, aunque tardó un poco más de lo esperado.', '2024-06-19 15:45:00', 2, 2),
(3, 5, 'Técnico muy capacitado, identificó el problema rápidamente.', '2024-07-04 09:15:00', 3, 3),
(4, 3, 'Resolvió el problema pero la comunicación fue deficiente.', '2024-07-16 14:20:00', 8, 4)
ON DUPLICATE KEY UPDATE puntaje=VALUES(puntaje);

-- ============================================
-- 10. CALIFICACIONES DE PROVEEDORES
-- ============================================

INSERT INTO calificacion_proveedor (id_calificacion_proveedor, servicio_postventa, precios, tiempos_entrega, calidad_productos, comentario, fecha_calificacion, proveedor_id_proveedor, incidente_idincidente) VALUES
(1, 5, 4, 5, 5, 'HP siempre cumple con los plazos y la calidad es excepcional.', '2024-06-06 11:00:00', 1, 1),
(2, 4, 3, 4, 4, 'Buenos productos pero los precios son algo elevados.', '2024-06-19 16:00:00', 1, 2),
(3, 5, 4, 5, 5, 'Dell es muy confiable, excelente atención postventa.', '2024-07-04 09:30:00', 2, 3),
(4, 3, 4, 3, 4, 'Cisco tiene buenos productos pero el servicio puede mejorar.', '2024-07-16 14:45:00', 5, 4)
ON DUPLICATE KEY UPDATE servicio_postventa=VALUES(servicio_postventa);

-- ============================================
-- 11. ÓRDENES DE COMPRA
-- ============================================

INSERT INTO orden_compra (id_orden_compra, fecha, cuotas, proveedor_id_proveedor) VALUES
(1, '2024-01-10', 1, 1),  -- HP - Pago contado
(2, '2024-01-15', 3, 2),  -- Dell - 3 cuotas
(3, '2024-02-05', 6, 3),  -- Lenovo - 6 cuotas
(4, '2024-01-20', 1, 4),  -- Epson - Pago contado
(5, '2024-03-10', 12, 5), -- Cisco - 12 cuotas (equipos caros)
(6, '2024-02-25', 3, 8),  -- Samsung - 3 cuotas
(7, '2024-04-10', 1, 10)  -- Asus - Pago contado
ON DUPLICATE KEY UPDATE fecha=VALUES(fecha);

-- ============================================
-- 12. LÍNEAS DE ORDEN DE COMPRA
-- ============================================

INSERT INTO linea_orden_compra (id_linea_orden_compra, cantidad, precio_unitario, subtotal, orden_compra_id_orden_compra, orden_compra_proveedor_id_proveedor, producto_id_producto) VALUES
-- Orden 1 (HP)
(1, 2, 285000.00, 570000.00, 1, 1, 1),  -- 2 Laptops HP
(2, 1, 1250000.00, 1250000.00, 1, 1, 2), -- 1 Servidor HP
(3, 1, 95000.00, 95000.00, 1, 1, 3),     -- 1 Impresora HP
-- Orden 2 (Dell)
(4, 3, 295000.00, 885000.00, 2, 2, 4),   -- 3 Laptops Dell
(5, 1, 450000.00, 450000.00, 2, 2, 5),   -- 1 Workstation Dell
(6, 5, 185000.00, 925000.00, 2, 2, 6),   -- 5 Monitores Dell
-- Orden 3 (Lenovo)
(7, 5, 320000.00, 1600000.00, 3, 3, 7),  -- 5 Laptops Lenovo
(8, 10, 145000.00, 1450000.00, 3, 3, 8), -- 10 Desktops Lenovo
(9, 3, 95000.00, 285000.00, 3, 3, 9),    -- 3 Tablets Lenovo
-- Orden 4 (Epson)
(10, 8, 125000.00, 1000000.00, 4, 4, 10), -- 8 Impresoras Epson
(11, 2, 285000.00, 570000.00, 4, 4, 11),  -- 2 Scanners Epson
-- Orden 5 (Cisco)
(12, 3, 2350000.00, 7050000.00, 5, 5, 12), -- 3 Switches Cisco
(13, 2, 1850000.00, 3700000.00, 5, 5, 13), -- 2 Routers Cisco
(14, 1, 3250000.00, 3250000.00, 5, 5, 14), -- 1 Firewall Cisco
-- Orden 6 (Samsung)
(15, 10, 195000.00, 1950000.00, 6, 8, 15), -- 10 Monitores Samsung
(16, 5, 285000.00, 1425000.00, 6, 8, 16),  -- 5 SSDs Samsung
-- Orden 7 (Asus)
(17, 2, 275000.00, 550000.00, 7, 10, 17),  -- 2 Laptops Asus
(18, 3, 185000.00, 555000.00, 7, 10, 18)   -- 3 Routers Asus
ON DUPLICATE KEY UPDATE cantidad=VALUES(cantidad);

-- ============================================
-- 13. FACTURAS
-- ============================================

INSERT INTO factura (id_factura, fecha_emision, fecha_vencimiento, importe, estado, proveedor_id_proveedor, orden_compra_id_orden_compra, orden_compra_proveedor_id_proveedor) VALUES
-- HP (Orden 1 - Pago único)
(1, '2024-01-15', '2024-02-15', 1915000.00, 'Pagada', 1, 1, 1),
-- Dell (Orden 2 - 3 cuotas)
(2, '2024-01-20', '2024-02-20', 753333.33, 'Pagada', 2, 2, 2),
(3, '2024-02-20', '2024-03-20', 753333.33, 'Pagada', 2, 2, 2),
(4, '2024-03-20', '2024-04-20', 753333.34, 'Pendiente', 2, 2, 2),
-- Lenovo (Orden 3 - 6 cuotas)
(5, '2024-02-10', '2024-03-10', 555833.33, 'Pagada', 3, 3, 3),
(6, '2024-03-10', '2024-04-10', 555833.33, 'Pagada', 3, 3, 3),
(7, '2024-04-10', '2024-05-10', 555833.33, 'Pendiente', 3, 3, 3),
(8, '2024-05-10', '2024-06-10', 555833.33, 'Pendiente', 3, 3, 3),
(9, '2024-06-10', '2024-07-10', 555833.33, 'Pendiente', 3, 3, 3),
(10, '2024-07-10', '2024-08-10', 555833.35, 'Pendiente', 3, 3, 3),
-- Epson (Orden 4 - Pago único)
(11, '2024-01-25', '2024-02-25', 1570000.00, 'Pagada', 4, 4, 4),
-- Cisco (Orden 5 - 12 cuotas)
(12, '2024-03-15', '2024-04-15', 1166666.67, 'Pagada', 5, 5, 5),
(13, '2024-04-15', '2024-05-15', 1166666.67, 'Pagada', 5, 5, 5),
(14, '2024-05-15', '2024-06-15', 1166666.67, 'Pendiente', 5, 5, 5),
(15, '2024-06-15', '2024-07-15', 1166666.67, 'Pendiente', 5, 5, 5),
-- Samsung (Orden 6 - 3 cuotas)
(16, '2024-03-01', '2024-04-01', 1125000.00, 'Pagada', 8, 6, 8),
(17, '2024-04-01', '2024-05-01', 1125000.00, 'Pagada', 8, 6, 8),
(18, '2024-05-01', '2024-06-01', 1125000.00, 'Vencida', 8, 6, 8),
-- Asus (Orden 7 - Pago único)
(19, '2024-04-15', '2024-05-15', 1105000.00, 'Pagada', 10, 7, 10)
ON DUPLICATE KEY UPDATE fecha_emision=VALUES(fecha_emision);

-- ============================================
-- 14. DETALLES DE FACTURAS
-- ============================================

INSERT INTO detalle_factura (id_detalle_factura, cantidad, precio_unitario, subtotal, factura_id_factura, producto_id_producto) VALUES
-- Factura 1 (HP)
(1, 2, 285000.00, 570000.00, 1, 1),
(2, 1, 1250000.00, 1250000.00, 1, 2),
(3, 1, 95000.00, 95000.00, 1, 3),
-- Facturas 2-4 (Dell - mismo detalle replicado)
(4, 3, 295000.00, 885000.00, 2, 4),
(5, 1, 450000.00, 450000.00, 2, 5),
(6, 5, 185000.00, 925000.00, 2, 6),
-- Facturas 5-10 (Lenovo - mismo detalle)
(7, 5, 320000.00, 1600000.00, 5, 7),
(8, 10, 145000.00, 1450000.00, 5, 8),
(9, 3, 95000.00, 285000.00, 5, 9),
-- Factura 11 (Epson)
(10, 8, 125000.00, 1000000.00, 11, 10),
(11, 2, 285000.00, 570000.00, 11, 11),
-- Facturas 12-15 (Cisco - mismo detalle)
(12, 3, 2350000.00, 7050000.00, 12, 12),
(13, 2, 1850000.00, 3700000.00, 12, 13),
(14, 1, 3250000.00, 3250000.00, 12, 14),
-- Facturas 16-18 (Samsung - mismo detalle)
(15, 10, 195000.00, 1950000.00, 16, 15),
(16, 5, 285000.00, 1425000.00, 16, 16),
-- Factura 19 (Asus)
(17, 2, 275000.00, 550000.00, 19, 17),
(18, 3, 185000.00, 555000.00, 19, 18)
ON DUPLICATE KEY UPDATE cantidad=VALUES(cantidad);

-- ============================================
-- 15. PLANES DE PAGO
-- ============================================

INSERT INTO plan_pago (id_plan_pago, factura_id_factura, numero_cuota, importe, fecha_vencimiento, fecha_pago, metodo_pago, observaciones, estado) VALUES
-- Factura 1 (HP - Pago único PAGADO)
(1, 1, 1, 1915000.00, '2024-02-15', '2024-02-10', 'Transferencia', 'Pago anticipado con 5% descuento', 'Pagada'),
-- Factura 2-4 (Dell - 3 cuotas)
(2, 2, 1, 753333.33, '2024-02-20', '2024-02-18', 'Transferencia', NULL, 'Pagada'),
(3, 3, 2, 753333.33, '2024-03-20', '2024-03-19', 'Cheque', NULL, 'Pagada'),
(4, 4, 3, 753333.34, '2024-04-20', NULL, NULL, 'Última cuota pendiente', 'Pendiente'),
-- Facturas 5-10 (Lenovo - 6 cuotas)
(5, 5, 1, 555833.33, '2024-03-10', '2024-03-08', 'Transferencia', NULL, 'Pagada'),
(6, 6, 2, 555833.33, '2024-04-10', '2024-04-09', 'Transferencia', NULL, 'Pagada'),
(7, 7, 3, 555833.33, '2024-05-10', NULL, NULL, NULL, 'Pendiente'),
(8, 8, 4, 555833.33, '2024-06-10', NULL, NULL, NULL, 'Pendiente'),
(9, 9, 5, 555833.33, '2024-07-10', NULL, NULL, NULL, 'Pendiente'),
(10, 10, 6, 555833.35, '2024-08-10', NULL, NULL, NULL, 'Pendiente'),
-- Factura 11 (Epson - Pago único PAGADO)
(11, 11, 1, 1570000.00, '2024-02-25', '2024-02-20', 'Transferencia', 'Pronto pago', 'Pagada'),
-- Facturas 12-15 (Cisco - 12 cuotas, solo primeras 4)
(12, 12, 1, 1166666.67, '2024-04-15', '2024-04-12', 'Transferencia', NULL, 'Pagada'),
(13, 13, 2, 1166666.67, '2024-05-15', '2024-05-14', 'Cheque', NULL, 'Pagada'),
(14, 14, 3, 1166666.67, '2024-06-15', NULL, NULL, NULL, 'Pendiente'),
(15, 15, 4, 1166666.67, '2024-07-15', NULL, NULL, NULL, 'Pendiente'),
-- Facturas 16-18 (Samsung - 3 cuotas)
(16, 16, 1, 1125000.00, '2024-04-01', '2024-03-28', 'Transferencia', NULL, 'Pagada'),
(17, 17, 2, 1125000.00, '2024-05-01', '2024-04-30', 'Transferencia', NULL, 'Pagada'),
(18, 18, 3, 1125000.00, '2024-06-01', NULL, NULL, 'Vencida - Gestionar con proveedor', 'Vencida'),
-- Factura 19 (Asus - Pago único PAGADO)
(19, 19, 1, 1105000.00, '2024-05-15', '2024-05-10', 'Transferencia', NULL, 'Pagada')
ON DUPLICATE KEY UPDATE numero_cuota=VALUES(numero_cuota);

-- ============================================
-- RESUMEN DE DATOS PARA DEMO
-- ============================================
-- ✅ 4 usuarios (1 admin, 2 consultores, 1 gerente)
-- ✅ 10 proveedores (8 activos, 2 inactivos para probar filtros)
-- ✅ 10 técnicos de diferentes especialidades
-- ✅ 18 productos variados (laptops, servidores, switches, etc.)
-- ✅ 12 incidentes (4 cerrados, 3 en progreso, 5 abiertos)
-- ✅ 10 servicios técnicos (4 completados, 3 en curso, 3 pendientes)
-- ✅ 4 calificaciones de técnicos (variedad de puntajes)
-- ✅ 4 calificaciones de proveedores (métricas completas)
-- ✅ 7 órdenes de compra (diferentes proveedores y cuotas)
-- ✅ 18 líneas de orden (detalle de productos)
-- ✅ 19 facturas (variedad de estados: pagadas, pendientes, vencidas)
-- ✅ 19 planes de pago (con diferentes métodos de pago)
-- ✅ 3 SLAs diferentes (premium, estándar, básico)
-- ✅ 5 contratos (algunos vigentes, uno vencido)
-- ============================================

SET FOREIGN_KEY_CHECKS=1;

SELECT '✅ SEEDS CARGADOS CORRECTAMENTE' AS Resultado;
SELECT 'Puedes probar: CRUD completo, Baja lógica, Calificaciones, Reportes' AS Info;
