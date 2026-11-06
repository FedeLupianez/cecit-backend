/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.20-13.0.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: cecit
-- ------------------------------------------------------
-- Server version	11.8.6-MariaDB-5ubuntu0.1 from Ubuntu

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `Accounts`
--

DROP TABLE IF EXISTS `Accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Accounts` (
  `id_account` varchar(4) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('USER','CECIT_ADMIN','PARTNER_ADMIN') DEFAULT 'USER',
  `active` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_account`),
  UNIQUE KEY `IDX_0c5666efc38b6f023b7814c73d` (`email`),
  KEY `IDX_0c9042702a3047d28d0a1e68d2` (`role`),
  CONSTRAINT `account_user_fk` FOREIGN KEY (`id_account`) REFERENCES `Users` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Accounts`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Accounts` WRITE;
/*!40000 ALTER TABLE `Accounts` DISABLE KEYS */;
INSERT INTO `Accounts` VALUES
('0070','tous@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$S81DtzQK8GH4/r/diOLAkA$dl0AlgVVRqdIzdCSU4k2OHwpkFDGinvj+xCQAGep4M0','USER',1),
('0e38','cine@partner.com','$argon2id$v=19$m=65536,t=3,p=4$3muHqWJaWjeI+xHqyHrAwg$PLp9PI04TSmOaYzZrJ4NrTy5ovh75zTW98f5pIqtDmY','PARTNER_ADMIN',1),
('2B36','agustin@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$esG2DapNCyb8PIy5M960Pg$V3iZQmUiDpEwSWkJ6ghw7gXYUOPCwSv6eu+FnTpiP7Q','USER',1),
('5a07','admin@socios.com','$argon2id$v=19$m=65536,t=3,p=4$S81DtzQK8GH4/r/diOLAkA$dl0AlgVVRqdIzdCSU4k2OHwpkFDGinvj+xCQAGep4M0','CECIT_ADMIN',1),
('a31b','testadmin@cecit.com','$argon2id$v=19$m=65536,t=3,p=4$S81DtzQK8GH4/r/diOLAkA$dl0AlgVVRqdIzdCSU4k2OHwpkFDGinvj+xCQAGep4M0','CECIT_ADMIN',1),
('be89','lupianezfedericoignacio@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$zcCdEuSVgxDLL6JcyHiGBw$eBbRRIIuo7dA01YMrwZb0c1GB9sbI+g/4jvnnh5qS/w','USER',1),
('ded4','carlos@partner.com','$argon2id$v=19$m=65536,t=3,p=4$S81DtzQK8GH4/r/diOLAkA$dl0AlgVVRqdIzdCSU4k2OHwpkFDGinvj+xCQAGep4M0','PARTNER_ADMIN',1),
('df0d','burger@partner.com','$argon2id$v=19$m=65536,t=3,p=4$r46ZZTvUnFPBOO7Fyp9a0A$z+MQXtYL8Q0/8J2ocBqdIK4wgmkGNUS3oVagDTTVnu8','PARTNER_ADMIN',1);
/*!40000 ALTER TABLE `Accounts` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `BenefitTypes`
--

DROP TABLE IF EXISTS `BenefitTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `BenefitTypes` (
  `id_type` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `active` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_type`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BenefitTypes`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `BenefitTypes` WRITE;
/*!40000 ALTER TABLE `BenefitTypes` DISABLE KEYS */;
INSERT INTO `BenefitTypes` VALUES
(1,'Descuento',1),
(2,'2x1',1),
(3,'Regalo',1),
(4,'Cashback',1);
/*!40000 ALTER TABLE `BenefitTypes` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Benefits`
--

DROP TABLE IF EXISTS `Benefits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Benefits` (
  `id_benefit` varchar(4) NOT NULL,
  `id_admin` varchar(4) NOT NULL,
  `id_partner` varchar(4) NOT NULL,
  `date_entered` date NOT NULL DEFAULT curdate(),
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `image` varchar(2048) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(500) NOT NULL,
  `status` enum('ACTIVE','INACTIVE','PENDING') DEFAULT NULL,
  `id_type` int(11) NOT NULL,
  `max_coupons` int(11) NOT NULL,
  `coupons` int(11) DEFAULT 0,
  `max_per_user` int(11) DEFAULT 3,
  `refund_limit` float DEFAULT NULL,
  PRIMARY KEY (`id_benefit`),
  KEY `FK_be1f417d247c4ed000122215073` (`id_admin`),
  KEY `FK_65a8f16542b510030db783acad9` (`id_partner`),
  KEY `FK_5e94172c6086dc52ffcda3b1236` (`id_type`),
  KEY `Benefit_created_idx` (`date_entered`),
  KEY `Benefit_start_idx` (`start_date`),
  KEY `Benefit_end_idx` (`end_date`),
  CONSTRAINT `FK_5e94172c6086dc52ffcda3b1236` FOREIGN KEY (`id_type`) REFERENCES `BenefitTypes` (`id_type`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_65a8f16542b510030db783acad9` FOREIGN KEY (`id_partner`) REFERENCES `Partners` (`id_partner`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_be1f417d247c4ed000122215073` FOREIGN KEY (`id_admin`) REFERENCES `Accounts` (`id_account`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Benefits`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Benefits` WRITE;
/*!40000 ALTER TABLE `Benefits` DISABLE KEYS */;
INSERT INTO `Benefits` VALUES
('171A','5a07','e896','2026-10-31','2026-10-31 08:00:00','2026-11-02 19:00:00','https://placehold.co/600x400','test 5','asdasd','ACTIVE',1,60,0,2,500),
('1e65','5a07','e896','2026-06-26','2026-09-10 00:00:00','2026-09-30 00:00:00','https://cdn.pixabay.com/photo/2023/09/23/15/56/ai-generated-8271284_1280.jpg','20% OFF en hamburguesas','Descuento en toda la carta excepto promociones.','ACTIVE',1,500,14,3,NULL),
('1F73','a31b','32e9','2026-09-23','2026-09-23 00:00:00','2026-09-30 00:00:00','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5bg      ‚îÇ gKO86ScgTQUegsVWPZlp4zGQ7I2RZK_AfF2k2hWIomkFud02rNHM4o&s=10','20% Descuento en Listones','Descuento en listones de todo tipo.','INACTIVE',1,25,1,3,2000),
('2FE7','a31b','32e9','2026-09-30','2026-09-30 00:00:00','2026-10-08 00:00:00','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Facropolistextil.com.mx%2Fwp-content%2Fuploads%2F2016%2F06%2Ftelas-colores-b%25C3%25A1sicos-suaves.jpg&f=1&nofb=1&ipt=a94652a555865d36025c393655a921c468575c1133e4a1d0204a122dfd79be2b','20% en listones','descuento en listones de todo tipo','INACTIVE',1,20,4,3,NULL),
('35D2','a31b','32e9','2026-09-22','2026-09-21 00:00:00','2026-09-30 00:00:00','https://placehold.co/600x400?text=40% Off en Telas','40% Off en Telas','40% de descuento en telas de todos colores.','INACTIVE',1,20,0,1,NULL),
('3B15','a31b','32e9','2026-09-22','2026-09-22 00:00:00','2026-09-30 00:00:00','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5bggKO86ScgTQUegsVWPZlp4zGQ7I2RZK_AfF2k2hWIomkFud02rNHM4o&s=10','20% Descuento en Listones','Descuento en listones de todo tipo.','INACTIVE',1,20,0,2,NULL),
('3ff0','5a07','07fe','2026-06-26','2026-09-10 00:00:00','2026-09-30 00:00:00','https://blog.o2fitnessclubs.com/hubfs/GymTermCheatSheet.jpg','50% primer mes','Promoci√≥n exclusiva para nuevos socios.','ACTIVE',1,150,5,3,NULL),
('5556','a31b','32e9','2026-09-09','2026-09-10 00:00:00','2026-09-30 00:00:00','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj4BlenU_V2xwOYVh-uAjB6xI8ShMt3taO6hTFBGUK0zNUASkr5S_E0t8&s=10','ferrari','ferrari roja','INACTIVE',2,50,4,3,NULL),
('5C71','ded4','32e9','2026-10-07','2026-10-07 00:00:00','2026-10-14 00:00:00','https://randomapi.dev/api/images/placeholder?text=25% en alfileres&bg=151532','25% en alfileres','caja de alfileres','ACTIVE',1,20,0,2,2001),
('5ec1','5a07','0413','2026-06-26','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Entradas 2x1','2x1 v√°lido de lunes a jueves.','ACTIVE',2,300,4,3,NULL),
('64C0','5a07','8467','2026-10-31','2026-10-31 12:00:00','2026-11-04 21:00:00','https://placehold.co/600x400','test 5','test 5','ACTIVE',1,67,6,67,NULL),
('6614','5a07','32e9','2026-10-31','2026-10-31 13:00:00','2026-11-10 23:00:00','https://placehold.co/600x400','hola familia','adasds','ACTIVE',1,25,4,4,2500),
('685A','5a07','32e9','2026-10-31','2026-10-31 00:00:00','2026-11-02 00:00:00','https://randomapi.dev/api/images/placeholder?text=test 4&bg=151532','test 4','asdkad','ACTIVE',1,60,0,4,2000),
('797B','5a07','3b90','2026-10-31','2026-10-29 00:00:00','2026-11-11 00:00:00','https://randomapi.dev/api/images/placeholder?text=asdad&bg=151532','asdad','adasd','ACTIVE',1,100,0,12,46767),
('880A','a31b','32e9','2026-09-16','2026-09-16 00:00:00','2026-09-24 00:00:00','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fescuela.it%2Fstorage%2Fcourse_images%2Fimagen-curso-programacion-desde-cero-57.jpg&f=1&nofb=1&ipt=919e239e118266de25dd3aa35d208390afd226fc579d95f0afffa49eacc696d9','Curso de Programaci√≥n','curso gratuito','ACTIVE',2,20,3,4,NULL),
('8E79','a31b','32e9','2026-09-23','2026-09-23 00:00:00','2026-09-30 00:00:00','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Facropolistextil.com.mx%2Fwp-content%2Fuploads%2F2016%2F06%2Ftelas-colores-b%25C3%25A1sicos-suaves.jpg&f=1&nofb=1&ipt=a94652a555865d36025c393655a921c468575c1133e4a1d0204a122dfd79be2b','20% Descuento en Listones','Descuento en listones de todo tipo.','INACTIVE',1,25,1,3,2000),
('97EC','5a07','d657','2026-10-31','2026-10-31 00:00:00','2026-11-03 00:00:00','https://randomapi.dev/api/images/placeholder?text=test de limite y horas&bg=151532','test de limite y horas','hola','ACTIVE',1,400,0,2,2000),
('a001','5a07','0413','2026-06-26','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Entradas 2x1','2x1 v√°lido de lunes a jueves.','ACTIVE',2,300,2,3,NULL),
('a002','0e38','c6ed','2026-06-25','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Caf√© gratis','Un caf√© sin cargo presentando el beneficio.','ACTIVE',1,100,2,3,NULL),
('a003','ded4','0ac5','2026-06-24','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Descuento restaurante','20% de descuento en consumo general.','ACTIVE',3,200,0,3,NULL),
('a004','df0d','07fe','2026-06-23','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Gimnasio mensual','Primer mes con descuento especial.','ACTIVE',2,150,0,3,NULL),
('a005','a31b','1a3d','2026-06-22','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Cena para dos','Cena promocional para dos personas.','ACTIVE',4,80,1,3,NULL),
('a006','5a07','a3d3','2026-06-21','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Descuento supermercado','15% de descuento en productos seleccionados.','ACTIVE',1,500,5,3,NULL),
('a007','0e38','32e9','2026-06-20','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Entradas cine premium','2 entradas al precio de una.','ACTIVE',2,250,1,3,NULL),
('a009','df0d','5990','2026-06-18','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Curso online','Acceso promocional a cursos virtuales.','ACTIVE',3,300,2,3,NULL),
('a010','a31b','60a5','2026-06-17','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Tienda online','10% de descuento en compras online.','ACTIVE',1,400,0,3,NULL),
('a011','5a07','6f24','2026-06-16','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Descuento tecnolog√≠a','15% en accesorios tecnol√≥gicos.','ACTIVE',2,250,1,3,NULL),
('a012','0e38','70ff','2026-06-15','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Helader√≠a 2x1','Promoci√≥n v√°lida todos los viernes.','ACTIVE',4,120,0,3,NULL),
('a013','ded4','3b90','2026-06-14','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Ropa deportiva','25% descuento en indumentaria.','ACTIVE',2,200,0,3,NULL),
('a014','df0d','8467','2026-06-13','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Servicio automotor','Revisi√≥n gratuita del veh√≠culo.','ACTIVE',3,100,0,3,NULL),
('a015','a31b','954e','2026-06-12','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Combo familiar','Combo especial para familias.','ACTIVE',4,150,1,3,NULL),
('a016','5a07','d402','2026-06-11','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Panader√≠a descuento','20% descuento en productos seleccionados.','ACTIVE',1,300,1,3,NULL),
('a018','ded4','d71f','2026-06-09','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Delivery gratis','Env√≠o sin costo en compras superiores.','ACTIVE',2,250,0,3,NULL),
('a019','df0d','e896','2026-06-08','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Belleza descuento','30% descuento en tratamientos.','ACTIVE',3,120,0,3,NULL),
('a020','a31b','e93a','2026-06-07','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Consultor√≠a gratis','Primera consulta sin costo.','ACTIVE',1,50,0,3,NULL),
('a021','5a07','0413','2026-06-06','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Combo desayuno','Desayuno completo con descuento especial.','ACTIVE',2,180,0,3,NULL),
('a022','0e38','c6ed','2026-06-05','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Corte de cabello','30% descuento en peluquer√≠a.','ACTIVE',3,100,0,3,NULL),
('a023','ded4','0ac5','2026-06-04','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Clases de idiomas','Primera clase gratuita.','ACTIVE',4,200,0,3,NULL),
('a024','df0d','07fe','2026-06-03','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Descuento librer√≠a','15% en libros seleccionados.','ACTIVE',1,250,0,3,NULL),
('a026','5a07','a3d3','2026-06-01','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Servicio limpieza','20% descuento en servicios.','ACTIVE',2,120,0,3,NULL),
('a027','0e38','32e9','2026-05-31','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Curso fotograf√≠a','Acceso con precio reducido.','ACTIVE',3,150,0,3,NULL),
('a028','ded4','4e7b','2026-05-30','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Excursi√≥n tur√≠stica','Descuento en excursiones nacionales.','ACTIVE',4,80,0,3,NULL),
('a029','df0d','5990','2026-05-29','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Accesorios m√≥viles','20% descuento en accesorios.','ACTIVE',1,350,0,3,NULL),
('a030','a31b','60a5','2026-05-28','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Almuerzo ejecutivo','Men√∫ ejecutivo promocional.','ACTIVE',2,200,0,3,NULL),
('a031','5a07','6f24','2026-05-27','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Seguro hogar','Precio especial para clientes.','ACTIVE',3,100,0,3,NULL),
('a032','0e38','70ff','2026-05-26','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Descuento farmacia','10% descuento en productos habilitados.','ACTIVE',1,500,0,3,NULL),
('a033','ded4','3b90','2026-05-25','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Zapater√≠a descuento','25% descuento en calzado.','ACTIVE',2,220,0,3,NULL),
('a034','df0d','8467','2026-05-24','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Lavado premium','Lavado completo con descuento.','ACTIVE',4,90,0,3,NULL),
('a036','5a07','d402','2026-05-22','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Pizza familiar','Promoci√≥n v√°lida fines de semana.','ACTIVE',2,300,0,3,NULL),
('a037','0e38','d657','2026-05-21','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Internet hogar','Primer mes con descuento.','ACTIVE',3,150,0,3,NULL),
('a038','ded4','d71f','2026-05-20','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Club deportivo','Acceso promocional al club.','ACTIVE',1,120,0,3,NULL),
('a039','df0d','e896','2026-05-19','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Comida r√°pida','Combo con descuento.','ACTIVE',4,400,0,3,NULL),
('a040','a31b','e93a','2026-05-18','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Taller mec√°nico','Diagn√≥stico gratuito del veh√≠culo.','ACTIVE',2,100,0,3,NULL),
('a042','0e38','c6ed','2026-05-16','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Reposter√≠a dulce','2x1 en productos seleccionados.','ACTIVE',1,200,0,3,NULL),
('a043','ded4','0ac5','2026-05-15','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Entrenamiento personal','Primera sesi√≥n sin costo.','ACTIVE',3,90,0,3,NULL),
('a044','df0d','07fe','2026-05-14','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Decoraci√≥n hogar','15% descuento en muebles.','ACTIVE',2,250,0,3,NULL),
('a045','a31b','1a3d','2026-05-13','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Videojuegos','Descuento en juegos seleccionados.','ACTIVE',4,300,0,3,NULL),
('a047','0e38','32e9','2026-05-11','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Bar cafeter√≠a','Consumici√≥n con descuento.','ACTIVE',1,220,1,3,NULL),
('a048','ded4','4e7b','2026-05-10','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Aventura outdoor','20% descuento en actividades.','ACTIVE',3,140,0,3,NULL),
('a049','df0d','5990','2026-05-09','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Electrodom√©sticos','Descuento especial por temporada.','ACTIVE',2,350,0,3,NULL),
('a050','a31b','60a5','2026-05-08','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Experiencia gastron√≥mica','Cena degustaci√≥n promocional.','ACTIVE',4,120,0,3,NULL),
('a051','5a07','6f24','2026-05-07','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Super ahorro semanal','Descuento especial en productos seleccionados.','ACTIVE',1,400,0,3,NULL),
('a052','0e38','70ff','2026-05-06','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Men√∫ saludable','Almuerzo saludable con precio promocional.','ACTIVE',2,180,0,3,NULL),
('a053','ded4','3b90','2026-05-05','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Clase yoga','Primera clase gratuita para nuevos clientes.','ACTIVE',3,100,0,3,NULL),
('a054','df0d','8467','2026-05-04','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Cambio de aceite','Servicio con descuento exclusivo.','ACTIVE',4,120,0,3,NULL),
('a056','5a07','d402','2026-05-02','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Descuento cafeter√≠a','Promoci√≥n v√°lida todos los d√≠as.','ACTIVE',1,200,0,3,NULL),
('a057','0e38','d657','2026-05-01','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Servicio t√©cnico','Revisi√≥n inicial gratuita.','ACTIVE',2,150,0,3,NULL),
('a058','ded4','d71f','2026-04-30','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Parrilla argentina','Combo especial para dos personas.','ACTIVE',3,220,0,3,NULL),
('a059','df0d','e896','2026-04-29','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Clases m√∫sica','Descuento en clases particulares.','ACTIVE',4,90,0,3,NULL),
('a061','5a07','0413','2026-04-27','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Tienda deportiva','25% descuento en ropa deportiva.','ACTIVE',2,300,0,3,NULL),
('a062','0e38','c6ed','2026-04-26','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Descuento barber√≠a','Corte y barba promocional.','ACTIVE',1,150,0,3,NULL),
('a063','ded4','0ac5','2026-04-25','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Restaurante familiar','Men√∫ familiar con descuento.','ACTIVE',4,200,0,3,NULL),
('a064','df0d','07fe','2026-04-24','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Limpieza hogar','Servicio mensual promocional.','ACTIVE',3,100,0,3,NULL),
('a066','5a07','a3d3','2026-04-22','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Comida italiana','Combo italiano promocional.','ACTIVE',2,180,0,3,NULL),
('a067','0e38','32e9','2026-04-21','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Centro est√©tica','Descuento en tratamientos faciales.','ACTIVE',3,90,0,3,NULL),
('a068','ded4','4e7b','2026-04-20','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Hotel boutique','Oferta exclusiva de alojamiento.','ACTIVE',4,80,0,3,NULL),
('a069','df0d','5990','2026-04-19','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Reparaci√≥n celulares','Diagn√≥stico sin cargo.','ACTIVE',1,250,0,3,NULL),
('a071','5a07','6f24','2026-04-17','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Panader√≠a artesanal','Promoci√≥n en productos frescos.','ACTIVE',2,300,0,3,NULL),
('a072','0e38','70ff','2026-04-16','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Clases baile','Primera clase gratis.','ACTIVE',3,100,0,3,NULL),
('a073','ded4','3b90','2026-04-15','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Descuento ferreter√≠a','10% en materiales seleccionados.','ACTIVE',1,350,0,3,NULL),
('a074','df0d','8467','2026-04-14','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Servicio fotograf√≠a','Sesi√≥n promocional.','ACTIVE',4,60,0,3,NULL),
('a076','5a07','d402','2026-04-12','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Servicio internet','Bonificaci√≥n por contrataci√≥n.','ACTIVE',2,200,0,3,NULL),
('a077','0e38','d657','2026-04-11','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Cine familiar','Entradas familiares promocionales.','ACTIVE',3,300,0,3,NULL),
('a078','ded4','d71f','2026-04-10','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Excursi√≥n aventura','Descuento en actividades.','ACTIVE',4,120,0,3,NULL),
('a079','df0d','e896','2026-04-09','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Tienda mascotas','20% descuento para mascotas.','ACTIVE',1,250,0,3,NULL),
('a080','a31b','e93a','2026-04-08','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Restaurante sushi','Combo sushi promocional.','ACTIVE',2,180,0,3,NULL),
('a081','5a07','0413','2026-04-07','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Descuento electr√≥nica','15% de descuento en productos electr√≥nicos.','ACTIVE',2,300,0,3,NULL),
('a082','0e38','c6ed','2026-04-06','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Caf√© desayuno','Desayuno completo con precio especial.','ACTIVE',1,200,0,3,NULL),
('a083','ded4','0ac5','2026-04-05','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Entradas teatro','2 entradas con descuento especial.','ACTIVE',4,150,0,3,NULL),
('a084','df0d','07fe','2026-04-04','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Servicio pintura','20% descuento en trabajos seleccionados.','ACTIVE',3,100,0,3,NULL),
('a086','5a07','a3d3','2026-04-02','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Comida mexicana','Combo mexicano promocional.','ACTIVE',2,180,0,3,NULL),
('a087','0e38','32e9','2026-04-01','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Centro entrenamiento','Plan mensual con descuento.','ACTIVE',3,120,0,3,NULL),
('a088','ded4','4e7b','2026-03-31','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Alojamiento tur√≠stico','Descuento en reservas anticipadas.','ACTIVE',4,80,0,3,NULL),
('a089','df0d','5990','2026-03-30','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Repuestos auto','10% descuento en repuestos.','ACTIVE',1,400,0,3,NULL),
('a091','5a07','6f24','2026-03-28','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Supermercado online','Env√≠o gratis en compras online.','ACTIVE',2,500,0,3,NULL),
('a092','0e38','70ff','2026-03-27','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Pasteler√≠a premium','20% descuento en tortas.','ACTIVE',3,150,0,3,NULL),
('a093','ded4','3b90','2026-03-26','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Indumentaria urbana','Descuento en ropa seleccionada.','ACTIVE',4,220,0,3,NULL),
('a094','df0d','8467','2026-03-25','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Servicio fotograf√≠a','Pack de fotos promocional.','ACTIVE',1,100,0,3,NULL),
('a096','5a07','d402','2026-03-23','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Pizzer√≠a familiar','2 pizzas al precio promocional.','ACTIVE',2,200,0,3,NULL),
('a097','0e38','d657','2026-03-22','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Plataforma digital','Acceso mensual promocional.','ACTIVE',3,300,0,3,NULL),
('a098','ded4','d71f','2026-03-21','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Taller cocina','Clase pr√°ctica con descuento.','ACTIVE',4,120,0,3,NULL),
('a099','df0d','e896','2026-03-20','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Accesorios hogar','Promoci√≥n en decoraci√≥n.','ACTIVE',1,250,0,3,NULL),
('a101','5a07','0413','2026-03-18','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Descuento restaurante','25% de descuento en platos seleccionados.','ACTIVE',2,300,0,3,NULL),
('a102','0e38','c6ed','2026-03-17','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Servicio est√©tica','Tratamiento facial promocional.','ACTIVE',3,120,0,3,NULL),
('a103','ded4','0ac5','2026-03-16','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Caf√© especial','2x1 en bebidas calientes.','ACTIVE',1,250,0,3,NULL),
('a104','df0d','07fe','2026-03-15','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Servicio el√©ctrico','Revisi√≥n inicial sin cargo.','ACTIVE',4,80,0,3,NULL),
('a106','5a07','a3d3','2026-03-13','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Almuerzo ejecutivo','Men√∫ ejecutivo con descuento.','ACTIVE',2,180,0,3,NULL),
('a107','0e38','32e9','2026-03-12','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Cine premium','Entrada premium promocional.','ACTIVE',3,300,0,3,NULL),
('a108','ded4','4e7b','2026-03-11','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Hotel vacaciones','Oferta especial de temporada.','ACTIVE',4,90,0,3,NULL),
('a109','df0d','5990','2026-03-10','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Tecnolog√≠a m√≥vil','20% descuento en accesorios.','ACTIVE',1,400,0,3,NULL),
('a111','5a07','6f24','2026-03-08','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Farmacia descuento','10% descuento en medicamentos habilitados.','ACTIVE',2,500,0,3,NULL),
('a112','0e38','70ff','2026-03-07','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Panader√≠a artesanal','Promoci√≥n en productos frescos.','ACTIVE',3,220,0,3,NULL),
('a113','ded4','3b90','2026-03-06','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Calzado urbano','30% descuento en zapatillas.','ACTIVE',4,180,0,3,NULL),
('a114','df0d','8467','2026-03-05','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Lavado automotor','Lavado completo promocional.','ACTIVE',1,100,0,3,NULL),
('a116','5a07','d402','2026-03-03','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Comida r√°pida','Combo promocional familiar.','ACTIVE',2,300,0,3,NULL),
('a117','0e38','d657','2026-03-02','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Gimnasio mensual','Plan mensual reducido.','ACTIVE',3,150,0,3,NULL),
('a118','ded4','d71f','2026-03-01','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Excursi√≥n naturaleza','Descuento en salidas guiadas.','ACTIVE',4,100,0,3,NULL),
('a119','df0d','e896','2026-02-28','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Mascotas feliz','Productos para mascotas con descuento.','ACTIVE',1,250,0,3,NULL),
('a121','5a07','0413','2026-02-26','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Accesorios tecnol√≥gicos','Descuento en perif√©ricos.','ACTIVE',2,350,0,3,NULL),
('a122','0e38','c6ed','2026-02-25','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Clases deportivas','Primera clase sin costo.','ACTIVE',3,100,0,3,NULL),
('a123','ded4','0ac5','2026-02-24','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Helader√≠a premium','2x1 en sabores seleccionados.','ACTIVE',4,200,0,3,NULL),
('a124','df0d','07fe','2026-02-23','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Construcci√≥n hogar','Descuento en materiales.','ACTIVE',1,180,0,3,NULL),
('a126','5a07','a3d3','2026-02-21','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Reposter√≠a','Descuento en productos dulces.','ACTIVE',2,150,0,3,NULL),
('a127','0e38','32e9','2026-02-20','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Streaming familiar','Primer mes promocional.','ACTIVE',3,300,0,3,NULL),
('a128','ded4','4e7b','2026-02-19','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Turismo aventura','Actividad con descuento.','ACTIVE',4,120,0,3,NULL),
('a129','df0d','5990','2026-02-18','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Electrohogar','Oferta en electrodom√©sticos.','ACTIVE',1,400,0,3,NULL),
('a131','5a07','6f24','2026-02-16','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Supermercado ahorro','Promoci√≥n semanal.','ACTIVE',2,500,0,3,NULL),
('a132','0e38','70ff','2026-02-15','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Desayuno completo','Combo desayuno promocional.','ACTIVE',3,160,0,3,NULL),
('a133','ded4','3b90','2026-02-14','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Tienda moda','20% descuento en ropa.','ACTIVE',4,220,0,3,NULL),
('a134','df0d','8467','2026-02-13','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Servicio t√©cnico PC','Diagn√≥stico gratuito.','ACTIVE',1,100,0,3,NULL),
('a136','5a07','d402','2026-02-11','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Servicio limpieza','20% descuento.','ACTIVE',2,200,0,3,NULL),
('a137','0e38','d657','2026-02-10','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Cine 3D','Entrada 3D promocional.','ACTIVE',3,250,0,3,NULL),
('a138','ded4','d71f','2026-02-09','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Hotel urbano','Descuento en estad√≠as.','ACTIVE',4,80,0,3,NULL),
('a139','df0d','e896','2026-02-08','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Veterinaria','Consulta inicial promocional.','ACTIVE',1,180,0,3,NULL),
('a141','5a07','0413','2026-02-06','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Descuento librer√≠a','15% de descuento en libros seleccionados.','ACTIVE',2,200,0,3,NULL),
('a142','0e38','c6ed','2026-02-05','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Comida saludable','Men√∫ saludable con descuento.','ACTIVE',3,150,0,3,NULL),
('a143','ded4','0ac5','2026-02-04','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Curso idiomas','Aprende idiomas con precio promocional.','ACTIVE',4,120,0,3,NULL),
('a144','df0d','07fe','2026-02-03','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Decoraci√≥n hogar','Descuento en art√≠culos decorativos.','ACTIVE',1,250,0,3,NULL),
('a146','5a07','a3d3','2026-02-01','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Revisi√≥n vehicular','Chequeo b√°sico sin costo.','ACTIVE',2,100,0,3,NULL),
('a147','0e38','32e9','2026-01-31','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Burger combo','Combo hamburguesa promocional.','ACTIVE',3,400,0,3,NULL),
('a148','ded4','4e7b','2026-01-30','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Viaje escapada','Descuento en escapadas de fin de semana.','ACTIVE',4,90,0,3,NULL),
('a149','df0d','5990','2026-01-29','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Accesorios celulares','Oferta en accesorios m√≥viles.','ACTIVE',1,350,0,3,NULL),
('a151','5a07','6f24','2026-01-27','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Descuento supermercado','Promoci√≥n especial en productos seleccionados.','ACTIVE',2,500,0,3,NULL),
('a152','0e38','70ff','2026-01-26','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Cafeter√≠a premium','Descuento en caf√©s y meriendas.','ACTIVE',1,180,0,3,NULL),
('a153','ded4','3b90','2026-01-25','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Entradas espect√°culo','2 entradas con precio promocional.','ACTIVE',4,220,0,3,NULL),
('a154','df0d','8467','2026-01-24','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Mantenimiento hogar','Servicio con descuento exclusivo.','ACTIVE',3,100,0,3,NULL),
('a156','5a07','d402','2026-01-22','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Combo desayuno','Desayuno completo promocional.','ACTIVE',2,200,0,3,NULL),
('a157','0e38','d657','2026-01-21','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Cine familiar','Entradas familiares con descuento.','ACTIVE',3,350,0,3,NULL),
('a158','ded4','d71f','2026-01-20','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Turismo regional','Paquete tur√≠stico promocional.','ACTIVE',4,120,0,3,NULL),
('a159','df0d','e896','2026-01-19','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Accesorios computaci√≥n','Descuento en perif√©ricos.','ACTIVE',1,400,0,3,NULL),
('a161','5a07','0413','2026-01-17','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Tienda mascotas','Productos seleccionados con descuento.','ACTIVE',2,250,0,3,NULL),
('a162','0e38','c6ed','2026-01-16','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Curso programaci√≥n','Capacitaci√≥n online promocional.','ACTIVE',3,150,0,3,NULL),
('a163','ded4','0ac5','2026-01-15','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Helader√≠a artesanal','Promoci√≥n 2x1 en sabores.','ACTIVE',4,200,0,3,NULL),
('a164','df0d','07fe','2026-01-14','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Servicio limpieza','Descuento en limpieza general.','ACTIVE',1,300,0,3,NULL),
('a166','5a07','a3d3','2026-01-12','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Comida internacional','Men√∫ especial con descuento.','ACTIVE',2,180,0,3,NULL),
('a167','0e38','32e9','2026-01-11','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Gimnasio anual','Plan anual promocional.','ACTIVE',3,120,0,3,NULL),
('a168','ded4','4e7b','2026-01-10','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Hotel ejecutivo','Reserva con descuento.','ACTIVE',4,80,0,3,NULL),
('a169','df0d','5990','2026-01-09','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Tecnolog√≠a hogar','Oferta en dispositivos.','ACTIVE',1,350,0,3,NULL),
('a171','5a07','6f24','2026-01-07','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Farmacia online','Descuento en compras online.','ACTIVE',2,400,0,3,NULL),
('a172','0e38','70ff','2026-01-06','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Panader√≠a diaria','Promoci√≥n en panificados.','ACTIVE',3,200,0,3,NULL),
('a173','ded4','3b90','2026-01-05','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Ropa deportiva','Descuento temporada deportiva.','ACTIVE',4,250,0,3,NULL),
('a174','df0d','8467','2026-01-04','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Taller mec√°nico','Revisi√≥n sin costo.','ACTIVE',1,100,0,3,NULL),
('a176','5a07','d402','2026-01-02','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Pizzer√≠a local','Combo familiar promocional.','ACTIVE',2,300,0,3,NULL),
('a177','0e38','d657','2026-01-01','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Streaming m√∫sica','Primer mes promocional.','ACTIVE',3,200,0,3,NULL),
('a178','ded4','d71f','2025-12-31','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Aventura familiar','Actividad recreativa con descuento.','ACTIVE',4,120,0,3,NULL),
('a179','df0d','e896','2025-12-30','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Veterinaria','Consulta inicial promocional.','ACTIVE',1,180,0,3,NULL),
('a181','5a07','0413','2025-12-28','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Tienda electr√≥nica','Descuento en tecnolog√≠a seleccionada.','ACTIVE',2,350,0,3,NULL),
('a182','0e38','c6ed','2025-12-27','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Desayuno saludable','Combo nutritivo promocional.','ACTIVE',1,200,0,3,NULL),
('a183','ded4','0ac5','2025-12-26','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Teatro local','Entradas con descuento especial.','ACTIVE',4,180,0,3,NULL),
('a184','df0d','07fe','2025-12-25','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Reparaci√≥n hogar','Servicio t√©cnico promocional.','ACTIVE',3,120,0,3,NULL),
('a186','5a07','a3d3','2025-12-23','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Men√∫ ejecutivo','Almuerzo con descuento.','ACTIVE',2,250,0,3,NULL),
('a187','0e38','32e9','2025-12-22','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Cine 2D','Entradas promocionales.','ACTIVE',3,400,0,3,NULL),
('a188','ded4','4e7b','2025-12-21','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Hotel familiar','Alojamiento con descuento.','ACTIVE',4,100,0,3,NULL),
('a189','df0d','5990','2025-12-20','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Computaci√≥n','Descuento en accesorios inform√°ticos.','ACTIVE',1,450,0,3,NULL),
('a191','5a07','6f24','2025-12-18','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Compra supermercado','Beneficio exclusivo semanal.','ACTIVE',2,500,4,3,NULL),
('a192','0e38','70ff','2025-12-17','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Pasteler√≠a artesanal','Descuento en tortas y postres.','ACTIVE',3,220,0,3,NULL),
('a193','ded4','3b90','2025-12-16','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Moda urbana','20% descuento en ropa.','ACTIVE',4,300,0,3,NULL),
('a194','df0d','8467','2025-12-15','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Servicio limpieza auto','Limpieza completa promocional.','ACTIVE',1,90,0,3,NULL),
('a196','5a07','d402','2025-12-13','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Hamburgueser√≠a','Combo especial familiar.','ACTIVE',2,350,0,3,NULL),
('a197','0e38','d657','2025-12-12','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Aplicaci√≥n premium','Mes gratis promocional.','ACTIVE',3,200,0,3,NULL),
('a198','ded4','d71f','2025-12-11','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Turismo aventura','Excursi√≥n con descuento.','ACTIVE',4,150,0,3,NULL),
('a199','df0d','e896','2025-12-10','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Cuidado mascotas','Productos veterinarios promocionales.','ACTIVE',1,250,0,3,NULL),
('a201','5a07','0413','2025-12-08','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Descuento farmacia','Promoci√≥n en productos seleccionados.','ACTIVE',2,400,0,3,NULL),
('a202','0e38','c6ed','2025-12-07','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Caf√© corporativo','Descuento para clientes registrados.','ACTIVE',1,150,0,3,NULL),
('a203','ded4','0ac5','2025-12-06','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Entrada museo','Acceso con beneficio especial.','ACTIVE',4,200,0,3,NULL),
('a204','df0d','07fe','2025-12-05','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Pintura domicilio','Servicio con descuento.','ACTIVE',3,100,0,3,NULL),
('a206','5a07','a3d3','2025-12-03','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Pasta italiana','Men√∫ italiano promocional.','ACTIVE',2,180,0,3,NULL),
('a207','0e38','32e9','2025-12-02','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Entrenamiento fitness','Plan mensual con descuento.','ACTIVE',3,120,0,3,NULL),
('a208','ded4','4e7b','2025-12-01','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Hotel negocios','Alojamiento corporativo promocional.','ACTIVE',4,90,0,3,NULL),
('a209','df0d','5990','2025-11-30','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Reparaci√≥n notebook','Diagn√≥stico gratuito.','ACTIVE',1,300,0,3,NULL),
('a211','5a07','6f24','2025-11-28','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Compra online','Env√≠o gratis en compras.','ACTIVE',2,500,0,3,NULL),
('a212','0e38','70ff','2025-11-27','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Pan dulce','Promoci√≥n de temporada.','ACTIVE',3,200,0,3,NULL),
('a213','ded4','3b90','2025-11-26','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Zapatos casuales','Descuento en calzado.','ACTIVE',4,250,0,3,NULL),
('a214','df0d','8467','2025-11-25','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Mec√°nica r√°pida','Servicio express promocional.','ACTIVE',1,120,0,3,NULL),
('a216','5a07','d402','2025-11-23','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Comida r√°pida','Combo individual promocional.','ACTIVE',2,300,0,3,NULL),
('a217','0e38','d657','2025-11-22','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Servicio streaming','Acceso mensual reducido.','ACTIVE',3,250,0,3,NULL),
('a218','ded4','d71f','2025-11-21','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Excursi√≥n urbana','Recorrido tur√≠stico promocional.','ACTIVE',4,100,0,3,NULL),
('a219','df0d','e896','2025-11-20','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Accesorios mascotas','Descuento en productos animales.','ACTIVE',1,180,0,3,NULL),
('a221','5a07','0413','2025-11-18','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Supermercado plus','Beneficio semanal exclusivo.','ACTIVE',2,450,0,3,NULL),
('a222','0e38','c6ed','2025-11-17','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Pasteler√≠a fina','Descuento en postres.','ACTIVE',3,160,0,3,NULL),
('a223','ded4','0ac5','2025-11-16','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Teatro musical','Entradas promocionales.','ACTIVE',4,200,0,3,NULL),
('a224','df0d','07fe','2025-11-15','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Ferreter√≠a hogar','Descuento en herramientas.','ACTIVE',1,300,0,3,NULL),
('a226','5a07','a3d3','2025-11-13','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Cocina gourmet','Clase culinaria promocional.','ACTIVE',2,120,0,3,NULL),
('a227','0e38','32e9','2025-11-12','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Gimnasio premium','Plan especial de entrenamiento.','ACTIVE',3,100,0,3,NULL),
('a228','ded4','4e7b','2025-11-11','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Hotel vacaciones','Paquete tur√≠stico reducido.','ACTIVE',4,80,0,3,NULL),
('a229','df0d','5990','2025-11-10','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Electr√≥nica hogar','Oferta especial de temporada.','ACTIVE',1,350,0,3,NULL),
('a231','5a07','6f24','2025-11-08','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Farmacia salud','Promoci√≥n exclusiva.','ACTIVE',2,500,0,3,NULL),
('a232','0e38','70ff','2025-11-07','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Desayuno premium','Combo desayuno completo.','ACTIVE',3,180,0,3,NULL),
('a233','ded4','3b90','2025-11-06','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Moda femenina','Descuento en temporada.','ACTIVE',4,220,0,3,NULL),
('a234','df0d','8467','2025-11-05','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Servicio t√©cnico m√≥vil','Reparaci√≥n con descuento.','ACTIVE',1,100,0,3,NULL),
('a236','5a07','d402','2025-11-03','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Pizzer√≠a artesanal','Combo familiar.','ACTIVE',2,250,0,3,NULL),
('a237','0e38','d657','2025-11-02','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Plataforma cursos','Acceso promocional.','ACTIVE',3,200,0,3,NULL),
('a238','ded4','d71f','2025-11-01','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Turismo aventura','Excursi√≥n especial.','ACTIVE',4,120,0,3,NULL),
('a239','df0d','e896','2025-10-31','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Mascotas premium','Accesorios con descuento.','ACTIVE',1,250,0,3,NULL),
('a241','5a07','0413','2025-10-29','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Tienda inform√°tica','Descuento en equipos y accesorios.','ACTIVE',2,350,0,3,NULL),
('a242','0e38','c6ed','2025-10-28','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Cafeter√≠a central','Promoci√≥n en bebidas calientes.','ACTIVE',1,200,0,3,NULL),
('a243','ded4','0ac5','2025-10-27','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Centro cultural','Entrada con descuento.','ACTIVE',4,150,0,3,NULL),
('a244','df0d','07fe','2025-10-26','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Reparaci√≥n electrodom√©sticos','Servicio t√©cnico promocional.','ACTIVE',3,120,0,3,NULL),
('a246','5a07','a3d3','2025-10-24','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Restaurante parrilla','Combo parrilla promocional.','ACTIVE',2,180,0,3,NULL),
('a247','0e38','32e9','2025-10-23','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Entrenamiento funcional','Plan deportivo mensual.','ACTIVE',3,120,0,3,NULL),
('a248','ded4','4e7b','2025-10-22','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Alojamiento rural','Descuento en hospedaje.','ACTIVE',4,90,0,3,NULL),
('a249','df0d','5990','2025-10-21','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Accesorios gamer','Oferta especial gamer.','ACTIVE',1,300,0,3,NULL),
('a251','5a07','6f24','2025-10-19','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Supermercado ahorro','Descuento semanal en productos seleccionados.','ACTIVE',2,500,4,3,NULL),
('a252','0e38','70ff','2025-10-18','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Panader√≠a gourmet','Promoci√≥n en productos artesanales.','ACTIVE',1,180,0,3,NULL),
('a253','ded4','3b90','2025-10-17','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Ropa deportiva','Descuento en indumentaria deportiva.','ACTIVE',4,250,0,3,NULL),
('a254','df0d','8467','2025-10-16','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Servicio automotor','Revisi√≥n preventiva promocional.','ACTIVE',3,100,0,3,NULL),
('a256','5a07','d402','2025-10-14','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Pizzer√≠a familiar','Promoci√≥n familiar especial.','ACTIVE',2,300,0,3,NULL),
('a257','0e38','d657','2025-10-13','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Servicio streaming','Acceso mensual reducido.','ACTIVE',3,200,0,3,NULL),
('a258','ded4','d71f','2025-10-12','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Turismo naturaleza','Excursi√≥n promocional.','ACTIVE',4,120,0,3,NULL),
('a259','df0d','e896','2025-10-11','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Mascotas felices','Productos veterinarios con descuento.','ACTIVE',1,250,0,3,NULL),
('a261','5a07','0413','2025-10-09','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Tecnolog√≠a avanzada','Oferta en dispositivos electr√≥nicos.','ACTIVE',2,350,0,3,NULL),
('a262','0e38','c6ed','2025-10-08','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Desayuno ejecutivo','Combo desayuno promocional.','ACTIVE',1,150,0,3,NULL),
('a263','ded4','0ac5','2025-10-07','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Teatro cl√°sico','Entradas con descuento.','ACTIVE',4,180,0,3,NULL),
('a264','df0d','07fe','2025-10-06','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Mantenimiento t√©cnico','Servicio promocional.','ACTIVE',3,120,0,3,NULL),
('a266','5a07','a3d3','2025-10-04','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Comida internacional','Men√∫ especial promocional.','ACTIVE',2,180,0,3,NULL),
('a267','0e38','32e9','2025-10-03','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Gimnasio completo','Plan mensual reducido.','ACTIVE',3,150,0,3,NULL),
('a268','ded4','4e7b','2025-10-02','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Hotel descanso','Oferta de alojamiento.','ACTIVE',4,80,0,3,NULL),
('a269','df0d','5990','2025-10-01','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Computaci√≥n gamer','Descuento en accesorios gamer.','ACTIVE',1,400,0,3,NULL),
('a271','5a07','6f24','2025-09-29','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Farmacia online','Promoci√≥n exclusiva clientes.','ACTIVE',2,500,0,3,NULL),
('a272','0e38','70ff','2025-09-28','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Pasteler√≠a dulce','Descuento en postres.','ACTIVE',3,200,0,3,NULL),
('a273','ded4','3b90','2025-09-27','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Moda urbana','Promoci√≥n temporada.','ACTIVE',4,300,0,3,NULL),
('a274','df0d','8467','2025-09-26','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','T√©cnico celular','Reparaci√≥n con descuento.','ACTIVE',1,100,0,3,NULL),
('a276','5a07','d402','2025-09-24','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Hamburguesas','Combo promocional.','ACTIVE',2,350,0,3,NULL),
('a277','0e38','d657','2025-09-23','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Cursos online','Acceso mensual promocional.','ACTIVE',3,250,0,3,NULL),
('a278','ded4','d71f','2025-09-22','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Turismo aventura','Descuento en actividades.','ACTIVE',4,120,0,3,NULL),
('a279','df0d','e896','2025-09-21','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Cuidado animal','Promoci√≥n veterinaria.','ACTIVE',1,200,0,3,NULL),
('a281','5a07','0413','2025-09-19','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Electr√≥nica hogar','Oferta especial.','ACTIVE',2,350,0,3,NULL),
('a282','0e38','c6ed','2025-09-18','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Caf√© artesanal','Promoci√≥n bebidas.','ACTIVE',1,180,0,3,NULL),
('a283','ded4','0ac5','2025-09-17','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Centro cultural','Entrada promocional.','ACTIVE',4,220,0,3,NULL),
('a284','df0d','07fe','2025-09-16','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Reformas hogar','Descuento en servicios.','ACTIVE',3,120,0,3,NULL),
('a286','5a07','a3d3','2025-09-14','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Comida saludable','Men√∫ saludable.','ACTIVE',2,150,0,3,NULL),
('a287','0e38','32e9','2025-09-13','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Entrenamiento personal','Sesi√≥n promocional.','ACTIVE',3,100,0,3,NULL),
('a288','ded4','4e7b','2025-09-12','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Alojamiento rural','Reserva con descuento.','ACTIVE',4,80,0,3,NULL),
('a289','df0d','5990','2025-09-11','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Computaci√≥n','Accesorios tecnol√≥gicos.','ACTIVE',1,300,0,3,NULL),
('a291','5a07','6f24','2025-09-09','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Super ahorro','Promoci√≥n semanal.','ACTIVE',2,500,0,3,NULL),
('a292','0e38','70ff','2025-09-08','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Pasteler√≠a premium','Descuento especial.','ACTIVE',3,200,0,3,NULL),
('a293','ded4','3b90','2025-09-07','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Ropa casual','Promoci√≥n de temporada.','ACTIVE',4,300,0,3,NULL),
('a294','df0d','8467','2025-09-06','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Servicio reparaci√≥n','Atenci√≥n promocional.','ACTIVE',1,100,0,3,NULL),
('a296','5a07','d402','2025-09-04','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Pizza familiar','Promoci√≥n especial.','ACTIVE',2,300,0,3,NULL),
('a297','0e38','d657','2025-09-03','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Streaming entretenimiento','Mes promocional.','ACTIVE',3,200,0,3,NULL),
('a298','ded4','d71f','2025-09-02','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Aventura exterior','Actividad con descuento.','ACTIVE',4,120,0,3,NULL),
('a299','df0d','e896','2025-09-01','2026-09-10 00:00:00','2026-09-30 00:00:00','https://enterados.pe/wp-content/uploads/2022/03/entradas-cine-2x1-1-640x360.jpg','Mascotas tienda','Productos promocionales.','ACTIVE',1,250,0,3,NULL),
('A811','a31b','32e9','2026-09-30','2026-09-30 00:00:00','2026-10-08 00:00:00','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Facropolistextil.com.mx%2Fwp-content%2Fuploads%2F2016%2F06%2Ftelas-colores-b%25C3%25A1sicos-suaves.jpg&f=1&nofb=1&ipt=a94652a555865d36025c393655a921c468575c1133e4a1d0204a122dfd79be2b','20% en listones','descuento en listones de todo tipo','ACTIVE',1,20,1,3,2000),
('A9D9','5a07','32e9','2026-10-31','2026-10-31 13:00:00','2026-11-02 00:00:00','https://placehold.co/600x400','test 6','asdasdasd','ACTIVE',1,25,0,3,4500),
('AEE8','a31b','32e9','2026-09-22','2026-09-21 00:00:00','2026-09-30 00:00:00','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Facropolistextil.com.mx%2Fwp-content%2Fuploads%2F2016%2F06%2Ftelas-colores-b%25C3%25A1sicos-suaves.jpg&f=1&nofb=1&ipt=a94652a555865d36025c393655a921c468575c1133e4a1d0204a122dfd79be2b','Telas','telas de raso','INACTIVE',2,20,1,3,NULL),
('B13D','a31b','32e9','2026-09-30','2026-09-30 00:00:00','2026-10-08 00:00:00','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Facropolistextil.com.mx%2Fwp-content%2Fuploads%2F2016%2F06%2Ftelas-colores-b%25C3%25A1sicos-suaves.jpg&f=1&nofb=1&ipt=a94652a555865d36025c393655a921c468575c1133e4a1d0204a122dfd79be2b','20% en listones','descuento en todo tipo de listones','INACTIVE',1,20,1,3,2000),
('C28D','5a07','07fe','2026-10-31','2026-10-31 00:00:00','2026-11-03 00:00:00','https://randomapi.dev/api/images/placeholder?text=test&bg=151532','test','hola','ACTIVE',1,50,0,2,3500),
('c94c','5a07','e896','2026-06-26','2026-09-10 00:00:00','2026-09-30 00:00:00','https://4.bp.blogspot.com/-PdR6Ign30Kc/TyDm-jSvNJI/AAAAAAAAvDg/XW5BPDvUPBw/s1600/sweet-dessert-1920x1200-delicioso-postre-dulce.jpg','Postre gratis','Postre gratis con men√∫ completo.','ACTIVE',3,200,3,3,NULL),
('D9F6','5a07','a3d3','2026-10-29','2026-10-29 00:00:00','2026-11-04 00:00:00','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.jardineriaon.com%2Fwp-content%2Fuploads%2F2024%2F02%2Fcultivos-para-marzo-lechuga.jpg&f=1&nofb=1&ipt=e4d4e2458d7c0c24ef8d34613050812f53830c6b345e74d7247f1b1f03674b6a&ipo=images','20% en lechuga','20% de descuento en la lechuga de estaci√≥n','ACTIVE',1,20,3,3,5000),
('F041','a31b','d657','2026-09-10','2026-09-20 00:00:00','2026-09-30 00:00:00','https://placehold.co/600x400?text=testBenefit','testBenefit','hola',NULL,2,100,0,3,NULL),
('F982','ded4','32e9','2026-10-07','2026-10-07 00:00:00','2026-10-28 00:00:00','https://placehold.co/600x400?text=20% en telas','20% en telas','unicamente en telas de color verde','INACTIVE',1,20,0,2,NULL);
/*!40000 ALTER TABLE `Benefits` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Categories`
--

DROP TABLE IF EXISTS `Categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Categories` (
  `id_category` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `icon_url` varchar(255) NOT NULL,
  `active` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_category`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Categories`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Categories` WRITE;
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */;
INSERT INTO `Categories` VALUES
(2,'Gastronom√≠a','UtensilsCrossed',0),
(3,'Tecnolog√≠a','Cpu',1),
(4,'Salud','Hospital',1),
(5,'Educaci√≥n','GraduationCap',1),
(6,'Construcci√≥n','BrickWall',1),
(7,'Automotriz','Car',1),
(8,'Belleza y Est√©tica','Sparkles',1),
(9,'Turismo','MapPlus',1),
(10,'Inmobiliaria','House',1),
(11,'Finanzas','CircleDollarSign',1),
(12,'Deportes','Dumbbell',1),
(13,'Moda y Accesorios','Shirt',1),
(14,'Mascotas','PawPrint',1),
(15,'Hogar y Decoraci√≥n','PaintbrushVertical',1),
(16,'Transporte y Log√≠stica','Truck',1),
(17,'Entretenimiento','Film',1),
(18,'Servicios Profesionales','Toolbox',1),
(19,'Agricultura y Ganader√≠a','Tractor',1),
(20,'Industria y Manufactura','Factory',1),
(21,'Comercio Minorista','ShoppingBasket',1);
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Directions`
--

DROP TABLE IF EXISTS `Directions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Directions` (
  `id_direction` int(11) NOT NULL AUTO_INCREMENT,
  `id_partner` varchar(4) DEFAULT NULL,
  `direction` varchar(255) NOT NULL,
  PRIMARY KEY (`id_direction`),
  KEY `id_partner` (`id_partner`),
  CONSTRAINT `Directions_ibfk_1` FOREIGN KEY (`id_partner`) REFERENCES `Partners` (`id_partner`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Directions`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Directions` WRITE;
/*!40000 ALTER TABLE `Directions` DISABLE KEYS */;
INSERT INTO `Directions` VALUES
(1,'32e9','URQUIZA 257 SUR, X5186, Alta Gracia, Santa Maria, C√≥rdoba');
/*!40000 ALTER TABLE `Directions` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Employees`
--

DROP TABLE IF EXISTS `Employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Employees` (
  `id_partner` varchar(4) NOT NULL,
  `id_user` varchar(4) NOT NULL,
  PRIMARY KEY (`id_partner`,`id_user`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `Employees_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `Users` (`id_user`),
  CONSTRAINT `Employees_ibfk_2` FOREIGN KEY (`id_partner`) REFERENCES `Partners` (`id_partner`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Employees`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Employees` WRITE;
/*!40000 ALTER TABLE `Employees` DISABLE KEYS */;
INSERT INTO `Employees` VALUES
('07fe','0070'),
('32e9','0070'),
('32e9','2B36'),
('32e9','BE89');
/*!40000 ALTER TABLE `Employees` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Partners`
--

DROP TABLE IF EXISTS `Partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Partners` (
  `id_partner` varchar(4) NOT NULL,
  `name` varchar(50) NOT NULL,
  `logo` varchar(2048) DEFAULT NULL,
  `active` tinyint(4) NOT NULL DEFAULT 1,
  `id_owner` varchar(4) DEFAULT NULL,
  PRIMARY KEY (`id_partner`),
  KEY `id_owner_fk` (`id_owner`),
  CONSTRAINT `id_owner_fk` FOREIGN KEY (`id_owner`) REFERENCES `Users` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Partners`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Partners` WRITE;
/*!40000 ALTER TABLE `Partners` DISABLE KEYS */;
INSERT INTO `Partners` VALUES
('0413','Cine Plus','https://cdn.pixabay.com/photo/2022/07/17/19/22/movie-7328179_1280.png',1,'5a07'),
('07fe','Fit Gym','https://static.vecteezy.com/system/resources/previews/011/162/388/original/fitness-sport-gym-logo-design-vector.jpg',1,'ded4'),
('0ac5','R√≠o de La Plata SA','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flookaside.fbsbx.com%2Flookaside%2Fcrawler%2Fmedia%2F%3Fmedia_id%3D100066987870796&f=1&nofb=1&ipt=fe7814c8ac31280f24b1b520206d420c8271cb712ff9e78086ea3da94ec076ac',1,'5a07'),
('1a3d','Innovar Solutions','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.k-wlpSEWv1KvzmxCqNXzSgAAAA%3Fpid%3DApi&f=1&ipt=2d42d39d28a3fe988d1e561fc968ef7e6c1490eed478148e349b39312ed3a7f5',1,'a31b'),
('32e9','mercer√≠a la mereced','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flookaside.fbsbx.com%2Flookaside%2Fcrawler%2Fmedia%2F%3Fmedia_id%3D100063962113780&f=1&nofb=1&ipt=0be71307a007aef85364d42f3361a5ef888a13ad1b944551a05e57506fdd4ba5',1,'a31b'),
('3b90','Comercial Sur','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-vector%2Fecommerce-logo-design_624194-144.jpg&f=1&nofb=1&ipt=8a4791d6322d060c223b2261f61a1bdf1d5ddb9881c09a27cb9ab0ce463b1da7',1,'ded4'),
('4e7b','Distribuidora Norte','https://www.freepik.es/fotos-vectores-gratis/logo-distribuidora',1,'5a07'),
('5990','Nova Systems','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fres.cloudinary.com%2Fdrxlhqaql%2Fimage%2Fupload%2Fv1676955537%2Fsite_data%2Fwww.k39consulting.com%2F20230221_155853_c2c61960_novasystems-logo_2x.png&f=1&nofb=1&ipt=edc46471f102d97de864d6b22c525da',1,'a31b'),
('60a5','Vision Digital','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthumbs.dreamstime.com%2Fb%2Fvision-eye-arrows-logo-template-design-398126631.jpg&f=1&nofb=1&ipt=52a9d6870bdafc894757d82244a86b643137ea99c0bd449cafce44e2fd44a161.png',1,'5a07'),
('6f24','Global Services','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwbglobalservices.com%2Fwp-content%2Fuploads%2F2025%2F07%2FWB-Global-Services-Official-Logo.png&f=1&nofb=1&ipt=6499e9b2d76a0e35217958d1cf9d5f92190933877b3ac7748addfdc6369b6252',0,'df0d'),
('70ff','Alpha Group','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.shutterstock.com%2Fimage-vector%2Falpha-group-letter-ag-logo-600nw-1848317209.jpg&f=1&nofb=1&ipt=339e49ea3082b26f5a0bd2f47ea3795c7804f3535b6554e747940e440aa7b9e7',1,'a31b'),
('8467','Gamma Retail','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F28%2F6e%2Fd1%2F286ed1c61132d80b2121db757465d225.png&f=1&nofb=1&ipt=08978c3961ef81ab4838ba360f8bec7b9555a652edddbc789c114c18e9270d06',1,'5a07'),
('954e','Horizonte SRL','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.licdn.com%2Fdms%2Fimage%2Fv2%2FC4D0BAQFVJ6tg7Ai6Hg%2Fcompany-logo_200_200%2Fcompany-logo_200_200%2F0%2F1630523404614%2Fconstrucciones_horizonte_srl_logo%3Fe%3D2147483647%26v%3Dbeta%26t%3DHu',0,'df0d'),
('a3d3','Fresh Market','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fplay-lh.googleusercontent.com%2FhPzmC8Ul3CEQFJHuC4CKchjR4AR1yxYKcS22ce9cNtswtSVkmDMd_3yT4Yni8SNZFbs0&f=1&nofb=1&ipt=ddca180a51b6795a9bc8656505b3819e952007447d4b6132a9e63ecd3c10d7fb',1,'0e38'),
('c6ed','Omega Foods','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flookaside.fbsbx.com%2Flookaside%2Fcrawler%2Fmedia%2F%3Fmedia_id%3D100092377241141&f=1&nofb=1&ipt=eb9aabfd2927159beb7ba0f38902e191290747e0d7996ad167cdfa86e52b9ac4',1,'df0d'),
('d402','Central Motors','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcentralmotorsnqn.com.ar%2Fassets%2Fexceso.png&f=1&nofb=1&ipt=46f5c335d452701e7d7bf71c53878517be82df86395bb575e6a87349e9d9501d',0,'df0d'),
('d657','Andes Corp','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flookaside.fbsbx.com%2Flookaside%2Fcrawler%2Fmedia%2F%3Fmedia_id%3D100057880500384&f=1&nofb=1&ipt=3699dcbda9325bf8898f4b0bd5b531cb1191887f5c47b36aeaf0fc3c9f8464c1',1,'0e38'),
('d71f','Tech Solutions','https://www.vecteezy.com/vector-art/53257215-abstract-neural-connect-network-technology-digital-modern-solution-logo-design-illustration',1,'0e38'),
('e896','Burger House','https://static.vecteezy.com/system/resources/previews/011/293/595/non_2x/burger-house-logo-design-free-vector.jpg',1,'df0d'),
('e93a','Beta Logistics','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flookaside.fbsbx.com%2Flookaside%2Fcrawler%2Fmedia%2F%3Fmedia_id%3D615285247484774&f=1&nofb=1&ipt=90093253a61010fc053fb748280a59046fca380534c851b5a9379b2df4f7947f',1,'0e38'),
('eaaf','Green Agro','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-vector%2Fgreen-agro-farm-logo-art_658271-1545.jpg%3Fw%3D2000&f=1&nofb=1&ipt=8770f0adcbf8f46114bc1ac2be774b033e7f68fc9e3dab8e40802acc545ccfba',1,'ded4'),
('eca6','Delta Energy','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.hr49kT9EmAGBlllfry50EgHaHO%3Fpid%3DApi&f=1&ipt=6bac4366bcd4a0905ee6561aab4eb934f36ec6bb39ce9a8ad77780b7b2dc4713',0,'ded4'),
('ef9e','Patagonia Tech','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fbrandlogos.net%2Fwp-content%2Fuploads%2F2023%2F08%2Fpatagonia-logo_brandlogos.net_lbjcm-512x512.png&f=1&nofb=1&ipt=11cffba5833d36692e93ecf0403ce106cd59e1b84500f6d61c0736baf66e01a8',1,'ded4');
/*!40000 ALTER TABLE `Partners` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Partners_Admins`
--

DROP TABLE IF EXISTS `Partners_Admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Partners_Admins` (
  `id_account` varchar(4) NOT NULL,
  `id_partner` varchar(4) NOT NULL,
  PRIMARY KEY (`id_account`,`id_partner`),
  KEY `FK_dc285106d5fcee21e1338908db1` (`id_partner`),
  CONSTRAINT `FK_b43cdde5e6118c5bae9670806a5` FOREIGN KEY (`id_account`) REFERENCES `Accounts` (`id_account`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_dc285106d5fcee21e1338908db1` FOREIGN KEY (`id_partner`) REFERENCES `Partners` (`id_partner`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Partners_Admins`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Partners_Admins` WRITE;
/*!40000 ALTER TABLE `Partners_Admins` DISABLE KEYS */;
INSERT INTO `Partners_Admins` VALUES
('0e38','0413'),
('ded4','0413'),
('0070','32e9'),
('ded4','32e9'),
('df0d','e896');
/*!40000 ALTER TABLE `Partners_Admins` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Partners_Categories`
--

DROP TABLE IF EXISTS `Partners_Categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Partners_Categories` (
  `id_partner` varchar(4) NOT NULL,
  `id_category` int(11) NOT NULL,
  PRIMARY KEY (`id_partner`,`id_category`),
  KEY `FK_feb99400dd667ee0d4eb6918487` (`id_category`),
  CONSTRAINT `FK_7e2fb3a7071b5ee263a93592190` FOREIGN KEY (`id_partner`) REFERENCES `Partners` (`id_partner`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_feb99400dd667ee0d4eb6918487` FOREIGN KEY (`id_category`) REFERENCES `Categories` (`id_category`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Partners_Categories`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Partners_Categories` WRITE;
/*!40000 ALTER TABLE `Partners_Categories` DISABLE KEYS */;
INSERT INTO `Partners_Categories` VALUES
('a3d3',2),
('c6ed',2),
('e896',2),
('1a3d',3),
('32e9',3),
('5990',3),
('60a5',3),
('d71f',3),
('ef9e',3),
('07fe',4),
('32e9',6),
('d402',7),
('70ff',11),
('07fe',12),
('4e7b',16),
('e93a',16),
('0413',17),
('60a5',17),
('0ac5',18),
('1a3d',18),
('6f24',18),
('70ff',18),
('954e',18),
('d657',18),
('d71f',18),
('eca6',18),
('ef9e',18),
('eaaf',19),
('0ac5',20),
('d657',20),
('eca6',20),
('3b90',21),
('4e7b',21),
('8467',21),
('a3d3',21),
('c6ed',21);
/*!40000 ALTER TABLE `Partners_Categories` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `PaymentMethods`
--

DROP TABLE IF EXISTS `PaymentMethods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `PaymentMethods` (
  `id_payment_method` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `active` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_payment_method`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PaymentMethods`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `PaymentMethods` WRITE;
/*!40000 ALTER TABLE `PaymentMethods` DISABLE KEYS */;
INSERT INTO `PaymentMethods` VALUES
(1,'Cr√©dito',1),
(2,'Efectivo',1),
(3,'D√©bito',1),
(4,'Transferencia',1),
(5,'Mercado Pago',1);
/*!40000 ALTER TABLE `PaymentMethods` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `PaymentMethods_Benefits`
--

DROP TABLE IF EXISTS `PaymentMethods_Benefits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `PaymentMethods_Benefits` (
  `id_payment_method` int(11) NOT NULL,
  `id_benefit` varchar(4) NOT NULL,
  PRIMARY KEY (`id_payment_method`,`id_benefit`),
  KEY `FK_fde159496e03a8c7dc3501b22f3` (`id_benefit`),
  CONSTRAINT `FK_1020856c55a0eabf5757f6f60b0` FOREIGN KEY (`id_payment_method`) REFERENCES `PaymentMethods` (`id_payment_method`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_fde159496e03a8c7dc3501b22f3` FOREIGN KEY (`id_benefit`) REFERENCES `Benefits` (`id_benefit`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PaymentMethods_Benefits`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `PaymentMethods_Benefits` WRITE;
/*!40000 ALTER TABLE `PaymentMethods_Benefits` DISABLE KEYS */;
INSERT INTO `PaymentMethods_Benefits` VALUES
(3,'171A'),
(5,'171A'),
(1,'1e65'),
(2,'1e65'),
(2,'1F73'),
(4,'1F73'),
(5,'1F73'),
(2,'2FE7'),
(4,'2FE7'),
(5,'2FE7'),
(5,'35D2'),
(2,'3B15'),
(4,'3B15'),
(5,'3B15'),
(1,'3ff0'),
(4,'3ff0'),
(2,'5C71'),
(3,'5C71'),
(5,'5C71'),
(1,'5ec1'),
(2,'5ec1'),
(3,'5ec1'),
(1,'64C0'),
(3,'64C0'),
(5,'64C0'),
(4,'6614'),
(5,'6614'),
(2,'685A'),
(3,'685A'),
(5,'685A'),
(2,'797B'),
(4,'797B'),
(1,'880A'),
(2,'880A'),
(4,'880A'),
(2,'8E79'),
(4,'8E79'),
(5,'8E79'),
(2,'97EC'),
(4,'97EC'),
(5,'97EC'),
(2,'A811'),
(4,'A811'),
(5,'A811'),
(4,'A9D9'),
(5,'A9D9'),
(1,'AEE8'),
(2,'AEE8'),
(2,'B13D'),
(4,'B13D'),
(5,'B13D'),
(1,'C28D'),
(2,'C28D'),
(4,'C28D'),
(5,'c94c'),
(2,'D9F6'),
(4,'D9F6'),
(5,'D9F6'),
(2,'F041'),
(3,'F041'),
(4,'F041'),
(2,'F982'),
(4,'F982'),
(5,'F982');
/*!40000 ALTER TABLE `PaymentMethods_Benefits` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `RefreshTokens`
--

DROP TABLE IF EXISTS `RefreshTokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `RefreshTokens` (
  `token_hash` binary(32) NOT NULL,
  `expires_at` datetime NOT NULL,
  `revoked` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `email` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`token_hash`),
  KEY `IDX_a8902d4754e89411bbc04a9774` (`token_hash`),
  KEY `refresh_token_idx` (`token_hash`),
  KEY `refresh_email_idx` (`email`),
  CONSTRAINT `refresh_account_fk` FOREIGN KEY (`email`) REFERENCES `Accounts` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RefreshTokens`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `RefreshTokens` WRITE;
/*!40000 ALTER TABLE `RefreshTokens` DISABLE KEYS */;
INSERT INTO `RefreshTokens` VALUES
('âG∂‘ü{ÊëCÖQ.∞™®Ï/Ì\r‰ í`-o\0º#','2026-10-07 09:20:13',0,'2026-10-07 09:03:47.467177','carlos@partner.com'),
('5i\Z=◊ˇZ,˜´ê%¨VLıÍ	~Ü{m(/1>ë—û','2026-09-30 12:45:06',0,'2026-09-30 12:44:05.876821','testadmin@cecit.com'),
(',∫xK‡≥+O˜àÕ≥ˆﬂKfìÂˆMlO⁄™Û\'\\','2026-11-03 16:16:55',0,'2026-11-02 07:51:44.276316','admin@socios.com'),
('XÄjˆMl¿Ê°?ÖÍÇÈk∫fâBi»‹≈ØeÕD»’','2026-10-07 16:02:25',0,'2026-10-07 16:01:21.719716','carlos@partner.com'),
('ƒJÕ(\Z–√á2\0À~∂˙›™}ÉÊ#s§‰D_∂ƒ˝·','2026-11-09 11:45:05',0,'2026-11-02 08:45:05.975971','carlos@partner.com'),
('ôM.√˝ ∞QÏrãÉ∫$?4‡hdGﬂèÈ¨gÇÔ','2026-09-28 08:45:53',0,'2026-09-28 08:36:46.959113','testadmin@cecit.com'),
('zläq∏	¢/S\">RµÜy∞…˜|ÓMËÜ∂E‡ËÁ','2026-10-07 15:08:25',0,'2026-10-07 15:07:23.215298','carlos@partner.com'),
('‘˝\Z“/ûéy˙¿%àö¡ßT‹Éπfp¿yÌs≤»','2026-10-13 09:42:21',0,'2026-10-13 09:41:19.349251','carlos@partner.com'),
('ÒJœ+¸ {˙\Zµî8À˝Z,&Zÿ√kÑˇöVC•È','2026-10-28 09:45:25',0,'2026-10-21 09:45:25.209450','carlos@partner.com'),
('-πpÑE∑`f¥>ú^,\r•0‡TD9rp+E-µ0¿','2026-11-04 13:42:36',0,'2026-10-28 10:42:36.647564','carlos@partner.com'),
('¸äµ“ÀÁ<HÖ˘Ü4B:SÒ\' Ë‡vÆ<ÕA4·Éµ','2026-10-31 19:31:54',0,'2026-10-31 16:28:23.468979','admin@socios.com'),
('(Wkp2:ë”π6ê.ˆïÕSÃBjôz ç‰]klŒû','2026-10-07 10:34:51',0,'2026-10-07 10:33:51.748772','agustin@gmail.com'),
('∫Ær$ÂÉ_NÃF´ã	Áb]≤7Î∆AŒŒ≤µ?¿ü','2026-09-30 12:02:39',0,'2026-09-30 12:00:44.466569','tous@gmail.com'),
('„u≤÷£cbM∞Wh”ß√Çu“$˝}r} (ra','2026-10-07 10:34:20',0,'2026-10-07 10:33:20.135437','agustin@gmail.com'),
('ÛˇèA⁄.,i›“~a, uÆbo™‰4´','2026-10-31 18:56:18',0,'2026-10-31 15:51:23.011823','admin@socios.com'),
('ÌÖ⁄92©x◊â-¸éÔ»–$¢õr¿}N','2026-10-31 15:28:44',0,'2026-10-31 15:24:37.987091','admin@socios.com'),
('*^Iã—kYò)Ó¬¢å«ŸAU[Íç?	cJà€êƒ˙','2026-10-31 15:04:37',0,'2026-10-31 15:01:31.798093','admin@socios.com'),
('\" ’‡PÂo\0‘$sÆrßA∆sÌÍökK{rWBûz','2026-10-07 09:48:25',0,'2026-10-07 09:47:14.696725','carlos@partner.com'),
('#∆˝”f≤Yπˆ0 tsv5ÚÙ≈ÑX[˜xt7j\Zœ4','2026-09-30 11:52:31',0,'2026-09-30 11:51:30.597676','testadmin@cecit.com'),
('#¸:~¸¨˛E.∏ìúbõÔYt¡$ÔÍŸAâÂ˜¿','2026-11-09 12:28:32',0,'2026-11-02 09:28:32.585356','carlos@partner.com'),
('$Qn-¸}Uóó<y¢ìO.Ç\nR&}[{‚êp∏M±','2026-10-07 10:23:46',0,'2026-10-07 10:10:59.265679','lupianezfedericoignacio@gmail.com'),
('$¥º1_cP$ouj≠UDyÑ~_!Çdﬁ≠»Iˆ Ò‘','2026-10-31 19:29:20',0,'2026-10-31 16:25:21.697514','admin@socios.com'),
('$…pi◊∑<ÒHÏK∏$íBC/	*‡.HaÏ£Ùx¬˜','2026-10-31 15:13:01',0,'2026-10-31 15:10:46.672426','admin@socios.com'),
('%N[ËØ¸;>H…ÛÕûà\"ÜSj¸]·›u}Õ¿5ò≥b','2026-09-28 08:02:23',0,'2026-09-28 08:01:22.794746','testadmin@cecit.com'),
('\'ÿ2∫MÃ’ä¡]≥Æ◊ocã€;)ÛÂGÜí‡\0','2026-09-30 12:03:32',0,'2026-09-30 12:02:31.992938','testadmin@cecit.com'),
('/D˜ŒL–ËπQ˝ìõ˘û≥lª˙Ñ {8ÖÌ-Ö∂I7\0','2026-11-04 13:23:32',0,'2026-10-28 10:23:32.726498','carlos@partner.com'),
('/êa^Æ1–g^‚JπkÅB§◊R~•H+ˇ1ﬁ∆Jú‡Á','2026-10-07 10:11:17',0,'2026-10-07 09:56:01.853796','carlos@partner.com'),
('1T≤Àe‚\n/˘O_Hî—(àÁhå^s¸§QΩº≈','2026-10-21 09:46:25',0,'2026-10-21 09:45:24.835352','carlos@partner.com'),
('2ß9¸ı_´¸{.;LS´&P⁄\"\"ßñOŸ±%ã€¿','2026-09-30 12:25:49',0,'2026-09-30 12:24:04.070669','testadmin@cecit.com'),
('6V°â‚¬|·¶P\\f1úm\'UªEVE¥Â˙¿ˇ','2026-10-05 17:28:40',0,'2026-10-05 17:27:37.317010','testadmin@cecit.com'),
('9¥˜?JµB6^7QÛ©ˇ¨ZÇ◊¡é@ÍK#Ì§≤ä','2026-10-31 18:52:20',0,'2026-10-31 15:43:57.554493','admin@socios.com'),
(';Êõ+˛ªY;„ˇq†YrÈÊ—{?˛?µ	A“àPU4','2026-10-07 10:25:29',0,'2026-10-07 10:24:29.253296','carlos@partner.com'),
('=˚≈π58f[Ïê´∂⁄ﬁ6q√≈\0ìã2∏˜˙ﬂ*.´¯+','2026-10-07 15:40:31',0,'2026-10-07 15:38:49.124343','testadmin@cecit.com'),
('?I*–+„OÜØ≠’mxº†bœÁÖ˘K«jŸµÉ´ÓÒ','2026-09-28 08:37:46',0,'2026-09-28 08:09:25.412505','testadmin@cecit.com'),
('?å˚g5´5›:¯DºÕÇ\Z\':{ÔõO;€Ú∏†=œÃØ','2026-10-21 09:57:19',0,'2026-10-21 09:28:11.389940','carlos@partner.com'),
('?´q3 ”A∞5A;ÛöÎVw¨Ê\'⁄©}\'Cg:','2026-09-28 08:01:20',0,'2026-09-28 08:00:20.305679','testadmin@cecit.com'),
('?ÃMlÙß…|‡IüVUÔ	jé‡ûLVΩt≥hÍt˘ŸŒ','2026-11-03 19:49:14',0,'2026-11-03 13:15:55.850993','admin@socios.com'),
('A\rÌrn9f}NﬂËOchÈ∆µ?C†Íú¶úõ','2026-09-30 11:56:08',0,'2026-09-30 11:54:34.973170','tous@gmail.com'),
('Hø‡úÆ\nΩ0hﬂ8∆ó≠Èªﬁ≠F4k:2/Ÿ','2026-11-10 14:44:48',0,'2026-11-03 11:44:48.614441','carlos@partner.com'),
('IoZwY ¨~ˆü#«dãÈÇ\"2Ë≠Ó¡=◊\\w\Z8„P','2026-10-31 15:09:48',0,'2026-10-31 15:08:45.850927','admin@socios.com'),
('MoÅˇÚk∞ÒqÁµé*.Ø\"Ü<≈nÅÿsÉ‰=\ZS¶»U–','2026-11-05 19:25:03',0,'2026-11-03 11:55:19.788549','carlos@partner.com'),
('Oû®,ëX˘$Õ˘ﬁ ´B=≥LÌΩ˝\"ﬂ4õA<P','2026-11-10 21:17:50',0,'2026-11-03 18:17:50.666560','admin@socios.com'),
('O≤¥µU*¬vŒ. ‡˛‚V∏\r≥üwﬁªkê<Û','2026-10-31 14:52:32',0,'2026-10-31 14:47:41.456274','admin@socios.com'),
('TsÔE¢8tâ4ÍwŒDÚå∫ﬁ®k}YLå”®R∂\r¥|','2026-10-29 12:24:35',0,'2026-10-29 11:34:06.956170','admin@socios.com'),
('VSSƒæB{ñº…wº≤ÀLcÅ=<Iü®˜∑u≤«-‹','2026-10-07 11:31:41',0,'2026-10-07 10:34:20.368623','carlos@partner.com'),
('Wö=ƒ’≤ëÀ Ì`Ïµ◊6;4=ùeXÎ\0I','2026-10-07 15:24:25',0,'2026-10-07 15:20:11.005693','testadmin@cecit.com'),
('WõÈÔ=&qd!3O1∆eæñ[PfÚb.z˝ﬂO','2026-11-09 11:34:10',0,'2026-11-02 08:34:10.824047','carlos@partner.com'),
('X»∂nPÁõ0UKZëìÒHÉTj§¥,<ıª8	B¥ÖÙ†','2026-11-04 13:03:46',0,'2026-10-28 10:03:47.062964','carlos@partner.com'),
('[+⁄π.2öLdUªRñ:È÷<¸ıò>àQ{ƒ_ö','2026-10-07 09:57:01',0,'2026-10-07 09:47:25.319327','carlos@partner.com'),
('\\Û\nI\Zz]ì∆`m¶˛Áò2[ˇ‘øΩÓ2VÕ›ÀJ','2026-10-07 09:48:14',0,'2026-10-07 09:47:14.096686','carlos@partner.com'),
('\\òn∞ƒ‡¿¯›[x˙µ;ˆ€p1ÌAÁù	ÇØÉ¢pnö™','2026-11-03 21:18:47',0,'2026-11-03 17:35:00.743009','admin@socios.com'),
('^@,Ü˜ ìÇ∂®aåÓóÉ~¸À¨\\äƒì›zŒ˚c','2026-09-28 08:58:56',0,'2026-09-28 08:44:54.171988','testadmin@cecit.com'),
('^Û≠aß±ìS#Ÿ◊Fe≤ºm°rŸ¥ó<ú—≠v^¯xß◊','2026-10-07 16:06:27',0,'2026-10-07 16:03:05.149511','testadmin@cecit.com'),
('_!¿ºÏw¬˚ûÍ	≤—&ò\Z¶·}ÉÕﬂÆ\'ôwìªﬁ8\n','2026-10-31 15:11:44',0,'2026-10-31 15:08:51.365575','admin@socios.com'),
('_†ƒ–≤≥‘∞∆\0jàNh±ä\n⁄øÑÃ≥jØîΩ¨','2026-10-31 14:43:23',0,'2026-10-31 14:36:20.112478','admin@socios.com'),
('_∆“-¶Y@ëy_Xqq7X¢=Ôê^o´∂∫9TÈ','2026-09-30 12:06:22',0,'2026-09-30 12:05:21.617467','carlos@partner.com'),
('`2˙1‰ıcËd·/†Ï√ﬁYE¸e:À∞.H≤û˘','2026-09-28 09:01:15',0,'2026-09-28 08:57:56.774126','testadmin@cecit.com'),
('bà‹Ö?r»‡vºlk{√.‘ú∑À√?˚G÷z; ÒX','2026-10-28 09:56:28',0,'2026-10-21 09:56:28.866958','carlos@partner.com'),
('có∂f(Päw≈\0AÈ?îÇMÒâ¯ˇAñÌ‡‡ì…¬','2026-11-09 12:25:05',0,'2026-11-02 09:25:06.197817','carlos@partner.com'),
('c¯⁄Üê6<ˆ’-ÃòÇ:Oeµ	H±˙·Ø\'QÜÀ√˛g','2026-09-30 11:52:42',0,'2026-09-30 11:51:31.373401','testadmin@cecit.com'),
('e\r•\\WÚ≥t«3Ù@∫søt£¡t¢ˆõØ;bPE\n','2026-10-07 10:27:32',0,'2026-10-07 10:24:29.661836','carlos@partner.com'),
('jâ*Ë·”Ñ/™∏h>|‹}\nl`.ÇŸud<	E','2026-10-28 09:42:56',0,'2026-10-21 09:42:56.612814','carlos@partner.com'),
('k”…XÍx/¯ù€·{∫ìÓ\nÉû◊ªBuW:¯õ¥','2026-10-29 09:51:23',0,'2026-10-29 09:50:22.769509','admin@socios.com'),
('n©†◊CGí\\ô+-@x\0,ª ”ò˝CË}?ﬁ¢','2026-10-31 18:44:54',0,'2026-10-31 15:27:46.887620','admin@socios.com'),
('qD·ú∆t£ÈﬂâÇ€¢+Û\n¡ì%n‚^Ìuò','2026-09-30 12:15:16',0,'2026-09-30 12:05:22.619135','carlos@partner.com'),
('r3x√©q£ÿÁx˙≤Û˛[∑GëÜÓÄéôûmÆê>ı','2026-10-07 09:47:41',0,'2026-10-07 09:46:40.322620','lupianezfedericoignacio@gmail.com'),
('rDm?Û§≤„‡}[≤%6Ö{†ì{«‡P«¡N;9≠ﬁz','2026-09-26 20:55:47',0,'2026-09-26 20:54:39.513901','testadmin@cecit.com'),
('rv+Áƒk£∞ô¢·÷gHÒ©`&˚‚p\"Œ∑IÉ	\Z','2026-09-30 12:01:44',0,'2026-09-30 11:55:08.490910','tous@gmail.com'),
('t•ü+á“µV≤Sˆ)˙¸=\nu∆∫ˆw¶D⁄∏È{G–','2026-09-28 09:06:37',0,'2026-09-28 09:05:36.988140','testadmin@cecit.com'),
('|pjØ{ΩaπÓ|ûîúó≥AÜéîW‰`†ı&ÁfÑ','2026-10-07 15:49:31',0,'2026-10-07 15:44:52.009641','testadmin@cecit.com'),
('}⁄∏f\\‚,\rÒf!3 GÏüJìÍn◊≥‹ÅX™≤G','2026-10-07 15:21:08',0,'2026-10-07 15:20:05.561500','testadmin@cecit.com'),
('~uñ∑y⁄¸_û”	fÏ?ΩQ/â\nQQA[=Õ/æIoøß','2026-11-09 12:26:13',0,'2026-11-02 09:26:13.987804','carlos@partner.com'),
('~ïq9€©Ú∫ Ökîo›¯I¢ñT,P£G_}R\Z[ˇ','2026-10-07 09:41:34',0,'2026-10-07 09:20:48.086268','carlos@partner.com'),
('Å/»8U>ân–DüÎ{¯\ZNŸﬁºkênSﬂ^ó:} ','2026-09-30 12:05:21',0,'2026-09-30 12:04:21.095379','tous@gmail.com'),
('ÉÄoe∏ËòcÂ•);us†≠*∂p•=vm@∂€Å‰','2026-10-07 15:07:57',0,'2026-10-07 11:31:02.844117','testadmin@cecit.com'),
('ã/Ø|úF˘ö	Æ«-Í˝É·íŒ≤47≤ô˝i7','2026-09-28 09:01:26',0,'2026-09-28 09:00:15.979217','testadmin@cecit.com'),
('åØ^˘0[ èD˚öb\Zû!`∫ü„JÕT{cLû$','2026-11-09 11:36:25',0,'2026-11-02 08:36:26.068199','carlos@partner.com'),
('éæbuÕ\\h∂ˆf{q˚\ZSdw\' ‚«•mË6¡b','2026-09-26 21:00:56',0,'2026-09-26 20:55:02.438728','testadmin@cecit.com'),
('è©6Íıgí©”∏Ú2ª/ßÁÓ™¢ˆ≈>ç∫∞≤ˇi⁄','2026-10-31 19:06:06',0,'2026-10-31 15:55:20.780213','admin@socios.com'),
('ê5—ÀÇfptr’-;2jd—öÜ©ÖÃéÑ=ÂˇÙA','2026-10-31 14:33:58',0,'2026-10-31 14:03:38.558986','admin@socios.com'),
('í=úB°˘ßπI˘ÊØÇ»U¢}†Ê50\0 œµ-È}Â','2026-10-29 11:22:22',0,'2026-10-29 09:50:23.502650','admin@socios.com'),
('ílπPIx£;Ü”˘fáx—G∑ÀVàk\Z◊˘»<v\\;','2026-10-31 19:16:10',0,'2026-10-31 16:13:32.706272','admin@socios.com'),
('íÑ3Iø@ƒnöÂrª±]7õÍõÓÅ¶ö°¨K%f7!S','2026-10-07 15:45:49',0,'2026-10-07 15:39:33.768408','testadmin@cecit.com'),
('ïK”+⁄I˝q¨«–&¯∂3øß`ﬁÅSÀ“2H∑∫n','2026-10-31 19:25:00',0,'2026-10-31 16:21:29.458290','admin@socios.com'),
('ïVû[‹OÎ¨üI‰\r˘)B˙9œ}LcQ˛¥XBæ€Œ','2026-10-31 19:26:19',0,'2026-10-31 16:24:03.470479','admin@socios.com'),
('ïö\ZŸ≠I≠Œ—tÛWÅsnˇ=÷y\r$É±T\nO\"ËÃ<','2026-09-30 11:55:34',0,'2026-09-30 11:54:34.192209','tous@gmail.com'),
('ó\r◊ìFf%Kë¡‡ôèT@N¢^±¶ı∫oç3˝|','2026-10-21 09:48:33',0,'2026-10-21 09:47:33.201049','carlos@partner.com'),
('ô¬Ò7:ÿ©»g¥n“GÀ9%@ãX˜?{Ô“ÌªcFY','2026-10-31 19:18:57',0,'2026-10-31 16:15:13.143990','admin@socios.com'),
('ú=VÁH°\"+Z®Tfq¶îáR◊±Fv§0Îñ°Ñ√d-','2026-10-29 11:33:37',0,'2026-10-29 11:21:23.124042','admin@socios.com'),
('ûµ_¬Îî‡yıé]x¥WÙU(mﬁS®ï©9îbõ\'','2026-09-30 11:48:30',0,'2026-09-30 11:47:30.111268','testadmin@cecit.com'),
('üÑ„à›≠ˇBE[Ôâ8À]=0¯)$˝R˛ûΩX¶\0','2026-11-09 11:14:16',0,'2026-11-02 08:14:16.718213','carlos@partner.com'),
('†!`¿§¢g∂ÊåπÍÄ7Á|ZŸ•ä~¨øV4IáÊ','2026-11-07 15:04:11',0,'2026-10-31 15:04:11.816892','admin@socios.com'),
('°·ÑÇP!±î·“%∏\\4Ôˆ¡éÒ‹s¢ãµ-ŒB','2026-09-28 08:03:08',0,'2026-09-28 08:01:23.117348','testadmin@cecit.com'),
('•«ﬂC‘ª#á;vÒ¡e^\"Um∞,≥ñZù˙4+1A','2026-10-07 15:16:50',0,'2026-10-07 15:07:28.155720','carlos@partner.com'),
('¶n[Éñ\0µ£ÇÆúDÛ◊™‹EcË«õJ˘	iNÇÕ’','2026-09-26 20:56:03',0,'2026-09-26 20:54:46.670579','testadmin@cecit.com'),
('¶·|@<ƒú}?Ñ?È˘Í~Â6Y\ZÃ≈cŒá›•∑+','2026-10-29 11:35:06',0,'2026-10-29 11:32:38.149072','admin@socios.com'),
('®iy4⁄v—E|˝Äª`ã \\Ÿ:»F ˙¨\0	—p◊)≈','2026-10-31 14:37:17',0,'2026-10-31 14:34:40.160040','admin@socios.com'),
('©^ÈÃ∑◊ßÙ@∫Ivt`9a@0\"f[%oﬂ-_g','2026-11-03 14:56:18',0,'2026-11-03 11:55:16.316009','carlos@partner.com'),
('™\0-iòÓb¥Gµg¸·…‡˙Ô”dˆ˛tph™è—®','2026-10-07 16:04:02',0,'2026-10-07 16:02:59.734788','testadmin@cecit.com'),
('™j5çã©Êb§)>@Xy\Z`Ù?˜9‘øêÊ\\È¨P<','2026-09-30 12:48:56',0,'2026-09-30 12:47:54.412771','carlos@partner.com'),
('™Åπ.z~ÁXÏ£ÓRXC+	öß†áåj»ÁP”eÒ√','2026-09-30 11:50:23',0,'2026-09-30 11:49:22.578458','testadmin@cecit.com'),
('™Ñˇq¶7Kg}%oßp*kÂÊâ∆±™∫zÜÿz-_[ÿ','2026-10-07 10:35:20',0,'2026-10-07 10:34:19.886056','carlos@partner.com'),
('´VÔéﬂÇ$Á¿»ØÑO!ÍkËó9°m˜√ÚıJ','2026-10-07 09:21:47',0,'2026-10-07 09:19:13.555602','carlos@partner.com'),
('´á=Ädõ—í‚/åöq‘À\\–—¬ÒKΩ%º»ŸóÏ[','2026-09-30 11:48:00',0,'2026-09-26 21:00:23.654447','testadmin@cecit.com'),
('≠Òß±◊N±!)NÈHPXÑWHW÷ä b◊úØõ/','2026-10-07 15:35:17',0,'2026-10-07 15:30:54.486115','testadmin@cecit.com'),
('Æ	§ñ•.}‹ıº;¶gÂ,º¥¥4Ù?·∏nˆkï”','2026-11-12 19:24:04',0,'2026-11-05 16:24:05.214131','carlos@partner.com'),
('≤&eF\"≥´R‚xS•ÆµÑúôÆ\\(HwÛCm$ÇËl','2026-10-07 11:32:02',0,'2026-10-07 11:31:02.502531','testadmin@cecit.com'),
('≥∫Æ#°ö…¨ﬂÊûÔª\0Ã\\^GËAR3Èî√$Oπ„','2026-10-07 10:11:59',0,'2026-10-07 10:10:58.754974','lupianezfedericoignacio@gmail.com'),
('¥‘π—Q∏ní⁄Æ<\\÷G£<<ËÒÎ˘SÆﬁíMU¨åPÃ}','2026-10-07 15:39:46',0,'2026-10-07 15:34:24.434721','testadmin@cecit.com'),
('∂év≠£ªJÎrÀùí°òß©+C—G\"˚Ä=lgu[›é∞','2026-11-09 12:25:22',0,'2026-11-02 09:25:22.990822','carlos@partner.com'),
('ªÀ| RïÓ.rAıWÍ;!⁄^0_ïAÄ.óΩ$NI','2026-10-31 15:25:35',0,'2026-10-31 15:12:04.498520','admin@socios.com'),
('æÄÏèÒ\'ªk~˝j„∂\"\røv≠„“„¬I—]ø ú','2026-10-28 09:47:33',0,'2026-10-21 09:47:33.572815','carlos@partner.com'),
('¿Èº‚ò*y›ö‡”(ÇÈL5˘T\r\Zßsæ/ ìöúsK’','2026-09-30 12:47:59',0,'2026-09-30 12:46:58.764961','tous@gmail.com'),
('√Í•≥£úópÍ√ü„>Emæ™_µˆf∏¨µ´◊óÌˆ','2026-11-05 15:31:01',0,'2026-10-29 12:31:01.573931','carlos@partner.com'),
('ƒç‡à≠∑Àä_w´º÷âíë‰K•Fû_Æ]','2026-11-04 13:22:55',0,'2026-10-28 10:22:55.756098','carlos@partner.com'),
('≈*úygy˛≠ib	:Ç1&·†®h4≈â[p\0Ã	â','2026-10-31 14:04:36',0,'2026-10-29 12:23:36.119771','admin@socios.com'),
('∆Ze/≠ÊøE0t ¯!	J.KÚ˝À=w+ªsÇ∆ı~','2026-11-12 13:22:15',0,'2026-11-05 10:22:15.473312','carlos@partner.com'),
('∆ÎñeX™DπˇL\Z2®?—?´˛pÂ&T˘i±;éŸÉ','2026-10-31 14:35:37',0,'2026-10-31 14:33:01.038286','admin@socios.com'),
('»1%⁄$Î8ã4Åo~ﬂ\ZnÖ-w(6]œnú˝°™µXM','2026-09-26 21:01:21',0,'2026-09-26 20:59:58.877364','testadmin@cecit.com'),
('À·ˇC´:˝r+á’hπ0‹ƒ ã˙_Ä-Äzò0˜#!','2026-11-07 19:30:55',0,'2026-10-31 16:30:56.291363','admin@socios.com'),
('Ã„8pæé∏ö4≤8^¨œZT\'‘•»!∑\0…<Ø∆›ˆ','2026-09-30 12:25:03',0,'2026-09-30 12:24:03.241169','testadmin@cecit.com'),
('ŒÍY∏¨<U^wR‹\0/I¬0@røÓ#¿Ì¢n»wÀkñ','2026-09-28 08:03:34',0,'2026-09-28 08:02:08.280291','testadmin@cecit.com'),
('œX»C\0l\'iI√Ÿ?çv‡YmÖ|`‚Aƒ!)‚√¿4','2026-10-07 15:52:34',0,'2026-10-07 15:48:34.355277','testadmin@cecit.com'),
('—`¥dﬂ≠\roS√Ù®Ÿ¬Ó∏í∫A°òµ:c£éZÛ','2026-10-21 09:45:30',0,'2026-10-21 09:44:30.554211','carlos@partner.com'),
('—≤xû£Ú?—@∞ó~˘¡£»\rﬁü¸SqÇ¥≈§fmã','2026-10-12 17:27:42',0,'2026-10-05 17:27:43.167970','testadmin@cecit.com'),
('”ˆÂ˘†ä8éåÂ©ÑLvËt4V£Il‹⁄','2026-10-07 15:19:55',0,'2026-10-07 15:15:53.453310','carlos@partner.com'),
('’ñ¬Ä5:/õ• ¢ï$…v=ü ˆL>Âá2’€çr','2026-10-07 16:01:45',0,'2026-10-07 15:51:58.934001','testadmin@cecit.com'),
('Ÿ§Uó5ìèí∏h>˙ˇu≠º\nF∏„≈◊ô?BwÆ','2026-10-05 09:05:37',0,'2026-09-28 09:05:37.857134','testadmin@cecit.com'),
('›E»,•ÔÃ‰E3Œ`êz¥•‡åE•)»dÊ','2026-10-07 15:52:56',0,'2026-10-07 15:51:36.810031','testadmin@cecit.com'),
('‡qbÓw?|©ˆ6IßYÈ\"èô§~´˚‹«/úÌì†ˆº≠','2026-10-31 15:02:29',0,'2026-10-31 14:51:34.140687','admin@socios.com'),
('‡€ÀÆmìL–u—œ\'$*⁄ß Œ£Nœk2ÒR/IRñy','2026-10-07 15:31:51',0,'2026-10-07 15:23:28.313805','testadmin@cecit.com'),
('‚∆äõ‰©’v£Æu\ZΩ∆ãnÛ•lçΩ7®ñ','2026-10-07 10:27:37',0,'2026-10-07 10:26:32.227112','carlos@partner.com'),
('„Ç%ó±ΩF@_q¨ÃûﬂÑ™∞Ø8ã’Ÿk∑ &Æm˙Ù','2026-10-20 09:41:22',0,'2026-10-13 09:41:22.205716','carlos@partner.com'),
('„°^GÉ¡˚â¶rpÄ{≤√Èàaga›gAM¯Ä˜','2026-10-21 09:57:28',0,'2026-10-21 09:56:28.457790','carlos@partner.com'),
('‰@â· DÃÎ∆∫¯π\"ÅæŒ©·üI«¸Jº¯f≈á','2026-10-31 14:48:39',0,'2026-10-31 14:42:25.818542','admin@socios.com'),
('Ê›©˝Â∏oÄ/˘yë &Üv?=¢QD>:∂ú@^d','2026-11-02 10:52:43',0,'2026-10-31 16:36:43.592612','admin@socios.com'),
('ÊÌEï&0¡Êá8{˝˜ì∞)qo\n˛‰¢Ëi-','2026-11-03 20:05:03',0,'2026-11-03 16:48:16.868642','admin@socios.com'),
('Î0ÍIx~ñΩãÔ¥i∂†\'›\Z\'i8Ò‚LÔy»¢—m','2026-10-07 09:04:47',0,'2026-10-07 09:03:46.697108','carlos@partner.com'),
('Ó:‚!Ö≤5Ø®é¸®—ÆmXLˆ6âRwèhèƒœd–','2026-10-31 19:14:30',0,'2026-10-31 16:05:08.586401','admin@socios.com'),
('Qø.éΩ⁄ˇ¸æy∏≥ \rJt»W0R<≠Òu,nó','2026-11-09 11:25:22',0,'2026-11-02 08:25:23.303815','carlos@partner.com'),
('Ò`ò\"∂A}Í≤FlxÀ¶ﬁªﬂ∫è¸´4ˇyΩ`ˇdY','2026-11-04 13:43:56',0,'2026-10-28 10:43:57.353185','carlos@partner.com'),
('ÒÑuÉÈôÙ¬ïW¬—ìpΩÈà⁄ì∏ÈÄ˙¿ÖC˝ú`Y','2026-11-04 13:22:17',0,'2026-10-28 10:22:17.736187','carlos@partner.com'),
('ÒEù¬É§MR‰∞€(°¶Qò(\r*\nÖÒF•%Ik˝¸r','2026-11-03 20:35:57',0,'2026-11-03 17:04:05.327084','admin@socios.com'),
('Ú¢Ú&X“˚ãÊ%ÄÌU®£≠2∞¥z¬}ú”\04å','2026-10-21 09:29:10',0,'2026-10-21 09:28:10.674358','carlos@partner.com'),
('ı0WÙV43î·]É√àQ]º›≥òøLL+«\0Îvÿ','2026-09-30 12:26:01',0,'2026-09-30 12:24:49.461214','testadmin@cecit.com'),
('˜&nuë +¨ñ<¿^^RåYÿ∆PÒ¡KLi®˘ó¯_','2026-10-31 19:37:41',0,'2026-10-31 16:31:00.745429','admin@socios.com'),
('˜¢≥El∏˛T°ﬁﬂÕ≈Œ`D\06¨TèúØ[Ï9¯Q’','2026-11-04 13:03:30',0,'2026-10-28 10:03:31.048002','carlos@partner.com'),
('¯Å%]¨e§)W:‡–¢∫	‹æ@H‘	jåå	2Ô˝Ÿú','2026-10-31 19:22:27',0,'2026-10-31 16:17:59.743660','admin@socios.com'),
('¯≤Ôhb8NZ∑J{· zc8‚|! ﬁNÊ÷,ıGM≤','2026-09-28 08:10:25',0,'2026-09-28 08:02:34.993283','testadmin@cecit.com'),
('¯Œ.Âa†ÉÕÛå¡⁄^«√ì®\"ú∞Œës @-','2026-10-28 09:44:30',0,'2026-10-21 09:44:31.016352','carlos@partner.com'),
('˙∫[TSπÉÌ\'‚UwÃ\0Ò¸\rYÀÆ\0Nøí¶=','2026-11-12 13:21:15',0,'2026-11-05 10:21:15.647350','carlos@partner.com'),
('˙õrÃË~≠{Ú†∞?#$z\n.≥ﬁMœ‘√ù','2026-11-04 13:19:26',0,'2026-10-28 10:19:26.874571','carlos@partner.com'),
('¸Û2‘3⁄dRl}¯kÍ~á∑âπ?}{BìÙwÃŒÁ>','2026-10-29 09:42:57',0,'2026-10-29 09:41:57.514030','carlos@partner.com'),
('˛ëg≠‰:]Ÿ£?}Œ≥ˆsﬂFw…É1øÕï5\no+∞ â','2026-10-07 10:33:31',0,'2026-10-07 10:26:37.766749','carlos@partner.com'),
('ˇÿD9èès*•¯CÆ®öŒpârèK9ms–R','2026-11-04 13:43:30',0,'2026-10-28 10:43:31.103071','carlos@partner.com');
/*!40000 ALTER TABLE `RefreshTokens` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id_user` varchar(4) NOT NULL,
  `name` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `dni` varchar(11) DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  KEY `IDX_d9de24daa15c9441939de28998` (`dni`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES
('0070','testUser2','tous','49568322'),
('0e38','Mar√≠a','G√≥mez','28444555'),
('0e87','Laura','Morcillo','48538437'),
('213C','Katerine','Oliva','12345678'),
('2B36','Agustin','Ceballos','56781234'),
('5a07','Juan','P√©rez','30111222'),
('a31b','test','cecit','48538476'),
('BE89','Federico','Lupia√±ez','48538430'),
('CCFC','Federico','Lupia√±ez','48538439'),
('ded4','Carlos','L√≥pez','32123456'),
('df0d','Luc√≠a','Mart√≠nez','35666777'),
('E4F9','Oliva','Katerine','14235679');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Vouchers`
--

DROP TABLE IF EXISTS `Vouchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Vouchers` (
  `token` varchar(6) NOT NULL,
  `id_account` varchar(4) NOT NULL,
  `id_benefit` varchar(4) NOT NULL,
  `application_date` date NOT NULL,
  `delivery_date` date DEFAULT NULL,
  `status` enum('PENDING','DELIVERED','REJECTED','EXPIRED') DEFAULT 'PENDING',
  `limit_date` date DEFAULT '2026-05-11',
  PRIMARY KEY (`token`),
  KEY `voucher_user_idx` (`id_account`),
  KEY `voucher_benefit_idx` (`id_benefit`),
  KEY `voucher_status_idx` (`status`),
  CONSTRAINT `FK_dd90256db2b710c434669594a31` FOREIGN KEY (`id_benefit`) REFERENCES `Benefits` (`id_benefit`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `voucher_account_fk` FOREIGN KEY (`id_account`) REFERENCES `Accounts` (`id_account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Vouchers`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Vouchers` WRITE;
/*!40000 ALTER TABLE `Vouchers` DISABLE KEYS */;
INSERT INTO `Vouchers` VALUES
('00EE1A','df0d','3ff0','2026-06-26','2026-08-25','REJECTED','2026-05-11'),
('037505','a31b','1e65','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('05F20E','5a07','3ff0','2026-06-26','2026-06-26','EXPIRED','2026-05-11'),
('06A4BA','a31b','3ff0','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('07E26F','a31b','1e65','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('0B515E','ded4','880A','2026-09-16',NULL,'REJECTED','2026-09-23'),
('0D130C','a31b','1e65','2026-08-19',NULL,'EXPIRED','2026-05-11'),
('19C612','a31b','5ec1','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('1F960B','0070','a191','2026-09-11',NULL,'PENDING','2026-09-18'),
('26E2BD','5a07','6614','2026-11-03',NULL,'PENDING','2026-11-10'),
('2DBE7D','0070','B13D','2026-09-30','2026-09-30','DELIVERED','2026-10-07'),
('2FF58F','a31b','a251','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('372C22','5a07','D9F6','2026-10-29',NULL,'PENDING','2026-11-05'),
('372E7F','a31b','c94c','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('38312E','a31b','a006','2026-08-31',NULL,'PENDING','2026-09-07'),
('3A544F','0070','A811','2026-09-30','2026-09-30','DELIVERED','2026-10-07'),
('3BE86F','a31b','a191','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('3C41ED','a31b','5ec1','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('3F146B','5a07','6614','2026-11-03',NULL,'PENDING','2026-11-10'),
('42704F','0070','AEE8','2026-09-22','2026-09-22','DELIVERED','2026-09-29'),
('4635A5','0070','5556','2026-09-09','2026-09-09','DELIVERED','2026-09-16'),
('467FA4','a31b','5556','2026-09-09','2026-09-09','DELIVERED','2026-09-16'),
('4983C2','5a07','64C0','2026-11-03',NULL,'PENDING','2026-11-10'),
('4ECE90','0070','8E79','2026-09-23','2026-09-23','DELIVERED','2026-09-30'),
('4EE9D4','0070','5556','2026-09-09','2026-09-10','DELIVERED','2026-09-16'),
('4EF755','0070','1e65','2026-08-31',NULL,'PENDING','2026-09-07'),
('50303E','a31b','a002','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('5059C3','a31b','a006','2026-08-31',NULL,'PENDING','2026-09-07'),
('50926A','5a07','64C0','2026-11-03',NULL,'PENDING','2026-11-10'),
('50F957','0e38','1e65','2026-06-26',NULL,'EXPIRED','2026-05-11'),
('53134A','a31b','1e65','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('57547A','a31b','1e65','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('57EDE6','a31b','a002','2026-09-09','2026-09-09','DELIVERED','2026-09-16'),
('5C54E5','a31b','c94c','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('5DD4AC','0e38','a001','2026-08-31',NULL,'PENDING','2026-09-07'),
('5F3EB3','0070','a191','2026-09-11',NULL,'PENDING','2026-09-18'),
('646046','5a07','D9F6','2026-10-29',NULL,'PENDING','2026-11-05'),
('6B9B22','a31b','1e65','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('739B37','5a07','64C0','2026-11-03',NULL,'PENDING','2026-11-10'),
('7CE826','a31b','1e65','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('80EED2','ded4','5ec1','2026-06-26',NULL,'EXPIRED','2026-05-11'),
('88DDAF','a31b','1e65','2026-08-19',NULL,'EXPIRED','2026-05-11'),
('8F67C7','a31b','1e65','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('931572','0070','a047','2026-09-11',NULL,'PENDING','2026-09-18'),
('9552BD','a31b','a006','2026-08-31',NULL,'PENDING','2026-09-07'),
('95A7FF','0070','a007','2026-09-11',NULL,'PENDING','2026-09-18'),
('961FEC','5a07','6614','2026-11-03',NULL,'PENDING','2026-11-10'),
('967826','a31b','a005','2026-08-31',NULL,'PENDING','2026-09-07'),
('9A6378','0070','880A','2026-09-16','2026-09-16','DELIVERED','2026-09-23'),
('9E9C26','5a07','D9F6','2026-10-29',NULL,'PENDING','2026-11-05'),
('9F00C6','a31b','a251','2026-08-19',NULL,'EXPIRED','2026-05-11'),
('A45438','5a07','6614','2026-11-03',NULL,'PENDING','2026-11-10'),
('A5630E','5a07','64C0','2026-11-03',NULL,'PENDING','2026-11-10'),
('AAC5EC','a31b','a011','2026-08-31','2026-09-17','DELIVERED','2026-09-07'),
('AAF973','a31b','a191','2026-09-01',NULL,'PENDING','2026-09-08'),
('AE55DF','a31b','a009','2026-08-31',NULL,'PENDING','2026-09-07'),
('AF01E4','a31b','1e65','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('B222BF','a31b','3ff0','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('B2DE00','a31b','a015','2026-08-31',NULL,'PENDING','2026-09-07'),
('B61858','a31b','c94c','2026-07-14',NULL,'EXPIRED','2026-05-11'),
('BA7B86','5a07','64C0','2026-11-03',NULL,'PENDING','2026-11-10'),
('C2BE76','0070','5556','2026-09-09',NULL,'REJECTED','2026-09-16'),
('D15EEB','0070','a006','2026-09-16',NULL,'PENDING','2026-09-23'),
('D2F8DA','a31b','a009','2026-08-31',NULL,'PENDING','2026-09-07'),
('D6F371','0070','a006','2026-09-16',NULL,'PENDING','2026-09-23'),
('D6FF3A','df0d','1e65','2026-06-26','2026-06-26','EXPIRED','2026-05-11'),
('DCDB23','ded4','880A','2026-09-16',NULL,'PENDING','2026-09-23'),
('DE6012','a31b','5ec1','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('E3637C','0070','a251','2026-09-11',NULL,'PENDING','2026-09-18'),
('E48386','a31b','a251','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('E94049','a31b','a016','2026-08-31',NULL,'PENDING','2026-09-07'),
('E9E115','5a07','64C0','2026-11-03',NULL,'PENDING','2026-11-10'),
('EAB517','a31b','3ff0','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('F416E6','a31b','1e65','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('F458A7','a31b','a001','2026-08-23',NULL,'EXPIRED','2026-05-11'),
('F79BF7','0070','1F73','2026-09-23','2026-09-23','DELIVERED','2026-09-30');
/*!40000 ALTER TABLE `Vouchers` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES
(1,1782477643088,'ChangeAccountsSystem1782477643088');
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Dumping routines for database 'cecit'
--
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `delete_refresh_tokens_pr` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`cecit_user`@`localhost` PROCEDURE `delete_refresh_tokens_pr`()
BEGIN
    DELETE FROM RefreshTokens
    WHERE expires_at < NOW();
END
;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-11-06  7:51:44
