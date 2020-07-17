<?php

$version = "1.0.0";
return [
    "1.0.0" => function(\Polavi\Services\Db\Processor $conn) {
        //Create tax_class table
        $conn->executeQuery("CREATE TABLE `tax_class` (
              `tax_class_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `name` char(255) NOT NULL,
              `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
              `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (`tax_class_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Tax class'");

        //Create tax_rate table
        $conn->executeQuery("CREATE TABLE `tax_rate` (
              `tax_rate_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `name` char(255) NOT NULL,
              `tax_class_id` int(10) unsigned NOT NULL,
              `country` char(5) NOT NULL DEFAULT '*',
              `province` char(5) NOT NULL DEFAULT '*',
              `postcode` char(255) NOT NULL DEFAULT '*',
              `rate` decimal(12,4) NOT NULL,
              `is_compound` smallint(5) unsigned NOT NULL DEFAULT '0',
              `priority` smallint(5) unsigned NOT NULL DEFAULT '0',
              `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
              `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (`tax_rate_id`),
              KEY `FK_TAX_CLASS` (`tax_class_id`),
              CONSTRAINT `FK_TAX_CLASS` FOREIGN KEY (`tax_class_id`) REFERENCES `tax_class` (`tax_class_id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Tax rate'");
    }
];
