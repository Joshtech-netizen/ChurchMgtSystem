CREATE TABLE `members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` enum('active','inactive','visitor') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed some dummy data so we can test 'Read' immediately
INSERT INTO `members` (first_name, last_name, email, phone, status) VALUES
('Joshua', 'Kwakye', 'john@test.com', '123-456-7890', 'active'),
('Jane', 'Smith', 'jane@test.com', '098-765-4321', 'visitor');