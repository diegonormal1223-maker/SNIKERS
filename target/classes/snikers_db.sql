-- ==========================================================
-- SCRIPT DE SOBREPOBLACIÓN MASIVA - SNIKERS DB (Adaptado para Railway)
-- Simulación de Alta Actividad
-- ==========================================================

-- Desactivar temporalmente restricciones de llaves foráneas para permitir limpieza limpia
SET FOREIGN_KEY_CHECKS = 0;

-- 1. LIMPIEZA DE TABLAS EXISTENTES
DROP TABLE IF EXISTS `favorites`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `carts`;
DROP TABLE IF EXISTS `addresses`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- ==========================================================
-- 2. ESTRUCTURA (Tablas)
-- ==========================================================

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` enum('USER','ADMIN') DEFAULT NULL,
  `status` enum('ACTIVE','BLOCKED','INACTIVE') DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_t8o6pivur7nn124jehx7cygw5` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `products` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `compare_price` decimal(38,2) DEFAULT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','DRAFT') DEFAULT NULL,
  `colors` varchar(255) DEFAULT NULL,
  `sizes` varchar(255) DEFAULT NULL,
  `category_id` bigint(20) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_fhmd06dsmj6k0n90swsh8ie9g` (`sku`),
  KEY `FKog2rp4qthbtt2lfyhfo32lsw9` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `addresses` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `street_address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  `is_default` bit(1) DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `line1` varchar(255) DEFAULT NULL,
  `line2` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `recipient_name` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `city_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1fa36y2oqhao3wgg2rw1pi459` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `carts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_64t7ox312pqal3p7fg9o503c2` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `cart_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cart_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `size` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpcttvuq4mxppo8sxggjtn5i2c` (`cart_id`),
  KEY `FK1re40cjegsfvw58xrkdp6bac6` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `order_date` datetime(6) DEFAULT NULL,
  `status` enum('PENDING','PAID','SHIPPED','IN_TRANSIT','DELIVERED','CANCELLED','COMPLETED','REFUND_REQUESTED','REFUND_APPROVED','REFUND_REJECTED') DEFAULT NULL,
  `total_amount` decimal(38,2) DEFAULT NULL,
  `subtotal` decimal(38,2) DEFAULT NULL,
  `discount_amount` decimal(38,2) DEFAULT NULL,
  `discount_percent` decimal(38,2) DEFAULT NULL,
  `coupon_code` varchar(255) DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `refund_requested` bit(1) DEFAULT b'0',
  `refund_reason` varchar(255) DEFAULT NULL,
  `refund_status` varchar(255) DEFAULT NULL,
  `refund_response` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `order_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `size` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  KEY `FKocimc7dtr037rh4ls4l95nlfi` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `favorites` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6sgu5npe8ug4o42bf9j71x20c` (`product_id`),
  KEY `FKk7du8b8ewipawnnpg76d55fus` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ==========================================================
-- 3. CARGA DE DATOS MASIVA (DML)
-- ==========================================================

-- A. CATEGORIAS
INSERT INTO `categories` (`id`, `name`, `description`) VALUES
(1, 'Casual', 'Zapatillas casuales para uso diario'),
(2, 'Urbanas', 'Zapatillas urbanas de estilo moderno'),
(3, 'Retro', 'Zapatillas de estilo retro y clásico'),
(4, 'Deportivo', 'Zapatillas deportivas de alto rendimiento');

-- B. USUARIOS (50 Usuarios)
-- Admin: admin123 | Usuarios: cliente123
INSERT INTO `users` (`id`, `email`, `name`, `password`, `role`, `status`, `created_at`) VALUES
(1, 'admin@snikers.com', 'Administrador Principal', '$2a$10$.kAteWUAxxHLu25Yvyen3.QaNAH/njK2mVLYkkQLEmw2TBS.1Wd92', 'ADMIN', 'ACTIVE', NOW()),
(2, 'cliente@snikers.com', 'Cliente Demo', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(3, 'diego@email.com', 'Diego Loso', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(4, 'lucia@email.com', 'Lucía Martínez', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(5, 'carlos@email.com', 'Carlos Ruiz', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(6, 'ana@email.com', 'Ana Torres', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(7, 'david@email.com', 'David Vargas', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(8, 'sofia@email.com', 'Sofía Mendoza', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(9, 'jorge@email.com', 'Jorge Ríos', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(10, 'valentina@email.com', 'Valentina Gómez', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(11, 'andres@email.com', 'Andrés Felipe', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(12, 'camila@email.com', 'Camila Osorio', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(13, 'mateo@email.com', 'Mateo Carvajal', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(14, 'daniela@email.com', 'Daniela Pineda', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(15, 'nicolas@email.com', 'Nicolás Mora', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(16, 'mariana@email.com', 'Mariana Pajón', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(17, 'santiago@email.com', 'Santiago Arias', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(18, 'laura@email.com', 'Laura Acuña', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(19, 'felipe@email.com', 'Felipe Peláez', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(20, 'catalina@email.com', 'Catalina Usme', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(21, 'juan@email.com', 'Juan Cuadrado', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(22, 'isabella@email.com', 'Isabella Santo', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(23, 'miguel@email.com', 'Miguel Borja', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(24, 'paula@email.com', 'Paula Echeverri', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(25, 'sebastian@email.com', 'Sebastián Yatra', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(26, 'user26@test.com', 'Usuario Test 26', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(27, 'user27@test.com', 'Usuario Test 27', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(28, 'user28@test.com', 'Usuario Test 28', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(29, 'user29@test.com', 'Usuario Test 29', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW()),
(30, 'user30@test.com', 'Usuario Test 30', '$2a$10$GSJR4LymFdzTEyovBzBPlu4.F92HAsb1hdB/OsPtatQOA.NSo/N46', 'USER', 'ACTIVE', NOW());

-- C. DIRECCIONES (Masivas para Domicilios)
INSERT INTO `addresses` (`user_id`, `full_name`, `city`, `country`, `street`, `street_address`, `zip_code`, `is_default`, `created_at`) VALUES
(3, 'Diego Loso', 'Aguazul', 'Colombia', 'Centro', 'Cra 10 #5-20', '853010', 1, NOW()),
(4, 'Lucía Martínez', 'Bogotá', 'Colombia', 'Calle 100', 'Cra 15 #100-20', '110111', 1, NOW()),
(5, 'Carlos Ruiz', 'Medellín', 'Colombia', 'Av Poblado', 'Calle 10 #40-50', '050021', 1, NOW()),
(6, 'Ana Torres', 'Cali', 'Colombia', 'Barrio Granada', 'Av 9N #15-20', '760001', 1, NOW()),
(7, 'David Vargas', 'Barranquilla', 'Colombia', 'El Prado', 'Cra 54 #75-10', '080001', 1, NOW()),
(8, 'Sofía Mendoza', 'Bucaramanga', 'Colombia', 'Cabecera', 'Calle 34 #20-10', '680002', 1, NOW()),
(9, 'Jorge Ríos', 'Pereira', 'Colombia', 'Circunvalar', 'Calle 14 #13-20', '660001', 1, NOW()),
(10, 'Valentina Gómez', 'Manizales', 'Colombia', 'Cable', 'Cra 23 #65-10', '170001', 1, NOW()),
(11, 'Andrés Felipe', 'Cartagena', 'Colombia', 'Bocagrande', 'Av San Martín #10-20', '130001', 1, NOW()),
(12, 'Camila Osorio', 'Cúcuta', 'Colombia', 'Caobos', 'Av 0 #15-20', '540001', 1, NOW()),
(13, 'Mateo Carvajal', 'Ibagué', 'Colombia', 'La Pola', 'Calle 7 #4-20', '730001', 1, NOW()),
(14, 'Daniela Pineda', 'Santa Marta', 'Colombia', 'Rodadero', 'Cra 1 #10-20', '470001', 1, NOW()),
(15, 'Nicolás Mora', 'Villavicencio', 'Colombia', 'Barzal', 'Calle 40 #33-10', '500001', 1, NOW()),
(16, 'Mariana Pajón', 'Medellín', 'Colombia', 'Laureles', 'Transversal 39 #70-10', '050022', 1, NOW()),
(17, 'Santiago Arias', 'Envigado', 'Colombia', 'Jardines', 'Calle 38S #40-10', '055422', 1, NOW()),
(18, 'Laura Acuña', 'Bogotá', 'Colombia', 'Rosales', 'Cra 7 #72-10', '110221', 1, NOW()),
(19, 'Felipe Peláez', 'Montería', 'Colombia', 'Recreo', 'Calle 60 #5-10', '230001', 1, NOW()),
(20, 'Catalina Usme', 'Rionegro', 'Colombia', 'Llanogrande', 'Km 5 Vía Aeropuerto', '054040', 1, NOW()),
(21, 'Juan Cuadrado', 'Medellín', 'Colombia', 'Poblado', 'Cra 43A #1-50', '050021', 1, NOW()),
(22, 'Isabella Santo', 'Cali', 'Colombia', 'Peñón', 'Calle 2 #3-10', '760002', 1, NOW());

-- D. PRODUCTOS (Catálogo Extendido usando las 19 imágenes)
INSERT INTO `products` (`name`, `brand`, `description`, `price`, `compare_price`, `sku`, `stock`, `image_url`, `status`, `category_id`, `colors`, `sizes`, `created_at`) VALUES
-- NIKE (Variantes)
('Nike Air Max 90', 'Nike', 'Clásico diseño Air Max.', 120.00, 150.00, 'NIKE-001', 50, '/img/1.png', 'ACTIVE', 1, 'Blanco,Negro,Gris', '38,39,40,41,42', NOW()),
('Nike Air Max 90 Essential', 'Nike', 'Edición esencial en negro total.', 125.00, 155.00, 'NIKE-001B', 30, '/img/1.png', 'ACTIVE', 1, 'Negro', '39,40,41,42', NOW()),
('Nike Air Max 90 Surplus', 'Nike', 'Edición robusta para invierno.', 140.00, 170.00, 'NIKE-001C', 20, '/img/1.png', 'ACTIVE', 1, 'Verde Oliva', '40,41,42,43', NOW()),
('Nike Air Force 1', 'Nike', 'Icono del baloncesto.', 130.00, 160.00, 'NIKE-002', 45, '/img/2.png', 'ACTIVE', 2, 'Blanco,Negro', '36,37,38,39,40,41,42', NOW()),
('Nike Air Force 1 Shadow', 'Nike', 'Doble marca y altura extra.', 140.00, 170.00, 'NIKE-002B', 25, '/img/2.png', 'ACTIVE', 2, 'Pastel,Blanco', '36,37,38,39', NOW()),
('Nike Jordan 1 Retro', 'Nike', 'Estilo clásico Jordan.', 180.00, 200.00, 'NIKE-003', 15, '/img/3.png', 'ACTIVE', 3, 'Rojo,Negro,Blanco', '40,41,42,43,44', NOW()),
('Nike Jordan 1 Mid', 'Nike', 'Corte medio versátil.', 160.00, 180.00, 'NIKE-003B', 22, '/img/3.png', 'ACTIVE', 3, 'Azul,Blanco', '38,39,40,41,42', NOW()),
('Nike Zoom Pegasus 39', 'Nike', 'Para running diario.', 140.00, 170.00, 'NIKE-004', 40, '/img/4.png', 'ACTIVE', 4, 'Azul,Negro', '38,39,40,41,42', NOW()),
('Nike Zoom Pegasus Turbo', 'Nike', 'Más ligero y rápido.', 160.00, 190.00, 'NIKE-004B', 18, '/img/4.png', 'ACTIVE', 4, 'Verde,Gris', '39,40,41,42', NOW()),
('Nike Blazer Mid 77', 'Nike', 'Vintage basketball.', 110.00, 130.00, 'NIKE-005', 35, '/img/5.png', 'ACTIVE', 3, 'Blanco,Negro', '36,37,38,39,40,41', NOW()),
('Nike Dunk Low Retro', 'Nike', 'Estilo Panda muy buscado.', 150.00, 200.00, 'NIKE-019', 10, '/img/19.png', 'ACTIVE', 2, 'Panda,Blanco/Negro', '36,37,38,39,40,41', NOW()),
('Nike Dunk Low Coast', 'Nike', 'Colores inspirados en la costa.', 160.00, 210.00, 'NIKE-019B', 8, '/img/19.png', 'ACTIVE', 2, 'Azul Cielo', '36,37,38,39', NOW()),

-- ADIDAS (Variantes)
('Adidas Ultraboost 22', 'Adidas', 'Máximo retorno de energía.', 180.00, 220.00, 'ADI-006', 40, '/img/6.png', 'ACTIVE', 4, 'Negro,Blanco', '38,39,40,41,42', NOW()),
('Adidas Ultraboost DNA', 'Adidas', 'Estilo urbano con tech running.', 170.00, 200.00, 'ADI-006B', 30, '/img/6.png', 'ACTIVE', 4, 'Rojo,Azul', '39,40,41', NOW()),
('Adidas Superstar', 'Adidas', 'La puntera de goma original.', 100.00, 120.00, 'ADI-007', 55, '/img/7.png', 'ACTIVE', 2, 'Blanco/Negro', '36,37,38,39,40,41', NOW()),
('Adidas Superstar 80s', 'Adidas', 'Reedición vintage.', 110.00, 130.00, 'ADI-007B', 25, '/img/7.png', 'ACTIVE', 2, 'Crema/Blanco', '38,39,40,41', NOW()),
('Adidas Stan Smith', 'Adidas', 'Minimalismo tenis.', 95.00, 110.00, 'ADI-008', 48, '/img/8.png', 'ACTIVE', 1, 'Blanco/Verde', '36,37,38,39,40', NOW()),
('Adidas NMD R1', 'Adidas', 'Nómada urbano.', 140.00, 160.00, 'ADI-009', 32, '/img/9.png', 'ACTIVE', 2, 'Negro,Gris', '38,39,40,41,42', NOW()),
('Adidas NMD V3', 'Adidas', 'Evolución transparente.', 150.00, 180.00, 'ADI-009B', 28, '/img/9.png', 'ACTIVE', 2, 'Blanco,Neon', '39,40,41,42', NOW()),
('Adidas Forum Low', 'Adidas', 'Icono de los 84.', 110.00, 130.00, 'ADI-010', 36, '/img/10.png', 'ACTIVE', 3, 'Azul,Blanco', '37,38,39,40,41,42', NOW()),

-- PUMA & OTROS (Variantes)
('Puma RS-X Reinvention', 'Puma', 'Diseño voluminoso.', 120.00, 140.00, 'PUMA-011', 25, '/img/11.png', 'ACTIVE', 2, 'Multicolor', '37,38,39,40', NOW()),
('Puma RS-X3 Puzzle', 'Puma', 'Capas de colores y texturas.', 125.00, 145.00, 'PUMA-011B', 20, '/img/11.png', 'ACTIVE', 2, 'Rosa,Azul', '36,37,38,39', NOW()),
('Puma Suede Classic', 'Puma', 'Desde 1968.', 90.00, 100.00, 'PUMA-012', 50, '/img/12.png', 'ACTIVE', 3, 'Negro,Rojo', '36,37,38,39,40,41', NOW()),
('Puma Cali Star', 'Puma', 'Brillo de la costa oeste.', 95.00, 110.00, 'PUMA-013', 30, '/img/13.png', 'ACTIVE', 1, 'Blanco,Oro', '36,37,38,39', NOW()),
('Puma Future Rider', 'Puma', 'Fast Rider renacido.', 100.00, 120.00, 'PUMA-014', 28, '/img/14.png', 'ACTIVE', 2, 'Azul,Rojo', '38,39,40,41', NOW()),
('Puma Mayze Leather', 'Puma', 'Plataforma audaz.', 110.00, 130.00, 'PUMA-015', 22, '/img/15.png', 'ACTIVE', 2, 'Blanco,Negro', '36,37,38,39,40', NOW()),
('Jordan 4 Retro', 'Jordan', 'Vuelo y soporte.', 210.00, 250.00, 'JORD-016', 12, '/img/16.png', 'ACTIVE', 3, 'Gris,Negro', '40,41,42,43,44', NOW()),
('Jordan 4 Black Canvas', 'Jordan', 'Material premium canvas.', 220.00, 260.00, 'JORD-016B', 8, '/img/16.png', 'ACTIVE', 3, 'Negro', '41,42,43,44', NOW()),
('Jordan 11 Low', 'Jordan', 'Charol clásico.', 190.00, 220.00, 'JORD-017', 15, '/img/17.png', 'ACTIVE', 3, 'Blanco/Azul', '40,41,42,43', NOW()),
('Jordan Stay Loyal', 'Jordan', 'ADN Jordan moderno.', 150.00, 180.00, 'JORD-018', 25, '/img/18.png', 'ACTIVE', 4, 'Negro/Rojo', '39,40,41,42,43', NOW());


-- E. VENTAS Y PEDIDOS (HISTORIAL MASIVO)
-- Generamos 3 bloques de pedidos:
-- 1. Pedidos Entregados (Histórico - Hace meses)
-- 2. Pedidos Recientes (Mes actual)
-- 3. Pedidos Pendientes/En Proceso (Hoy/Ayer)

-- BLOQUE 1: HISTÓRICO (Entregados) - 30 Pedidos
INSERT INTO `orders` (`user_id`, `order_date`, `status`, `total_amount`, `subtotal`, `shipping_address`, `payment_method`) VALUES
(3, DATE_SUB(NOW(), INTERVAL 60 DAY), 'DELIVERED', 120.00, 120.00, 'Cra 10 #5-20, Aguazul', 'CREDIT_CARD'),
(4, DATE_SUB(NOW(), INTERVAL 58 DAY), 'DELIVERED', 240.00, 240.00, 'Cra 15 #100-20, Bogotá', 'PAYPAL'),
(5, DATE_SUB(NOW(), INTERVAL 55 DAY), 'DELIVERED', 180.00, 180.00, 'Calle 10 #40-50, Medellín', 'CREDIT_CARD'),
(6, DATE_SUB(NOW(), INTERVAL 50 DAY), 'DELIVERED', 95.00, 95.00, 'Av 9N #15-20, Cali', 'CREDIT_CARD'),
(7, DATE_SUB(NOW(), INTERVAL 48 DAY), 'DELIVERED', 300.00, 300.00, 'Cra 54 #75-10, Barranquilla', 'CREDIT_CARD'),
(8, DATE_SUB(NOW(), INTERVAL 45 DAY), 'DELIVERED', 150.00, 150.00, 'Calle 34 #20-10, Bucaramanga', 'PAYPAL'),
(9, DATE_SUB(NOW(), INTERVAL 42 DAY), 'DELIVERED', 110.00, 110.00, 'Calle 14 #13-20, Pereira', 'CREDIT_CARD'),
(10, DATE_SUB(NOW(), INTERVAL 40 DAY), 'DELIVERED', 210.00, 210.00, 'Cra 23 #65-10, Manizales', 'CREDIT_CARD'),
(3, DATE_SUB(NOW(), INTERVAL 35 DAY), 'DELIVERED', 90.00, 90.00, 'Cra 10 #5-20, Aguazul', 'PAYPAL'),
(4, DATE_SUB(NOW(), INTERVAL 30 DAY), 'DELIVERED', 140.00, 140.00, 'Cra 15 #100-20, Bogotá', 'CREDIT_CARD'),
(11, DATE_SUB(NOW(), INTERVAL 28 DAY), 'DELIVERED', 180.00, 180.00, 'Cartagena, Bocagrande', 'CREDIT_CARD'),
(12, DATE_SUB(NOW(), INTERVAL 27 DAY), 'DELIVERED', 100.00, 100.00, 'Cúcuta, Caobos', 'PAYPAL'),
(13, DATE_SUB(NOW(), INTERVAL 25 DAY), 'DELIVERED', 250.00, 250.00, 'Ibagué, La Pola', 'CREDIT_CARD'),
(14, DATE_SUB(NOW(), INTERVAL 24 DAY), 'DELIVERED', 130.00, 130.00, 'Santa Marta, Rodadero', 'CREDIT_CARD'),
(15, DATE_SUB(NOW(), INTERVAL 20 DAY), 'DELIVERED', 120.00, 120.00, 'Villavicencio, Barzal', 'PAYPAL');

-- BLOQUE 2: RECIENTES (Enviados/Entregados) - 15 Pedidos
INSERT INTO `orders` (`user_id`, `order_date`, `status`, `total_amount`, `subtotal`, `shipping_address`, `payment_method`) VALUES
(16, DATE_SUB(NOW(), INTERVAL 15 DAY), 'SHIPPED', 160.00, 160.00, 'Medellín, Laureles', 'CREDIT_CARD'),
(17, DATE_SUB(NOW(), INTERVAL 12 DAY), 'SHIPPED', 220.00, 220.00, 'Envigado, Jardines', 'CREDIT_CARD'),
(18, DATE_SUB(NOW(), INTERVAL 10 DAY), 'SHIPPED', 350.00, 350.00, 'Bogotá, Rosales', 'PAYPAL'),
(19, DATE_SUB(NOW(), INTERVAL 8 DAY), 'DELIVERED', 110.00, 110.00, 'Montería, Recreo', 'CREDIT_CARD'),
(20, DATE_SUB(NOW(), INTERVAL 7 DAY), 'DELIVERED', 140.00, 140.00, 'Rionegro, Llanogrande', 'CREDIT_CARD'),
(21, DATE_SUB(NOW(), INTERVAL 6 DAY), 'SHIPPED', 180.00, 180.00, 'Medellín, Poblado', 'PAYPAL'),
(22, DATE_SUB(NOW(), INTERVAL 5 DAY), 'SHIPPED', 120.00, 120.00, 'Cali, Peñón', 'CREDIT_CARD'),
(5, DATE_SUB(NOW(), INTERVAL 4 DAY), 'DELIVERED', 95.00, 95.00, 'Medellín, Av Poblado', 'CREDIT_CARD'),
(6, DATE_SUB(NOW(), INTERVAL 4 DAY), 'SHIPPED', 150.00, 150.00, 'Cali, Barrio Granada', 'CREDIT_CARD'),
(7, DATE_SUB(NOW(), INTERVAL 3 DAY), 'SHIPPED', 200.00, 200.00, 'Barranquilla, El Prado', 'PAYPAL');

-- BLOQUE 3: ACTIVOS (Pendientes/Procesando) - 10 Pedidos
INSERT INTO `orders` (`user_id`, `order_date`, `status`, `total_amount`, `subtotal`, `shipping_address`, `payment_method`) VALUES
(23, NOW(), 'PENDING', 120.00, 120.00, 'Bogotá, Calle 85', 'CREDIT_CARD'),
(24, NOW(), 'PENDING', 280.00, 280.00, 'Cali, Ciudad Jardín', 'PAYPAL'),
(25, NOW(), 'PENDING', 140.00, 140.00, 'Medellín, Tesoro', 'CREDIT_CARD'),
(3, NOW(), 'PENDING', 180.00, 180.00, 'Cra 10 #5-20, Aguazul', 'CREDIT_CARD'),
(4, NOW(), 'PENDING', 110.00, 110.00, 'Cra 15 #100-20, Bogotá', 'CREDIT_CARD'),
(8, NOW(), 'CANCELLED', 130.00, 130.00, 'Bucaramanga', 'PAYPAL'), -- Un cancelado
(12, NOW(), 'PENDING', 160.00, 160.00, 'Cúcuta', 'CREDIT_CARD'),
(15, NOW(), 'PENDING', 100.00, 100.00, 'Villavicencio', 'CREDIT_CARD'),
(26, NOW(), 'PENDING', 90.00, 90.00, 'Bogotá', 'PAYPAL'),
(27, NOW(), 'PENDING', 210.00, 210.00, 'Medellín', 'CREDIT_CARD');

-- F. ITEMS DE PEDIDOS (Llenando los pedidos creados arriba)
-- Asignamos productos aleatorios a los pedidos
-- Nota: IDs de pedidos van del 1 al ~40 en este script
INSERT INTO `order_items` (`order_id`, `product_id`, `quantity`, `price`, `size`, `color`) VALUES
(1, 1, 1, 120.00, '40', 'Blanco'),
(2, 4, 1, 130.00, '38', 'Negro'), (2, 10, 1, 110.00, '38', 'Blanco'), -- Pedido 2 con 2 items
(3, 6, 1, 180.00, '42', 'Rojo'),
(4, 17, 1, 95.00, '37', 'Blanco'),
(5, 11, 2, 150.00, '41', 'Panda'), -- 2 pares de Dunks
(6, 26, 1, 150.00, '43', 'Negro'),
(7, 20, 1, 110.00, '39', 'Azul'),
(8, 27, 1, 210.00, '40', 'Gris'),
(9, 23, 1, 90.00, '40', 'Negro'),
(10, 8, 1, 140.00, '42', 'Azul'),
(11, 13, 1, 180.00, '43', 'Negro'),
(12, 15, 1, 100.00, '36', 'Blanco'),
(13, 29, 1, 190.00, '44', 'Blanco'), (13, 23, 1, 60.00, '44', 'Rojo'), -- Pedido grande
(14, 4, 1, 130.00, '37', 'Blanco'),
(15, 1, 1, 120.00, '40', 'Gris'),
(16, 7, 1, 160.00, '39', 'Azul'),
(17, 28, 1, 220.00, '42', 'Negro'),
(18, 11, 1, 150.00, '36', 'Panda'), (18, 12, 1, 160.00, '36', 'Azul'), (18, 25, 1, 40.00, '36', 'Rosa'), -- Pedido muy grande
(19, 10, 1, 110.00, '38', 'Blanco'),
(20, 8, 1, 140.00, '41', 'Negro'),
(21, 6, 1, 180.00, '42', 'Blanco'),
(22, 1, 1, 120.00, '40', 'Blanco'),
(23, 17, 1, 95.00, '38', 'Verde'),
(24, 26, 1, 150.00, '40', 'Negro'),
(25, 27, 1, 200.00, '42', 'Rojo'),
(26, 1, 1, 120.00, '41', 'Negro'),
(27, 8, 2, 140.00, '39', 'Azul'),
(28, 2, 1, 140.00, '42', 'Blanco'),
(29, 6, 1, 180.00, '43', 'Negro'),
(30, 5, 1, 110.00, '37', 'Pastel'),
(31, 4, 1, 130.00, '42', 'Negro'),
(32, 15, 1, 100.00, '38', 'Blanco'), (32, 17, 1, 60.00, '38', 'Verde');

-- G. CARRITOS Y FAVORITOS
INSERT INTO `carts` (`user_id`) VALUES (3), (4), (5), (6), (7), (8), (9), (10);

-- Items en carrito (Gente a punto de comprar)
INSERT INTO `cart_items` (`cart_id`, `product_id`, `quantity`, `size`, `color`) VALUES 
(1, 11, 1, '40', 'Panda'),
(2, 28, 1, '42', 'Negro'),
(3, 15, 1, '37', 'Blanco'),
(4, 1, 1, '41', 'Gris');

-- Favoritos (Gente guardando productos)
INSERT INTO `favorites` (`user_id`, `product_id`, `created_at`) VALUES
(3, 6, NOW()), (3, 27, NOW()),
(4, 10, NOW()),
(5, 29, NOW()), (5, 11, NOW()),
(6, 4, NOW());

-- ==========================================================
-- 4. CONSTRAINTS (Claves Foráneas)
-- ==========================================================

ALTER TABLE `addresses`
  ADD CONSTRAINT `FK1fa36y2oqhao3wgg2rw1pi459` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `carts`
  ADD CONSTRAINT `FKb5o626f86h46m4s7ms6ginnop` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `cart_items`
  ADD CONSTRAINT `FK1re40cjegsfvw58xrkdp6bac6` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `FKpcttvuq4mxppo8sxggjtn5i2c` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`);

ALTER TABLE `favorites`
  ADD CONSTRAINT `FK6sgu5npe8ug4o42bf9j71x20c` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `FKk7du8b8ewipawnnpg76d55fus` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `orders`
  ADD CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `order_items`
  ADD CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `FKocimc7dtr037rh4ls4l95nlfi` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

ALTER TABLE `products`
  ADD CONSTRAINT `FKog2rp4qthbtt2lfyhfo32lsw9` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

-- Reestablecer restricciones de llaves foráneas
SET FOREIGN_KEY_CHECKS = 1;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
