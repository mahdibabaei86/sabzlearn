-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 11, 2023 at 05:46 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 7.4.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mahdi`
--

-- --------------------------------------------------------

--
-- Table structure for table `alarm-clock`
--

CREATE TABLE `notes` (
  `id` text NOT NULL,
  `title` text NOT NULL,
  `clock` text NOT NULL,
  `note` text NOT NULL,
  `email` text NOT NULL,
  `username` text NOT NULL,
  `status` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `blog`
--

CREATE TABLE `blog` (
  `id` text CHARACTER SET utf8mb4 NOT NULL,
  `title` text CHARACTER SET utf8mb4 NOT NULL,
  `athor` text CHARACTER SET utf8mb4 NOT NULL,
  `clendare` text CHARACTER SET utf8mb4 NOT NULL,
  `category` text CHARACTER SET utf8mb4 NOT NULL,
  `cover` text CHARACTER SET utf8mb4 NOT NULL,
  `description` text CHARACTER SET utf8mb4 NOT NULL,
  `Comments` text CHARACTER SET utf8mb4 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` text CHARACTER SET utf8mb4 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`message`, `status`) VALUES
('3 دوره جدید سبزلرن رو دیدی؟ 🤑😍', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `symbol` text NOT NULL,
  `name` text NOT NULL,
  `cover` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `shortdes` text NOT NULL,
  `category` text NOT NULL,
  `shortVideo` text NOT NULL,
  `price` text NOT NULL,
  `percentComplete` text NOT NULL,
  `updated` text NOT NULL,
  `time` text NOT NULL,
  `status` text NOT NULL,
  `support` text NOT NULL,
  `prerequisite` text NOT NULL,
  `whatcher` text NOT NULL,
  `teacher` text NOT NULL,
  `description` text NOT NULL,
  `videos` text NOT NULL,
  `Comments` text NOT NULL,
  `student` text NOT NULL,
  `persentOff` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `own` text NOT NULL,
  `keyPass` text NOT NULL,
  `title` text NOT NULL,
  `departeman` text NOT NULL,
  `chats` text NOT NULL,
  `status` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `username` text NOT NULL,
  `password` text NOT NULL,
  `name` text NOT NULL,
  `family` text NOT NULL,
  `bio` text NOT NULL,
  `type` text NOT NULL,
  `courses` text NOT NULL,
  `wallet` text NOT NULL,
  `email` text NOT NULL,
  `status` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
