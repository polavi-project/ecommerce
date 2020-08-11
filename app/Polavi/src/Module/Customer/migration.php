<?php

$version = "1.0.0";
return [
    "1.0.0" => function(\Polavi\Services\Db\Processor $conn) {
        $customerTable = $conn->executeQuery("SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = :dbName AND TABLE_NAME = \"customer\" LIMIT 0,1", ['dbName'=> $conn->getConfiguration()->getDb()])->fetch(\PDO::FETCH_ASSOC);
        if($customerTable !== false)
            return;
        //Create customer_group table
        $conn->executeQuery("CREATE TABLE `customer_group` (
              `customer_group_id` int(10) unsigned NOT NULL,
              `group_name` char(255) NOT NULL,
              `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
              `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              `row_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              PRIMARY KEY (`customer_group_id`),
              KEY `row_id` (`row_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Customer group'");

        $conn->executeQuery("INSERT INTO `customer_group` (`customer_group_id`, `group_name`) VALUES (1, 'General'), (999, 'All'), (1000, 'BASEPRICE')");
        //Create customer table
        $conn->executeQuery("CREATE TABLE `customer` (
              `customer_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `status` smallint(6) NOT NULL DEFAULT '1',
              `group_id` int(10) unsigned DEFAULT NULL,
              `email` char(255) NOT NULL,
              `password` char(255) NOT NULL,
              `full_name` char(255) DEFAULT NULL,
              `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
              `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (`customer_id`),
              UNIQUE KEY `EMAIL_UNIQUE` (`email`),
              KEY `FK_CUSTOMER_GROUP` (`group_id`),
              CONSTRAINT `FK_CUSTOMER_GROUP` FOREIGN KEY (`group_id`) REFERENCES `customer_group` (`customer_group_id`) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Customer'");

        //Create customer_address table
        $conn->executeQuery("CREATE TABLE `customer_address` (
              `customer_address_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `customer_id` int(10) unsigned NOT NULL,
              `full_name` varchar(255) DEFAULT NULL,
              `telephone` varchar(255) DEFAULT NULL,
              `address_1` varchar(255) DEFAULT NULL,
              `address_2` varchar(255) DEFAULT NULL,
              `postcode` varchar(255) DEFAULT NULL,
              `city` varchar(255) DEFAULT NULL,
              `province` varchar(255) DEFAULT NULL,
              `country` varchar(255) NOT NULL,
              `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
              `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              `is_default` int(10) unsigned DEFAULT NULL,
              PRIMARY KEY (`customer_address_id`),
              KEY `FK_CUSTOMER_ADDRESS_LINK` (`customer_id`),
              CONSTRAINT `FK_CUSTOMER_ADDRESS_LINK` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Customer address'");
    }
];
