-- ============================================
-- KEYWARDEN - Sistema de Gestión de Proveedores  
-- Script de Creación de Base de Datos
-- ============================================
-- Exportado desde: Base de datos real (admtfi)
-- Fecha: 2025-11-08
-- Versión MySQL: 8.0.44
-- ============================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS admtfi;
USE admtfi;

-- Configuración inicial
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: admtfi
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `calificacion_proveedor`
--

DROP TABLE IF EXISTS `calificacion_proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calificacion_proveedor` (
  `id_calificacion_proveedor` int NOT NULL AUTO_INCREMENT,
  `servicio_postventa` int NOT NULL,
  `precios` int NOT NULL,
  `tiempos_entrega` int NOT NULL,
  `calidad_productos` int NOT NULL,
  `puntaje_promedio` decimal(3,2) GENERATED ALWAYS AS (((((`servicio_postventa` + `precios`) + `tiempos_entrega`) + `calidad_productos`) / 4)) STORED,
  `comentario` text COLLATE utf8mb4_unicode_ci,
  `fecha_calificacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `proveedor_id_proveedor` int NOT NULL,
  `incidente_idincidente` int NOT NULL,
  PRIMARY KEY (`id_calificacion_proveedor`),
  UNIQUE KEY `incidente_idincidente` (`incidente_idincidente`),
  KEY `fk_calif_prov_proveedor` (`proveedor_id_proveedor`),
  CONSTRAINT `fk_calif_prov_incidente` FOREIGN KEY (`incidente_idincidente`) REFERENCES `incidente` (`idincidente`),
  CONSTRAINT `fk_calif_prov_proveedor` FOREIGN KEY (`proveedor_id_proveedor`) REFERENCES `proveedor` (`id_proveedor`),
  CONSTRAINT `chk_calidad` CHECK ((`calidad_productos` between 1 and 5)),
  CONSTRAINT `chk_precios` CHECK ((`precios` between 1 and 5)),
  CONSTRAINT `chk_servicio` CHECK ((`servicio_postventa` between 1 and 5)),
  CONSTRAINT `chk_tiempos` CHECK ((`tiempos_entrega` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `calificacion_tecnico`
--

DROP TABLE IF EXISTS `calificacion_tecnico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calificacion_tecnico` (
  `id_calificacion_tecnico` int NOT NULL AUTO_INCREMENT,
  `puntaje` int NOT NULL,
  `comentario` text COLLATE utf8mb4_unicode_ci,
  `fecha_calificacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tecnico_id_tecnico` int NOT NULL,
  `incidente_idincidente` int NOT NULL,
  PRIMARY KEY (`id_calificacion_tecnico`),
  UNIQUE KEY `incidente_idincidente` (`incidente_idincidente`),
  KEY `fk_calif_tec_tecnico` (`tecnico_id_tecnico`),
  CONSTRAINT `fk_calif_tec_incidente` FOREIGN KEY (`incidente_idincidente`) REFERENCES `incidente` (`idincidente`),
  CONSTRAINT `fk_calif_tec_tecnico` FOREIGN KEY (`tecnico_id_tecnico`) REFERENCES `tecnico` (`id_tecnico`),
  CONSTRAINT `chk_puntaje_tec` CHECK ((`puntaje` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contrato`
--

DROP TABLE IF EXISTS `contrato`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contrato` (
  `id_contrato` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `estado_contrato` varchar(45) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `cobertura` varchar(45) NOT NULL,
  `adjunto_url` varchar(45) NOT NULL,
  `sla_id_sla` int unsigned NOT NULL,
  `proveedor_id_proveedor` int NOT NULL,
  PRIMARY KEY (`id_contrato`,`sla_id_sla`,`proveedor_id_proveedor`),
  KEY `fk_contrato_sla_idx` (`sla_id_sla`),
  KEY `fk_contrato_proveedor1_idx` (`proveedor_id_proveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `detalle_factura`
--

DROP TABLE IF EXISTS `detalle_factura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_factura` (
  `id_detalle_factura` int NOT NULL AUTO_INCREMENT,
  `cantidad` int NOT NULL,
  `precio_unitario` double NOT NULL,
  `subtotal` double NOT NULL,
  `factura_id_factura` int NOT NULL,
  `producto_id_producto` int NOT NULL,
  PRIMARY KEY (`id_detalle_factura`),
  KEY `fk_detalle_factura_factura1_idx` (`factura_id_factura`),
  KEY `fk_detalle_factura_producto1_idx` (`producto_id_producto`),
  CONSTRAINT `fk_detalle_factura_factura1` FOREIGN KEY (`factura_id_factura`) REFERENCES `factura` (`id_factura`),
  CONSTRAINT `fk_detalle_factura_producto1` FOREIGN KEY (`producto_id_producto`) REFERENCES `producto` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `factura`
--

DROP TABLE IF EXISTS `factura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `factura` (
  `id_factura` int NOT NULL AUTO_INCREMENT,
  `fecha_emision` date NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `importe` double NOT NULL,
  `estado` varchar(45) NOT NULL,
  `proveedor_id_proveedor` int NOT NULL,
  `orden_compra_id_orden_compra` int NOT NULL,
  `orden_compra_proveedor_id_proveedor` int NOT NULL,
  PRIMARY KEY (`id_factura`,`proveedor_id_proveedor`,`orden_compra_id_orden_compra`,`orden_compra_proveedor_id_proveedor`),
  KEY `fk_factura_proveedor1_idx` (`proveedor_id_proveedor`),
  KEY `fk_factura_orden_compra1_idx` (`orden_compra_id_orden_compra`,`orden_compra_proveedor_id_proveedor`),
  CONSTRAINT `fk_factura_orden_compra1` FOREIGN KEY (`orden_compra_id_orden_compra`) REFERENCES `orden_compra` (`id_orden_compra`),
  CONSTRAINT `fk_factura_proveedor1` FOREIGN KEY (`proveedor_id_proveedor`) REFERENCES `proveedor` (`id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `incidente`
--

DROP TABLE IF EXISTS `incidente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incidente` (
  `idincidente` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) NOT NULL,
  `fecha_apertura` date NOT NULL,
  `estado` varchar(45) NOT NULL,
  `usuario_id_usuario` int NOT NULL,
  `producto_id_producto` int NOT NULL,
  PRIMARY KEY (`idincidente`,`usuario_id_usuario`,`producto_id_producto`),
  KEY `fk_incidente_usuario1_idx` (`usuario_id_usuario`),
  KEY `fk_incidente_producto1_idx` (`producto_id_producto`),
  CONSTRAINT `fk_incidente_usuario1` FOREIGN KEY (`usuario_id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `linea_orden_compra`
--

DROP TABLE IF EXISTS `linea_orden_compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `linea_orden_compra` (
  `id_linea_orden_compra` int NOT NULL AUTO_INCREMENT,
  `cantidad` int NOT NULL,
  `precio_unitario` double NOT NULL,
  `subtotal` double NOT NULL,
  `orden_compra_id_orden_compra` int NOT NULL,
  `orden_compra_proveedor_id_proveedor` int NOT NULL,
  `producto_id_producto` int NOT NULL,
  PRIMARY KEY (`id_linea_orden_compra`,`orden_compra_id_orden_compra`,`orden_compra_proveedor_id_proveedor`,`producto_id_producto`),
  KEY `fk_linea_orden_compra_orden_compra1_idx` (`orden_compra_id_orden_compra`,`orden_compra_proveedor_id_proveedor`),
  KEY `fk_linea_orden_compra_producto1_idx` (`producto_id_producto`),
  CONSTRAINT `fk_linea_orden_compra_orden_compra1` FOREIGN KEY (`orden_compra_id_orden_compra`) REFERENCES `orden_compra` (`id_orden_compra`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orden_compra`
--

DROP TABLE IF EXISTS `orden_compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orden_compra` (
  `id_orden_compra` int NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `cuotas` int NOT NULL,
  `proveedor_id_proveedor` int NOT NULL,
  PRIMARY KEY (`id_orden_compra`,`proveedor_id_proveedor`),
  KEY `fk_orden_compra_proveedor1_idx` (`proveedor_id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `permiso`
--

DROP TABLE IF EXISTS `permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permiso` (
  `id_permiso` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id_permiso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plan_pago`
--

DROP TABLE IF EXISTS `plan_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan_pago` (
  `id_plan_pago` int NOT NULL AUTO_INCREMENT,
  `factura_id_factura` int NOT NULL,
  `numero_cuota` int NOT NULL,
  `importe` double NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `fecha_pago` date DEFAULT NULL COMMENT 'Fecha en que se realizó el pago',
  `metodo_pago` varchar(50) DEFAULT NULL COMMENT 'Transferencia, Cheque, Efectivo, Tarjeta',
  `observaciones` text COMMENT 'Notas adicionales sobre el pago',
  `estado` varchar(45) NOT NULL,
  PRIMARY KEY (`id_plan_pago`),
  KEY `fk_plan_pago_factura1` (`factura_id_factura`),
  CONSTRAINT `fk_plan_pago_factura1` FOREIGN KEY (`factura_id_factura`) REFERENCES `factura` (`id_factura`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `marca` varchar(45) NOT NULL,
  `categoria` varchar(45) NOT NULL,
  `numero_de_serie` varchar(45) NOT NULL,
  `fecha_adquisicion` date NOT NULL,
  `fecha_vencimiento_garantia` date NOT NULL,
  `modelo` varchar(45) NOT NULL,
  `estado_producto` varchar(45) NOT NULL,
  `proveedor_id_proveedor` int NOT NULL,
  PRIMARY KEY (`id_producto`),
  KEY `fk_producto_proveedor1` (`proveedor_id_proveedor`),
  CONSTRAINT `fk_producto_proveedor1` FOREIGN KEY (`proveedor_id_proveedor`) REFERENCES `proveedor` (`id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `proveedor`
--

DROP TABLE IF EXISTS `proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedor` (
  `id_proveedor` int NOT NULL AUTO_INCREMENT,
  `razon_social` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `telefono` varchar(45) NOT NULL,
  `estado_proveedor` varchar(45) NOT NULL,
  `cuit` varchar(45) NOT NULL,
  PRIMARY KEY (`id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `id_rol_UNIQUE` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rol_has_permiso`
--

DROP TABLE IF EXISTS `rol_has_permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol_has_permiso` (
  `rol_id_rol` int NOT NULL,
  `permiso_id_permiso` int NOT NULL,
  PRIMARY KEY (`rol_id_rol`,`permiso_id_permiso`),
  KEY `fk_rol_has_permiso_permiso1_idx` (`permiso_id_permiso`),
  KEY `fk_rol_has_permiso_rol1_idx` (`rol_id_rol`),
  CONSTRAINT `fk_rol_has_permiso_permiso1` FOREIGN KEY (`permiso_id_permiso`) REFERENCES `permiso` (`id_permiso`),
  CONSTRAINT `fk_rol_has_permiso_rol1` FOREIGN KEY (`rol_id_rol`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `servicio_tecnico`
--

DROP TABLE IF EXISTS `servicio_tecnico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicio_tecnico` (
  `id_servicio_tecnico` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_final` date DEFAULT NULL,
  `tecnico_idtecnico` int NOT NULL,
  `tecnico_proveedor_id_proveedor` int NOT NULL,
  `incidente_idincidente` int NOT NULL,
  PRIMARY KEY (`id_servicio_tecnico`,`tecnico_idtecnico`,`tecnico_proveedor_id_proveedor`,`incidente_idincidente`),
  KEY `fk_servicio_tecnico_tecnico1_idx` (`tecnico_idtecnico`,`tecnico_proveedor_id_proveedor`),
  KEY `fk_servicio_tecnico_incidente1_idx` (`incidente_idincidente`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sla`
--

DROP TABLE IF EXISTS `sla`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sla` (
  `id_sla` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `tiempo_respuesta` varchar(45) NOT NULL,
  `penalidad` varchar(45) NOT NULL,
  `metrica_aplicacion` varchar(45) NOT NULL,
  PRIMARY KEY (`id_sla`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tecnico`
--

DROP TABLE IF EXISTS `tecnico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tecnico` (
  `id_tecnico` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `documento` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `telefono` varchar(45) NOT NULL,
  `vigencia_desde` date NOT NULL,
  `vigencia_hasta` date NOT NULL,
  `especialidad` varchar(45) NOT NULL,
  `proveedor_id_proveedor` int NOT NULL,
  PRIMARY KEY (`id_tecnico`,`proveedor_id_proveedor`),
  KEY `fk_tecnico_proveedor1_idx` (`proveedor_id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(200) NOT NULL,
  `rol_id_rol` int NOT NULL,
  PRIMARY KEY (`id_usuario`,`rol_id_rol`),
  KEY `fk_usuario_rol1_idx` (`rol_id_rol`),
  CONSTRAINT `fk_usuario_rol1` FOREIGN KEY (`rol_id_rol`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `v_resumen_proveedores`
--

DROP TABLE IF EXISTS `v_resumen_proveedores`;
/*!50001 DROP VIEW IF EXISTS `v_resumen_proveedores`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_resumen_proveedores` AS SELECT 
 1 AS `id_proveedor`,
 1 AS `proveedor_nombre`,
 1 AS `promedio_servicio`,
 1 AS `promedio_precios`,
 1 AS `promedio_tiempos`,
 1 AS `promedio_calidad`,
 1 AS `promedio_general`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_resumen_tecnicos`
--

DROP TABLE IF EXISTS `v_resumen_tecnicos`;
/*!50001 DROP VIEW IF EXISTS `v_resumen_tecnicos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_resumen_tecnicos` AS SELECT 
 1 AS `id_tecnico`,
 1 AS `tecnico_nombre`,
 1 AS `total_calificaciones`,
 1 AS `promedio_calificacion`,
 1 AS `calificaciones_5_estrellas`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_resumen_proveedores`
--

/*!50001 DROP VIEW IF EXISTS `v_resumen_proveedores`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_resumen_proveedores` AS select `p`.`id_proveedor` AS `id_proveedor`,`p`.`razon_social` AS `proveedor_nombre`,ifnull(avg(`cp`.`servicio_postventa`),0) AS `promedio_servicio`,ifnull(avg(`cp`.`precios`),0) AS `promedio_precios`,ifnull(avg(`cp`.`tiempos_entrega`),0) AS `promedio_tiempos`,ifnull(avg(`cp`.`calidad_productos`),0) AS `promedio_calidad`,ifnull(avg(`cp`.`puntaje_promedio`),0) AS `promedio_general` from (`proveedor` `p` left join `calificacion_proveedor` `cp` on((`p`.`id_proveedor` = `cp`.`proveedor_id_proveedor`))) group by `p`.`id_proveedor`,`p`.`razon_social` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_resumen_tecnicos`
--

/*!50001 DROP VIEW IF EXISTS `v_resumen_tecnicos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_resumen_tecnicos` AS select `t`.`id_tecnico` AS `id_tecnico`,`t`.`nombre` AS `tecnico_nombre`,count(`ct`.`id_calificacion_tecnico`) AS `total_calificaciones`,ifnull(avg(`ct`.`puntaje`),0) AS `promedio_calificacion`,ifnull(sum((case when (`ct`.`puntaje` = 5) then 1 else 0 end)),0) AS `calificaciones_5_estrellas` from (`tecnico` `t` left join `calificacion_tecnico` `ct` on((`t`.`id_tecnico` = `ct`.`tecnico_id_tecnico`))) group by `t`.`id_tecnico`,`t`.`nombre` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-08 21:26:38

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Insertar roles por defecto
INSERT INTO rol (id_rol, nombre_rol) VALUES
(1, 'Administrador'),
(2, 'Consultor')
ON DUPLICATE KEY UPDATE nombre_rol=nombre_rol;

-- Insertar usuario administrador por defecto (contraseña: admin123)
INSERT INTO usuario (nombre, email, password, rol_id_rol) VALUES
('Administrador', 'admin@keywarden.com', '$2a$10$kZXvhF3qXyKjYvXGJ5tHqO8yYxJ6mZYKZqJKqJKqJKqJKqJKqJKqJ', 1)
ON DUPLICATE KEY UPDATE email=email;

-- Habilitar foreign keys nuevamente
SET FOREIGN_KEY_CHECKS=1;

