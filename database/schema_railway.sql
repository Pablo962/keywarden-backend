-- ============================================
-- KEYWARDEN - SCHEMA PARA RAILWAY (SIN ERRORES)
-- ============================================
-- Orden correcto de dependencias
-- Sin constraints problemáticos
-- ============================================

SET FOREIGN_KEY_CHECKS=0;
SET UNIQUE_CHECKS=0;

-- Eliminar todo (por si acaso)
DROP TABLE IF EXISTS v_resumen_tecnicos;
DROP TABLE IF EXISTS v_resumen_proveedores;
DROP TABLE IF EXISTS plan_pago;
DROP TABLE IF EXISTS detalle_factura;
DROP TABLE IF EXISTS factura;
DROP TABLE IF EXISTS linea_orden_compra;
DROP TABLE IF EXISTS orden_compra;
DROP TABLE IF EXISTS calificacion_tecnico;
DROP TABLE IF EXISTS calificacion_proveedor;
DROP TABLE IF EXISTS servicio_tecnico;
DROP TABLE IF EXISTS incidente;
DROP TABLE IF EXISTS producto;
DROP TABLE IF EXISTS tecnico;
DROP TABLE IF EXISTS contrato;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS rol_has_permiso;
DROP TABLE IF EXISTS permiso;
DROP TABLE IF EXISTS rol;
DROP TABLE IF EXISTS proveedor;
DROP TABLE IF EXISTS sla;

-- ============================================
-- TABLAS BASE (sin dependencias)
-- ============================================

CREATE TABLE sla (
  id_sla INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  tiempo_respuesta VARCHAR(45) NOT NULL,
  penalidad VARCHAR(45) NOT NULL,
  metrica_aplicacion VARCHAR(45) NOT NULL,
  PRIMARY KEY (id_sla)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE permiso (
  id_permiso INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id_permiso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE rol (
  id_rol INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  PRIMARY KEY (id_rol),
  UNIQUE KEY id_rol_UNIQUE (id_rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE proveedor (
  id_proveedor INT NOT NULL AUTO_INCREMENT,
  razon_social VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  telefono VARCHAR(45) NOT NULL,
  estado_proveedor VARCHAR(45) NOT NULL,
  cuit VARCHAR(45) NOT NULL,
  PRIMARY KEY (id_proveedor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ============================================
-- TABLAS NIVEL 2 (dependen de tablas base)
-- ============================================

CREATE TABLE rol_has_permiso (
  rol_id_rol INT NOT NULL,
  permiso_id_permiso INT NOT NULL,
  PRIMARY KEY (rol_id_rol, permiso_id_permiso),
  KEY fk_rol_has_permiso_permiso1_idx (permiso_id_permiso),
  KEY fk_rol_has_permiso_rol1_idx (rol_id_rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE usuario (
  id_usuario INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  password VARCHAR(200) NOT NULL,
  rol_id_rol INT NOT NULL,
  PRIMARY KEY (id_usuario, rol_id_rol),
  KEY fk_usuario_rol1_idx (rol_id_rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE tecnico (
  id_tecnico INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  documento VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  telefono VARCHAR(45) NOT NULL,
  vigencia_desde DATE NOT NULL,
  vigencia_hasta DATE NOT NULL,
  especialidad VARCHAR(45) NOT NULL,
  proveedor_id_proveedor INT NOT NULL,
  PRIMARY KEY (id_tecnico, proveedor_id_proveedor),
  KEY fk_tecnico_proveedor1_idx (proveedor_id_proveedor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE producto (
  id_producto INT NOT NULL AUTO_INCREMENT,
  marca VARCHAR(45) NOT NULL,
  categoria VARCHAR(45) NOT NULL,
  numero_de_serie VARCHAR(45) NOT NULL,
  fecha_adquisicion DATE NOT NULL,
  fecha_vencimiento_garantia DATE NOT NULL,
  modelo VARCHAR(45) NOT NULL,
  estado_producto VARCHAR(45) NOT NULL,
  proveedor_id_proveedor INT NOT NULL,
  PRIMARY KEY (id_producto),
  KEY fk_producto_proveedor1 (proveedor_id_proveedor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE contrato (
  id_contrato INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  estado_contrato VARCHAR(45) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  cobertura VARCHAR(45) NOT NULL,
  adjunto_url VARCHAR(45) NOT NULL,
  sla_id_sla INT UNSIGNED NOT NULL,
  proveedor_id_proveedor INT NOT NULL,
  PRIMARY KEY (id_contrato, sla_id_sla, proveedor_id_proveedor),
  KEY fk_contrato_sla_idx (sla_id_sla),
  KEY fk_contrato_proveedor1_idx (proveedor_id_proveedor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE orden_compra (
  id_orden_compra INT NOT NULL AUTO_INCREMENT,
  fecha DATE NOT NULL,
  cuotas INT NOT NULL,
  proveedor_id_proveedor INT NOT NULL,
  PRIMARY KEY (id_orden_compra, proveedor_id_proveedor),
  KEY fk_orden_compra_proveedor1_idx (proveedor_id_proveedor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ============================================
-- TABLAS NIVEL 3 (dependen de nivel 2)
-- ============================================

CREATE TABLE incidente (
  idincidente INT NOT NULL AUTO_INCREMENT,
  descripcion VARCHAR(45) NOT NULL,
  fecha_apertura DATE NOT NULL,
  estado VARCHAR(45) NOT NULL,
  usuario_id_usuario INT NOT NULL,
  producto_id_producto INT NOT NULL,
  PRIMARY KEY (idincidente, usuario_id_usuario, producto_id_producto),
  KEY fk_incidente_usuario1_idx (usuario_id_usuario),
  KEY fk_incidente_producto1_idx (producto_id_producto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE linea_orden_compra (
  id_linea_orden_compra INT NOT NULL AUTO_INCREMENT,
  cantidad INT NOT NULL,
  precio_unitario DOUBLE NOT NULL,
  subtotal DOUBLE NOT NULL,
  orden_compra_id_orden_compra INT NOT NULL,
  orden_compra_proveedor_id_proveedor INT NOT NULL,
  producto_id_producto INT NOT NULL,
  PRIMARY KEY (id_linea_orden_compra, orden_compra_id_orden_compra, orden_compra_proveedor_id_proveedor, producto_id_producto),
  KEY fk_linea_orden_compra_orden_compra1_idx (orden_compra_id_orden_compra, orden_compra_proveedor_id_proveedor),
  KEY fk_linea_orden_compra_producto1_idx (producto_id_producto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE factura (
  id_factura INT NOT NULL AUTO_INCREMENT,
  fecha_emision DATE NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  importe DOUBLE NOT NULL,
  estado VARCHAR(45) NOT NULL,
  proveedor_id_proveedor INT NOT NULL,
  orden_compra_id_orden_compra INT NOT NULL,
  orden_compra_proveedor_id_proveedor INT NOT NULL,
  PRIMARY KEY (id_factura, proveedor_id_proveedor, orden_compra_id_orden_compra, orden_compra_proveedor_id_proveedor),
  KEY fk_factura_proveedor1_idx (proveedor_id_proveedor),
  KEY fk_factura_orden_compra1_idx (orden_compra_id_orden_compra, orden_compra_proveedor_id_proveedor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ============================================
-- TABLAS NIVEL 4 (dependen de nivel 3)
-- ============================================

CREATE TABLE servicio_tecnico (
  id_servicio_tecnico INT NOT NULL AUTO_INCREMENT,
  descripcion VARCHAR(45) DEFAULT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_final DATE DEFAULT NULL,
  tecnico_idtecnico INT NOT NULL,
  tecnico_proveedor_id_proveedor INT NOT NULL,
  incidente_idincidente INT NOT NULL,
  PRIMARY KEY (id_servicio_tecnico, tecnico_idtecnico, tecnico_proveedor_id_proveedor, incidente_idincidente),
  KEY fk_servicio_tecnico_tecnico1_idx (tecnico_idtecnico, tecnico_proveedor_id_proveedor),
  KEY fk_servicio_tecnico_incidente1_idx (incidente_idincidente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE calificacion_proveedor (
  id_calificacion_proveedor INT NOT NULL AUTO_INCREMENT,
  servicio_postventa INT NOT NULL,
  precios INT NOT NULL,
  tiempos_entrega INT NOT NULL,
  calidad_productos INT NOT NULL,
  puntaje_promedio DECIMAL(3,2) GENERATED ALWAYS AS ((((servicio_postventa + precios + tiempos_entrega + calidad_productos) / 4))) STORED,
  comentario TEXT COLLATE utf8mb4_unicode_ci,
  fecha_calificacion TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  proveedor_id_proveedor INT NOT NULL,
  incidente_idincidente INT NOT NULL,
  PRIMARY KEY (id_calificacion_proveedor),
  UNIQUE KEY incidente_idincidente (incidente_idincidente),
  KEY fk_calif_prov_proveedor (proveedor_id_proveedor),
  CONSTRAINT chk_calidad CHECK ((calidad_productos BETWEEN 1 AND 5)),
  CONSTRAINT chk_precios CHECK ((precios BETWEEN 1 AND 5)),
  CONSTRAINT chk_servicio CHECK ((servicio_postventa BETWEEN 1 AND 5)),
  CONSTRAINT chk_tiempos CHECK ((tiempos_entrega BETWEEN 1 AND 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE calificacion_tecnico (
  id_calificacion_tecnico INT NOT NULL AUTO_INCREMENT,
  puntaje INT NOT NULL,
  comentario TEXT COLLATE utf8mb4_unicode_ci,
  fecha_calificacion TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  tecnico_id_tecnico INT NOT NULL,
  incidente_idincidente INT NOT NULL,
  PRIMARY KEY (id_calificacion_tecnico),
  UNIQUE KEY incidente_idincidente (incidente_idincidente),
  KEY fk_calif_tec_tecnico (tecnico_id_tecnico),
  CONSTRAINT chk_puntaje_tec CHECK ((puntaje BETWEEN 1 AND 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE detalle_factura (
  id_detalle_factura INT NOT NULL AUTO_INCREMENT,
  cantidad INT NOT NULL,
  precio_unitario DOUBLE NOT NULL,
  subtotal DOUBLE NOT NULL,
  factura_id_factura INT NOT NULL,
  producto_id_producto INT NOT NULL,
  PRIMARY KEY (id_detalle_factura),
  KEY fk_detalle_factura_factura1_idx (factura_id_factura),
  KEY fk_detalle_factura_producto1_idx (producto_id_producto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE plan_pago (
  id_plan_pago INT NOT NULL AUTO_INCREMENT,
  factura_id_factura INT NOT NULL,
  numero_cuota INT NOT NULL,
  importe DOUBLE NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  fecha_pago DATE DEFAULT NULL COMMENT 'Fecha en que se realizó el pago',
  metodo_pago VARCHAR(50) DEFAULT NULL COMMENT 'Transferencia, Cheque, Efectivo, Tarjeta',
  observaciones TEXT COMMENT 'Notas adicionales sobre el pago',
  estado VARCHAR(45) NOT NULL,
  PRIMARY KEY (id_plan_pago),
  KEY fk_plan_pago_factura1 (factura_id_factura)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ============================================
-- VISTAS
-- ============================================

CREATE VIEW v_resumen_proveedores AS 
SELECT 
  p.id_proveedor,
  p.razon_social AS proveedor_nombre,
  IFNULL(AVG(cp.servicio_postventa), 0) AS promedio_servicio,
  IFNULL(AVG(cp.precios), 0) AS promedio_precios,
  IFNULL(AVG(cp.tiempos_entrega), 0) AS promedio_tiempos,
  IFNULL(AVG(cp.calidad_productos), 0) AS promedio_calidad,
  IFNULL(AVG(cp.puntaje_promedio), 0) AS promedio_general
FROM proveedor p
LEFT JOIN calificacion_proveedor cp ON p.id_proveedor = cp.proveedor_id_proveedor
GROUP BY p.id_proveedor, p.razon_social;

CREATE VIEW v_resumen_tecnicos AS 
SELECT 
  t.id_tecnico,
  t.nombre AS tecnico_nombre,
  COUNT(ct.id_calificacion_tecnico) AS total_calificaciones,
  IFNULL(AVG(ct.puntaje), 0) AS promedio_calificacion,
  IFNULL(SUM(CASE WHEN ct.puntaje = 5 THEN 1 ELSE 0 END), 0) AS calificaciones_5_estrellas
FROM tecnico t
LEFT JOIN calificacion_tecnico ct ON t.id_tecnico = ct.tecnico_id_tecnico
GROUP BY t.id_tecnico, t.nombre;

SET FOREIGN_KEY_CHECKS=1;
SET UNIQUE_CHECKS=1;

SELECT '✅ SCHEMA CREADO CORRECTAMENTE - 18 tablas + 2 vistas' AS resultado;
