-- MySQL dump 10.13  Distrib 5.1.61, for redhat-linux-gnu (x86_64)
--
-- Host: localhost    Database: gocab_app
-- ------------------------------------------------------
-- Server version	5.1.61

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `gc_service_request`
--

DROP TABLE IF EXISTS `gc_service_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gc_service_request` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pickup_address` varchar(255) DEFAULT NULL,
  `pickup_latitude` decimal(16,14) DEFAULT NULL,
  `pickup_longitude` decimal(17,14) DEFAULT NULL,
  `dest_address` varchar(255) DEFAULT NULL,
  `dest_latitude` decimal(16,14) DEFAULT NULL,
  `dest_longitude` decimal(17,14) DEFAULT NULL,
  `pickup_time` datetime DEFAULT NULL,
  `message_mode` enum('text','call') DEFAULT NULL,
  `callback_number` varchar(20) DEFAULT NULL,
  `message_text` text,
  `request_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gc_service_request`
--

LOCK TABLES `gc_service_request` WRITE;
/*!40000 ALTER TABLE `gc_service_request` DISABLE KEYS */;
INSERT INTO `gc_service_request` VALUES (1,'1 Grand Avenue, San Luis Obispo, CA','35.30282570000000','-120.65883510000003','1144 Montalban Street, San Luis Obispo, CA','35.28915200000001','-120.66392200000001','0000-00-00 00:00:00','text','0','','2012-05-22 05:25:36'),(2,'1050 Monterey Street, San Luis Obispo, CA','35.28226130000000','-120.66062770000002','1144 Montalban Street, San Luis Obispo, CA','35.28915200000001','-120.66392200000001','0000-00-00 00:00:00','','916','call me maybe','2012-05-22 05:33:32'),(3,'1050 Monterey Street, San Luis Obispo, CA','35.28238500000000','-120.66146000000003','1144 Montalban Street, San Luis Obispo, CA','35.28915200000001','-120.66392200000001','0000-00-00 00:00:00','text','916','sup','2012-05-22 05:34:38');
/*!40000 ALTER TABLE `gc_service_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gc_service_station`
--

DROP TABLE IF EXISTS `gc_service_station`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gc_service_station` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` char(2) DEFAULT NULL,
  `latitude` decimal(16,14) DEFAULT NULL,
  `longitude` decimal(17,14) DEFAULT NULL,
  `range` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gc_service_station`
--

LOCK TABLES `gc_service_station` WRITE;
/*!40000 ALTER TABLE `gc_service_station` DISABLE KEYS */;
INSERT INTO `gc_service_station` VALUES (2,'234 Taxi','8054899985','234taxi.com','San Luis Obispo','CA','35.28269170000000','-120.66336869999998',50),(3,'Ali G\'s Limo Service','8054406013','aligslimoservice.com','San Luis Obispo','CA','35.28611080000000','-120.65465369999998',50),(4,'Surf Cab Company','8057482202','surfcabco.com','Los Osos','CA','35.31507430000000','-120.82595930000002',50),(5,'Santa Barbara Checker Cab Co','8059646666','www.santabarbaracheckercab.com','Santa Barbara','CA','34.43565100000000','-119.82980700000002',50),(6,'Organic Taxi','3102567099','organictaxi.com','Santa Monica','CA','34.00860460000000','-118.47835680000003',50);
/*!40000 ALTER TABLE `gc_service_station` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2012-05-22  5:54:16
