-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 07, 2026 at 08:46 PM
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
-- Database: `coc-eff_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `contributions`
--

CREATE TABLE `contributions` (
  `id` int(11) NOT NULL,
  `member_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `date` date NOT NULL,
  `category` enum('Offering','Pledge','Welfare Dues') NOT NULL,
  `notes` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contributions`
--

INSERT INTO `contributions` (`id`, `member_id`, `amount`, `date`, `category`, `notes`) VALUES
(1, 1, 50.00, '2025-12-28', 'Welfare Dues', 'December Payment'),
(2, NULL, 250.00, '2025-12-28', 'Offering', 'Sunday Service Collection'),
(3, NULL, 750.00, '2025-12-28', 'Pledge', 'Sunday Service'),
(4, NULL, 230.00, '2026-01-03', 'Offering', 'Sunday Service'),
(5, NULL, 1500.00, '2026-01-04', 'Offering', 'Sunday Service Offering');

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `ministry` varchar(50) DEFAULT 'General',
  `other_names` varchar(100) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `role` enum('Admin','Member','Guest') DEFAULT 'Member',
  `status` enum('Active','Inactive') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`id`, `first_name`, `surname`, `gender`, `ministry`, `other_names`, `dob`, `address`, `mobile`, `email`, `photo_url`, `role`, `status`) VALUES
(1, 'Joseph', 'Abassah', 'Male', 'General', NULL, NULL, NULL, '0201234567', NULL, NULL, 'Admin', 'Active'),
(2, 'Sarah', 'Mensah', 'Male', 'General', NULL, NULL, NULL, '0249876543', NULL, NULL, 'Member', 'Active'),
(3, 'JOSHUA', 'KWAKYE', 'Male', 'General', '', '2000-06-06', 'Ohemaa Park\r\n16', '0556253297', 'kwakyejoshua14@gmail.com', 'http://localhost/church-system/api/uploads/member_1767271060_WhatsApp Image 2025-12-17 at 13.26.04_93e994d2.png', 'Member', 'Active'),
(4, 'Antony', 'Osei', 'Male', 'Children Ministry', '', '2019-06-09', 'ADA KOFORIDUA', '', '', 'http://localhost/church-system/api/uploads/member_1767389297_care job.jpg', 'Member', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `role`, `created_at`) VALUES
(1, 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Super Admin', '2025-12-31 12:18:14'),
(2, 'church admin', '$2a$12$64.E/ndQ5rf5CCHGxLFR0ORpp4DoLcOznEMMeUC9UFxGHR/1m2.ca', 'Admin', '0000-00-00 00:00:00'),
(3, 'youth_leader', '$2y$10$N0KoTNAROV6oeCp/TnZ/0u2PL1sN085uPQteyLxXZ8OFp5vrDQi8C', 'Youth Leader', '2026-01-01 15:19:02'),
(4, 'women_leader', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Women Leader', '2026-01-01 15:19:02'),
(5, 'finance_admin', '$2a$12$7.GrHq3Lu29gJCivbAfgF.lHTNQmN0c7ba2fNuwjmQcQvARmyolIu', 'Finance Officer', '0000-00-00 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contributions`
--
ALTER TABLE `contributions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_member` (`member_id`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contributions`
--
ALTER TABLE `contributions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `contributions`
--
ALTER TABLE `contributions`
  ADD CONSTRAINT `fk_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
