-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 27, 2026 at 02:20 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `svk_business`
--

-- --------------------------------------------------------

--
-- Table structure for table `helpandsupport`
--

CREATE TABLE `helpandsupport` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(250) DEFAULT NULL,
  `phonenumber` int(20) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `otp_verifications`
--

CREATE TABLE `otp_verifications` (
  `id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `otp` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `otp_verifications`
--

INSERT INTO `otp_verifications` (`id`, `email`, `mobile`, `otp`, `expires_at`, `is_used`, `created_at`) VALUES
(7, 'pjshandreshsvk@gmail.com', NULL, '318981', '2026-05-26 21:26:39', 0, '2026-05-26 15:55:39');

-- --------------------------------------------------------

--
-- Table structure for table `products_table`
--

CREATE TABLE `products_table` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `price` int(11) NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products_table`
--

INSERT INTO `products_table` (`id`, `name`, `description`, `price`, `images`, `image`, `created_at`) VALUES
(1, 'iPhone 15', 'Apple Mobile', 85000, NULL, NULL, '2026-05-25 16:48:45'),
(2, 'Tab\'ss', 'Mac Inspiron', 65000, NULL, NULL, '2026-05-25 16:48:45'),
(3, 'Laptop', 'Dell Inspiron', 55000, NULL, NULL, '2026-05-25 16:48:45'),
(6, 'iPhone 15', 'Apple mobile phone', 85000, '[]', NULL, '2026-05-25 16:52:41');

-- --------------------------------------------------------

--
-- Table structure for table `registration`
--

CREATE TABLE `registration` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `image` varchar(500) DEFAULT NULL,
  `mobilenumber` varchar(15) DEFAULT NULL,
  `address` varchar(500) NOT NULL,
  `usertype` varchar(100) NOT NULL,
  `logintype` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registration`
--

INSERT INTO `registration` (`id`, `name`, `email`, `password`, `created_at`, `updated_at`, `image`, `mobilenumber`, `address`, `usertype`, `logintype`, `status`) VALUES
(1, 'Shandresh', 'Shandresh@gmail.com', '$2b$10$GxTSIZZixVtvFmnkWFxYfu1.MOg/nWB8Q949ng3Xq7vBpqnSQ90mm', '2026-05-19 03:53:41', '2026-05-22 02:40:42', '', '9876543210', 'Madurai', '', '', ''),
(3, 'B', 'B@g.com', '$2b$10$HJkto5.KNDnDm4FHpl0nA./QMgvq.nycFKVC/AsM.Y9wD6vULCX1i', '2026-05-19 15:49:51', '2026-05-19 15:49:51', '', NULL, '', '', '', ''),
(4, 'B1', 'B1@g.com', '$2b$10$cQLg0cnKXt3UceIrGEgpkeYXPljcNE7FoA.Qvjx.emdSnUIaSTrrW', '2026-05-19 15:50:22', '2026-05-19 15:50:22', '', NULL, '', '', '', ''),
(5, 'C', 'c@g.com', '$2b$10$ML3QpSwmxn6G.7U.79Js2.IwgEfPF.T00AZsSJc9SLlNRJlLrJici', '2026-05-19 15:51:21', '2026-05-19 15:51:21', '', NULL, '', '', '', ''),
(6, 'AA', 'aa@gmail.com', '$2b$10$9Ja.KJ3dtKV7oo7xaX88j..vSmurwcqB0K5lHuanY/9LeTnrpRZla', '2026-05-21 05:42:01', '2026-05-21 05:42:01', '1716459874561.png', NULL, '', '', '', ''),
(7, 'AAA', 'aaa@gmail.com', '$2b$10$qN9EGPnfyCdHvReEWTPgZ.rHmU1XT5uka.SrdlIJR9qhU25RZG.Vy', '2026-05-21 05:48:02', '2026-05-21 11:23:43', NULL, NULL, '', '', '', ''),
(8, 'PS', 'ps@g.com', '$2b$10$cP.rsGbbeXGDjgL3mr5Yuu7pg39oFrQwu4IFet9vcjN1wa/pkm/CK', '2026-05-21 17:19:43', '2026-05-21 17:19:43', NULL, NULL, '', '', '', 'Active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `helpandsupport`
--
ALTER TABLE `helpandsupport`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `otp_verifications`
--
ALTER TABLE `otp_verifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products_table`
--
ALTER TABLE `products_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `registration`
--
ALTER TABLE `registration`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `helpandsupport`
--
ALTER TABLE `helpandsupport`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `otp_verifications`
--
ALTER TABLE `otp_verifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `products_table`
--
ALTER TABLE `products_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `registration`
--
ALTER TABLE `registration`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
