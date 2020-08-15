<?php

$version = "1.0.1";
$description = "This is CMS module. Polavi core";
$author = "Polavi team";

return [
    "1.0.0" => function(\Polavi\Services\Db\Processor $conn) {
        $pageTable = $conn->executeQuery("SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = :dbName AND TABLE_NAME = \"cms_page\" LIMIT 0,1", ['dbName'=> $conn->getConfiguration()->getDb()])->fetch(\PDO::FETCH_ASSOC);
        if ($pageTable !== false)
            return;
        $conn->executeQuery("CREATE TABLE `cms_page` (
              `cms_page_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `layout` varchar(255) NOT NULL,
              `status` smallint(6) DEFAULT NULL,
              `created_at` datetime DEFAULT NULL,
              `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (`cms_page_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Cms page'");

        //Create cms_page_description table
        $conn->executeQuery("CREATE TABLE `cms_page_description` (
              `cms_page_description_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `cms_page_description_cms_page_id` int(10) unsigned DEFAULT NULL,
              `language_id` smallint(6) NOT NULL,
              `url_key` varchar(255) NOT NULL,
              `name` text NOT NULL,
              `content` longtext,
              `meta_title` varchar(255) DEFAULT NULL,
              `meta_keywords` varchar(255) DEFAULT NULL,
              `meta_description` text,
              PRIMARY KEY (`cms_page_description_id`),
              UNIQUE KEY `UNQ_PAGE_LANGUAGE` (`cms_page_description_cms_page_id`,`language_id`),
              CONSTRAINT `FK_CMS_PAGE_DESCRIPTION` FOREIGN KEY (`cms_page_description_cms_page_id`) REFERENCES `cms_page` (`cms_page_id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'Cms page description'");

        //Create cms_widget table
        $conn->executeQuery("CREATE TABLE `cms_widget` (
              `cms_widget_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `type` char(255) NOT NULL,
              `name` varchar(255) DEFAULT NULL,
              `status` smallint(6) NOT NULL DEFAULT '1',
              `setting` text NOT NULL,
              `language_id` smallint(6) DEFAULT NULL,
              `display_setting` varchar(255) DEFAULT NULL,
              `sort_order` int(11) DEFAULT NULL,
              `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
              `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (`cms_widget_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'Cms widget'");
    },
    "1.0.1" => function(\Polavi\Services\Db\Processor $processor) {
        // Let's leave multi language later
        $processor->executeQuery("SET FOREIGN_KEY_CHECKS=0");

        $ps = $processor->getTable("cms_page_description")
            ->addFieldToSelect("cms_page_description_cms_page_id")
            ->addFieldToSelect("COUNT(`cms_page_description`.`cms_page_description_cms_page_id`)", "sm")
            ->groupBy("cms_page_description_cms_page_id")
            ->having("sm", ">", 1)
            ->fetchAllAssoc();
        foreach ($ps as $p) {
            $limit = $p['sm'] - 1;
            $processor->executeQuery("DELETE FROM `cms_page_description` where cms_page_description_cms_page_id = {$p['cms_page_description_cms_page_id']} LIMIT {$limit}");
        }
        $processor->executeQuery("ALTER TABLE cms_page_description DROP INDEX  UNQ_PAGE_LANGUAGE");
        $processor->executeQuery("ALTER TABLE cms_page_description ADD CONSTRAINT `PAGE_ID_UNIQUE` UNIQUE (`cms_page_description_cms_page_id`)");
        $processor->executeQuery("ALTER TABLE cms_page_description DROP COLUMN language_id");


        $processor->executeQuery("ALTER TABLE cms_widget DROP COLUMN language_id");
        $processor->executeQuery("SET FOREIGN_KEY_CHECKS=1");
    }
];
