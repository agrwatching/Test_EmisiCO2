-- Adminer 5.3.0 MySQL 8.4.3 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `fuel_types`;
CREATE TABLE `fuel_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fuel_name` varchar(50) NOT NULL,
  `co2_per_liter` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fuel_name` (`fuel_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `fuel_types` (`id`, `fuel_name`, `co2_per_liter`) VALUES
(1,	'Solar',	2.68),
(2,	'Pertalite',	2.30),
(3,	'Pertamax',	2.25),
(4,	'Premium',	2.50),
(5,	'Elektrik',	0.00);

DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `action` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `predictions`;
CREATE TABLE `predictions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `vehicle_id` int NOT NULL,
  `rpm` int NOT NULL,
  `distance_km` decimal(10,2) NOT NULL,
  `co2_emission` decimal(10,2) NOT NULL,
  `category` enum('Aman','Sedang','Tidak Aman') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `vehicle_id` (`vehicle_id`),
  CONSTRAINT `predictions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `predictions_ibfk_2` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `predictions` (`id`, `user_id`, `vehicle_id`, `rpm`, `distance_km`, `co2_emission`, `category`, `created_at`) VALUES
(29,	9,	15,	1200,	20000.00,	24.33,	'Aman',	'2025-07-11 08:10:03'),
(30,	8,	16,	2700,	20000.00,	54.18,	'Aman',	'2025-07-11 09:38:48'),
(31,	9,	15,	7500,	20000.00,	149.57,	'Tidak Aman',	'2025-07-11 11:50:23');

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `profile_picture`, `role`, `created_at`) VALUES
(7,	'rizal (ketua)',	'admin@gmail.com',	'$2b$10$53oPdYnxlKqv8RaTAtKzs.RcCFcrjdXW3LKu6vjvN60safGqZRVqK',	'1752160977689.jpg',	'admin',	'2025-07-06 14:03:41'),
(8,	'adit',	'adit@gmail.com',	'$2b$10$KaUqMtusAYxjFOgN8Gf3H.I0mBqJLPIiw4zeRdhLgGSg84Nj8nF/O',	NULL,	'user',	'2025-07-07 03:36:51'),
(9,	'kuy',	'rizal@gmail.com',	'$2b$10$HsgOWVEzKVRsJlrPamceCu6.aGV8M2EsGAyA0.sNhcBH6OXk7NLsS',	'1752154022730.jpg',	'user',	'2025-07-09 21:13:59'),
(10,	'agra maesa kusumah',	'agragemers77@gmail.com',	'$2b$10$fHqwKUR4Ju5e34iJaZwiauk29mM4uFQssVlfaqygp1o44vRbFcBDq',	NULL,	'user',	'2025-07-10 07:46:21');

DROP TABLE IF EXISTS `vehicles`;
CREATE TABLE `vehicles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `brand` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `year` int NOT NULL,
  `engine_cc` int NOT NULL,
  `fuel_type_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `type` enum('motor','mobil') NOT NULL DEFAULT 'motor',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `fuel_type_id` (`fuel_type_id`),
  CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `vehicles_ibfk_2` FOREIGN KEY (`fuel_type_id`) REFERENCES `fuel_types` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `vehicles` (`id`, `user_id`, `brand`, `model`, `year`, `engine_cc`, `fuel_type_id`, `created_at`, `type`) VALUES
(15,	9,	'toyota',	'fortuner',	2020,	1700,	3,	'2025-07-11 08:09:46',	'mobil'),
(16,	8,	'toyota',	'kijang inova',	2017,	1900,	3,	'2025-07-11 09:38:26',	'mobil');

-- 2025-07-11 12:32:31 UTC
