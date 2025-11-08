-- ============================================
-- KEYWARDEN - Sistema de Gestión de Proveedores
-- Script de Creación de Base de Datos
-- ============================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS admtfi;
USE admtfi;

-- ============================================
-- TABLA: usuario (Para R8 - Control de Acceso)
-- ============================================
CREATE TABLE IF NOT EXISTS usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt',
  rol INT NOT NULL COMMENT '1=Admin, 2=Consultor',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: proveedor (Para R1)
-- ============================================
CREATE TABLE IF NOT EXISTS proveedor (
  id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
  razon_social VARCHAR(200) NOT NULL,
  CUIT VARCHAR(11) NOT NULL UNIQUE,
  direccion VARCHAR(255),
  telefono VARCHAR(20),
  email VARCHAR(100),
  estado_proveedor ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_estado (estado_proveedor),
  INDEX idx_razon_social (razon_social)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: tecnico (Para R4)
-- ============================================
CREATE TABLE IF NOT EXISTS tecnico (
  idtecnico INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  especialidad VARCHAR(100),
  telefono VARCHAR(20),
  email VARCHAR(100),
  estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  proveedor_id_proveedor INT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tecnico_proveedor 
    FOREIGN KEY (proveedor_id_proveedor) 
    REFERENCES proveedor(id_proveedor)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  INDEX idx_proveedor (proveedor_id_proveedor),
  INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: producto (Para R2)
-- ============================================
CREATE TABLE IF NOT EXISTS producto (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  numero_de_serie VARCHAR(100) NOT NULL UNIQUE,
  marca VARCHAR(100) NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  descripcion TEXT,
  fecha_adquisicion DATE NOT NULL,
  fecha_vencimiento_garantia DATE NOT NULL,
  estado_producto ENUM('Activo', 'Inactivo', 'En Reparación', 'Dado de Baja') DEFAULT 'Activo',
  proveedor_id_proveedor INT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_producto_proveedor 
    FOREIGN KEY (proveedor_id_proveedor) 
    REFERENCES proveedor(id_proveedor)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  INDEX idx_proveedor (proveedor_id_proveedor),
  INDEX idx_estado (estado_producto),
  INDEX idx_garantia (fecha_vencimiento_garantia),
  INDEX idx_serie (numero_de_serie)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: incidente (Para R7)
-- ============================================
CREATE TABLE IF NOT EXISTS incidente (
  idincidente INT AUTO_INCREMENT PRIMARY KEY,
  descripcion TEXT NOT NULL,
  fecha_apertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('Abierto', 'En Progreso', 'Resuelto', 'Cerrado') DEFAULT 'Abierto',
  usuario_id_usuario INT NOT NULL,
  producto_id_producto INT NOT NULL,
  CONSTRAINT fk_incidente_usuario 
    FOREIGN KEY (usuario_id_usuario) 
    REFERENCES usuario(id_usuario)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_incidente_producto 
    FOREIGN KEY (producto_id_producto) 
    REFERENCES producto(id_producto)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  INDEX idx_estado (estado),
  INDEX idx_producto (producto_id_producto),
  INDEX idx_fecha (fecha_apertura)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: servicio_tecnico (Para R7 - Tiempos)
-- ============================================
CREATE TABLE IF NOT EXISTS servicio_tecnico (
  id_servicio_tecnico INT AUTO_INCREMENT PRIMARY KEY,
  fecha_inicio TIMESTAMP NOT NULL,
  fecha_final TIMESTAMP NULL,
  descripcion TEXT NULL COMMENT 'Descripción de la solución',
  tecnico_idtecnico INT NOT NULL,
  tecnico_proveedor_id_proveedor INT NOT NULL,
  incidente_idincidente INT NOT NULL,
  CONSTRAINT fk_servicio_tecnico 
    FOREIGN KEY (tecnico_idtecnico) 
    REFERENCES tecnico(idtecnico)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_servicio_proveedor 
    FOREIGN KEY (tecnico_proveedor_id_proveedor) 
    REFERENCES proveedor(id_proveedor)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_servicio_incidente 
    FOREIGN KEY (incidente_idincidente) 
    REFERENCES incidente(idincidente)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  INDEX idx_tecnico (tecnico_idtecnico),
  INDEX idx_incidente (incidente_idincidente),
  INDEX idx_fechas (fecha_inicio, fecha_final)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: calificacion_proveedor (Para R3)
-- ============================================
CREATE TABLE IF NOT EXISTS calificacion_proveedor (
  id_calificacion INT AUTO_INCREMENT PRIMARY KEY,
  puntaje DECIMAL(3,2) NOT NULL CHECK (puntaje >= 1 AND puntaje <= 5),
  comentario TEXT,
  fecha_calificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  proveedor_id_proveedor INT NOT NULL,
  incidente_idincidente INT NOT NULL UNIQUE COMMENT 'Un incidente solo puede tener una calificación',
  CONSTRAINT fk_calificacion_proveedor 
    FOREIGN KEY (proveedor_id_proveedor) 
    REFERENCES proveedor(id_proveedor)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_calificacion_incidente 
    FOREIGN KEY (incidente_idincidente) 
    REFERENCES incidente(idincidente)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  INDEX idx_proveedor (proveedor_id_proveedor),
  INDEX idx_puntaje (puntaje)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: orden_compra (Para R9)
-- ============================================
CREATE TABLE IF NOT EXISTS orden_compra (
  id_orden_compra INT AUTO_INCREMENT PRIMARY KEY,
  fecha_orden DATE NOT NULL,
  estado_orden ENUM('Pendiente', 'Aprobada', 'Recibida', 'Cancelada') DEFAULT 'Pendiente',
  observaciones TEXT,
  proveedor_id_proveedor INT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orden_proveedor 
    FOREIGN KEY (proveedor_id_proveedor) 
    REFERENCES proveedor(id_proveedor)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  INDEX idx_proveedor (proveedor_id_proveedor),
  INDEX idx_estado (estado_orden),
  INDEX idx_fecha (fecha_orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: orden_compra_items
-- ============================================
CREATE TABLE IF NOT EXISTS orden_compra_items (
  id_item INT AUTO_INCREMENT PRIMARY KEY,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  orden_compra_id_orden_compra INT NOT NULL,
  producto_id_producto INT NOT NULL,
  CONSTRAINT fk_item_orden 
    FOREIGN KEY (orden_compra_id_orden_compra) 
    REFERENCES orden_compra(id_orden_compra)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_item_producto 
    FOREIGN KEY (producto_id_producto) 
    REFERENCES producto(id_producto)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  INDEX idx_orden (orden_compra_id_orden_compra)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: factura (Para R9 y R5)
-- ============================================
CREATE TABLE IF NOT EXISTS factura (
  id_factura INT AUTO_INCREMENT PRIMARY KEY,
  fecha_emision DATE NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  importe DECIMAL(10,2) NOT NULL,
  estado ENUM('Pendiente', 'Pagada', 'Vencida', 'Cancelada') DEFAULT 'Pendiente',
  orden_compra_id_orden_compra INT NOT NULL,
  proveedor_id_proveedor INT NOT NULL,
  orden_compra_proveedor_id_proveedor INT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_factura_orden 
    FOREIGN KEY (orden_compra_id_orden_compra) 
    REFERENCES orden_compra(id_orden_compra)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_factura_proveedor 
    FOREIGN KEY (proveedor_id_proveedor) 
    REFERENCES proveedor(id_proveedor)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  INDEX idx_proveedor (proveedor_id_proveedor),
  INDEX idx_estado (estado),
  INDEX idx_vencimiento (fecha_vencimiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: detalle_factura
-- ============================================
CREATE TABLE IF NOT EXISTS detalle_factura (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  factura_id_factura INT NOT NULL,
  producto_id_producto INT NOT NULL,
  CONSTRAINT fk_detalle_factura 
    FOREIGN KEY (factura_id_factura) 
    REFERENCES factura(id_factura)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_detalle_producto 
    FOREIGN KEY (producto_id_producto) 
    REFERENCES producto(id_producto)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  INDEX idx_factura (factura_id_factura)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: plan_pago (Para R5 - Pagos Diferidos)
-- ============================================
CREATE TABLE IF NOT EXISTS plan_pago (
  id_plan_pago INT AUTO_INCREMENT PRIMARY KEY,
  factura_id_factura INT NOT NULL,
  numero_cuota INT NOT NULL,
  importe DECIMAL(10,2) NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  fecha_pago DATE NULL,
  metodo_pago VARCHAR(50) NULL COMMENT 'Transferencia, Cheque, Efectivo, etc.',
  estado ENUM('Pendiente', 'Pagado', 'Vencido') DEFAULT 'Pendiente',
  observaciones TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_plan_factura 
    FOREIGN KEY (factura_id_factura) 
    REFERENCES factura(id_factura)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  INDEX idx_factura (factura_id_factura),
  INDEX idx_estado (estado),
  INDEX idx_vencimiento (fecha_vencimiento),
  UNIQUE KEY uk_factura_cuota (factura_id_factura, numero_cuota)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Insertar Usuario Administrador por defecto
-- Password: admin123 (en producción cambiar inmediatamente)
INSERT INTO usuario (nombre, email, password, rol) VALUES 
('Administrador', 'admin@keywarden.com', '$2a$10$kZXvhF3qXyKjYvXGJ5tHqO8yYxJ6mZYKZqJKqJKqJKqJKqJKqJKqJ', 1),
('Consultor Demo', 'consultor@keywarden.com', '$2a$10$kZXvhF3qXyKjYvXGJ5tHqO8yYxJ6mZYKZqJKqJKqJKqJKqJKqJKqJ', 2)
ON DUPLICATE KEY UPDATE email=email;

-- ============================================
-- VISTAS ÚTILES PARA REPORTES
-- ============================================

-- Vista: Productos con información de proveedor y estado de garantía
CREATE OR REPLACE VIEW v_productos_garantia AS
SELECT 
  p.id_producto,
  p.numero_de_serie,
  p.marca,
  p.modelo,
  p.fecha_adquisicion,
  p.fecha_vencimiento_garantia,
  DATEDIFF(p.fecha_vencimiento_garantia, CURDATE()) AS dias_hasta_vencimiento,
  CASE 
    WHEN p.fecha_vencimiento_garantia < CURDATE() THEN 'Vencida'
    WHEN DATEDIFF(p.fecha_vencimiento_garantia, CURDATE()) <= 30 THEN 'Por Vencer'
    ELSE 'Vigente'
  END AS estado_garantia,
  p.estado_producto,
  pr.id_proveedor,
  pr.razon_social AS proveedor_nombre
FROM producto p
JOIN proveedor pr ON p.proveedor_id_proveedor = pr.id_proveedor
WHERE p.estado_producto = 'Activo';

-- Vista: Incidentes con tiempos de respuesta y resolución
CREATE OR REPLACE VIEW v_incidentes_tiempos AS
SELECT 
  i.idincidente,
  i.descripcion,
  i.fecha_apertura,
  i.estado,
  p.numero_de_serie,
  p.marca,
  p.modelo,
  pr.razon_social AS proveedor_nombre,
  t.nombre AS tecnico_nombre,
  t.apellido AS tecnico_apellido,
  st.fecha_inicio,
  st.fecha_final,
  TIMESTAMPDIFF(SECOND, i.fecha_apertura, st.fecha_inicio) AS tiempo_respuesta_segundos,
  TIMESTAMPDIFF(SECOND, st.fecha_inicio, st.fecha_final) AS tiempo_resolucion_segundos
FROM incidente i
JOIN producto p ON i.producto_id_producto = p.id_producto
JOIN proveedor pr ON p.proveedor_id_proveedor = pr.id_proveedor
LEFT JOIN servicio_tecnico st ON i.idincidente = st.incidente_idincidente
LEFT JOIN tecnico t ON st.tecnico_idtecnico = t.idtecnico;

-- Vista: Resumen financiero por proveedor
CREATE OR REPLACE VIEW v_resumen_financiero AS
SELECT 
  pr.id_proveedor,
  pr.razon_social,
  COUNT(DISTINCT f.id_factura) AS total_facturas,
  SUM(f.importe) AS monto_total_facturado,
  SUM(CASE WHEN pp.estado = 'Pendiente' THEN pp.importe ELSE 0 END) AS deuda_pendiente,
  SUM(CASE WHEN pp.estado = 'Pagado' THEN pp.importe ELSE 0 END) AS total_pagado,
  COUNT(CASE WHEN pp.estado = 'Pendiente' AND pp.fecha_vencimiento < CURDATE() THEN 1 END) AS cuotas_vencidas
FROM proveedor pr
LEFT JOIN factura f ON pr.id_proveedor = f.proveedor_id_proveedor
LEFT JOIN plan_pago pp ON f.id_factura = pp.factura_id_factura
GROUP BY pr.id_proveedor, pr.razon_social;

-- ============================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ============================================

-- Optimizar búsquedas de incidentes por estado y fecha
ALTER TABLE incidente ADD INDEX idx_estado_fecha (estado, fecha_apertura);

-- Optimizar búsquedas de cuotas por estado y vencimiento
ALTER TABLE plan_pago ADD INDEX idx_estado_vencimiento (estado, fecha_vencimiento);

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
