<?php

$version = "1.0.0";

return [
    "1.0.0" => function (\Polavi\Services\Db\Processor $processor) {
        $processor->executeQuery("CREATE TABLE `newsletter_subscriber` (
              `newsletter_subscriber_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `customer_id` int(10) unsigned DEFAULT NULL,
              `email` varchar(255) NOT NULL,
              `status` varchar(255) DEFAULT NULL,
              `created_at` datetime DEFAULT NULL,
              `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (`newsletter_subscriber_id`),
              UNIQUE KEY `UNIQUE_NEWSLETTER_EMAIL` (`email`),
              UNIQUE KEY `UNIQUE_NEWSLETTER_CUSTOMER` (`customer_id`),
              CONSTRAINT `FK_NEWSLETTER_CUSTOMER` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Newsletter subscriber'");

        // Create TRIGGER_AFTER_DELETE_ATTRIBUTE_OPTION trigger
        $processor->executeQuery(
            "CREATE TRIGGER `TRIGGER_AFTER_DELETE_INSERT_CUSTOMER` AFTER INSERT ON `customer` 
                    FOR EACH ROW BEGIN
                         UPDATE `newsletter_subscriber` SET `newsletter_subscriber`.customer_id = NEW.customer_id WHERE `newsletter_subscriber`.email = NEW.email;
                    END;"
        );
    }
];