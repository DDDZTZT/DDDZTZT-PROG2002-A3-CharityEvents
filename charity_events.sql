-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: charityevents_db
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Current Database: `charityevents_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `charityevents_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `charityevents_db`;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Fun Run','Community running events for all fitness levels'),(2,'Gala Dinner','Formal fundraising dinners and banquets'),(3,'Silent Auction','Art and collectible auctions supporting charity'),(4,'Charity Concert','Live music performances raising funds for causes');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `event_name` varchar(150) NOT NULL,
  `description` text,
  `event_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `location_name` varchar(150) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `ticket_price` decimal(10,2) DEFAULT NULL,
  `is_free` tinyint DEFAULT NULL,
  `status` enum('active','suspended','past') NOT NULL DEFAULT 'active',
  `image_url` varchar(255) DEFAULT NULL,
  `goal_amount` decimal(10,2) DEFAULT NULL,
  `raised_amount` decimal(10,2) DEFAULT NULL,
  `organisations_org_id` int NOT NULL,
  `categories_category_id` int NOT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  KEY `fk_events_organisations_idx` (`organisations_org_id`),
  KEY `fk_events_categories1_idx` (`categories_category_id`),
  CONSTRAINT `fk_events_categories1` FOREIGN KEY (`categories_category_id`) REFERENCES `categories` (`category_id`),
  CONSTRAINT `fk_events_organisations` FOREIGN KEY (`organisations_org_id`) REFERENCES `organisations` (`org_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Harbour City Fun Run','Join us for a scenic 10km run along the harbour foreshore, raising funds for youth education programs.','2026-11-15','07:30:00','Mrs Macquaries Point','1 Macquarie Street	','Sydney',45.00,0,'active','images/fun-run.jpg',50000.00,32500.00,1,1,-33.8600000,151.2100000),(2,'Hope Gala Dinner','An elegant evening of fine dining, live entertainment and inspiring stories from the families we support.','2026-12-05','18:30:00','The Grand Ballroom','88 Pitt Street','Sydney',180.00,0,'active','images/gala-dinner.jpg',120000.00,96000.00,1,2,-33.8690000,151.2070000),(3,'Art for Good Auction','Bid on works donated by local artists. Every dollar raised helps children access safe housing and healthcare.','2026-10-24','17:00:00','Paddington Town Hall','249 Oxford Street','Sydney',0.00,1,'active','images/art-auction.jpg',30000.00,8500.00,2,3,-33.8845000,151.2267000),(4,'Sounds of Hope Concert','An evening of live music featuring local bands, with all proceeds supporting children in need across NSW.','2027-01-16','19:00:00','Enmore Theatre','118 Enmore Road','Sydney',75.00,0,'active','images/hope-concert.jpg',80000.00,12000.00,2,4,-33.8990000,151.1740000),(5,'Coastal Clean-Up Walk','A family-friendly 5km coastal walk to raise awareness and funds for marine conservation along our coastline.','2026-11-29','08:00:00','Nobbys Beach','Nobbys Road','Newcastle',25.00,0,'active','images/cleanup-walk.jpg',20000.00,21000.00,3,1,-32.9250000,151.7820000),(6,'Winter Warmth Gala','Our annual winter fundraising gala brought the community together to support wildlife rescue operations.','2026-06-13','18:00:00','Sydney Town Hall','483 George Street','Sydney',150.00,0,'past','images/winter-gala.jpg',90000.00,88500.00,3,2,-33.8730000,151.2065000),(7,'Wildlife Rescue Auction','A silent auction of wildlife photography and art to fund rescue and rehabilitation programs.','2026-12-19','16:00:00','Wollongong Art Gallery','46 Burelli Street','Wollongong',0.00,1,'active','images/wildlife-auction.jpg',40000.00,3000.00,3,3,-34.4240000,150.8930000),(8,'Midnight Serenade','A late-night charity concert featuring classical and contemporary performances.','2027-02-13','21:00:00','City Recital Hall','2 Angel Place','Sydney',95.00,0,'suspended','images/serenade.jpg',60000.00,0.00,1,4,-33.8670000,151.2070000);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organisations`
--

DROP TABLE IF EXISTS `organisations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organisations` (
  `org_id` int NOT NULL AUTO_INCREMENT,
  `org_name` varchar(100) DEFAULT NULL,
  `mission` text,
  `phone` varchar(20) DEFAULT NULL,
  `contact_email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`org_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organisations`
--

LOCK TABLES `organisations` WRITE;
/*!40000 ALTER TABLE `organisations` DISABLE KEYS */;
INSERT INTO `organisations` VALUES (1,'Harbour Hope Foundation','Building brighter futures for disadvantaged youth','02 9000 1234','info@harbourhope.org.au'),(2,'Sunrise Childrens Trust','Every child deserves a safe and healthy start','02 9000 5678','contact@sunrisetrust.org.au'),(3,'Coastal Wildlife Alliance','Protecting our coastlines and the life they support','02 9000 9012','hello@coastalwildlife.org.au');
/*!40000 ALTER TABLE `organisations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registrations`
--

DROP TABLE IF EXISTS `registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registrations` (
  `registration_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(120) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `tickets` int NOT NULL,
  `registration_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `event_id` int NOT NULL,
  PRIMARY KEY (`registration_id`),
  UNIQUE KEY `uq_reg_email_event` (`email`,`event_id`),
  KEY `fk_registrations_event` (`event_id`),
  CONSTRAINT `fk_registrations_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chk_tickets` CHECK ((`tickets` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registrations`
--

LOCK TABLES `registrations` WRITE;
/*!40000 ALTER TABLE `registrations` DISABLE KEYS */;
INSERT INTO `registrations` VALUES (1,'Alice Johnson','alice.johnson@example.com','0400 111 222',2,'2026-09-20 09:15:00',1),(2,'Bob Smith','bob.smith@example.com','0400 222 333',1,'2026-09-22 14:30:00',1),(3,'Carol Lee','carol.lee@example.com','0400 333 444',4,'2026-09-25 11:00:00',1),(4,'David Brown','david.brown@example.com','0400 444 555',2,'2026-09-28 16:45:00',2),(5,'Emma Wilson','emma.wilson@example.com','0400 555 666',1,'2026-09-30 10:20:00',2),(6,'Frank Miller','frank.miller@example.com','0400 666 777',3,'2026-10-01 13:10:00',3),(7,'Grace Davis','grace.davis@example.com','0400 777 888',2,'2026-10-02 09:05:00',3),(8,'Henry Taylor','henry.taylor@example.com','0400 888 999',5,'2026-10-03 15:40:00',4),(9,'Ivy Anderson','ivy.anderson@example.com','0400 999 000',1,'2026-10-04 12:25:00',5),(10,'Jack Thomas','jack.thomas@example.com','0400 000 111',2,'2026-10-05 08:50:00',5);
/*!40000 ALTER TABLE `registrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-17 10:17:02
