CREATE TABLE `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(254) NOT NULL,
  `pw_hash` char(60) NOT NULL,
  `verified` tinyint(1) NOT NULL,
  `security_code` char(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `login_token` (
  `acc_id` int(11) NOT NULL,
  `login_token` char(32) NOT NULL,
  `valid_until` datetime NOT NULL,
  PRIMARY KEY (`login_token`),
  KEY `login_acc` (`acc_id`),
  CONSTRAINT `login_acc` FOREIGN KEY (`acc_id`) REFERENCES `account` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `verify_token` (
  `acc_id` int(11) NOT NULL,
  `verify_token` char(32) NOT NULL,
  `valid_until` datetime NOT NULL,
  PRIMARY KEY (`verify_token`),
  UNIQUE KEY `acc_id` (`acc_id`),
  CONSTRAINT `verify_acc` FOREIGN KEY (`acc_id`) REFERENCES `account` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
