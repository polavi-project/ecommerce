<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Migrate\Install;


use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Db\Processor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Routing\Router;
use Symfony\Component\HttpFoundation\RedirectResponse;

class InstallMiddleware extends MiddlewareAbstract
{
    /**@var Processor $processor*/
    protected $processor;

    public function __invoke(Request $request, Response $response)
    {
        if(!file_exists(CONFIG_PATH . DS . 'config.tmp.php')) {
            $redirect = new RedirectResponse($this->getContainer()->get(Router::class)->generateUrl('homepage'));
            return $redirect->send();
        }
        require_once CONFIG_PATH . DS . 'config.tmp.php';
        $this->processor = new Processor();
        $productTable = $this->processor->executeQuery("SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = :dbName AND TABLE_NAME = \"product\" LIMIT 0,1", ['dbName'=> DB_DATABASE])->fetch(\PDO::FETCH_ASSOC);
        if($productTable !== false) {
            $response->addData('success', 0)->addData('message', 'Installed');
            return $response;
        }

        $this->processor->startTransaction();
        try {
            // Create attribute table
            $this->processor->executeQuery("CREATE TABLE `attribute` (
              `attribute_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `attribute_code` varchar(255) NOT NULL,
              `attribute_name` varchar(255) NOT NULL,
              `type` varchar(11) NOT NULL,
              `is_required` smallint(5) unsigned NOT NULL DEFAULT '0',
              `display_on_frontend` smallint(5) unsigned NOT NULL DEFAULT '0',
              `is_filterable` smallint(2) unsigned NOT NULL DEFAULT '0',
              `sort_order` int(10) unsigned NOT NULL DEFAULT '0',
              PRIMARY KEY (`attribute_id`),
              UNIQUE KEY `UNIQUE_ATTRIBUTE_CODE` (`attribute_code`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Product attribute'");

            //Create attribute option table
            $this->processor->executeQuery("CREATE TABLE `attribute_option` (
              `attribute_option_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `attribute_id` int(10) unsigned NOT NULL,
              `attribute_code` varchar(255) NOT NULL,
              `option_text` varchar(255) NOT NULL,
              PRIMARY KEY (`attribute_option_id`),
              KEY `FK_ATTRIBUTE_OPTION` (`attribute_id`),
              CONSTRAINT `FK_ATTRIBUTE_OPTION` FOREIGN KEY (`attribute_id`) REFERENCES `attribute` (`attribute_id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Product attribute option'");

            //Create attribute group table
            $this->processor->executeQuery("CREATE TABLE `attribute_group` (
              `attribute_group_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `group_name` text NOT NULL,
              `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
              `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (`attribute_group_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Product attribute group'");

            $this->processor->getTable('attribute_group')->insert([
                'group_name'=> 'Default'
            ]);

            // Create table attribute_group_link
            $this->processor->executeQuery("CREATE TABLE `attribute_group_link` (
              `attribute_group_link_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `attribute_id` int(10) unsigned NOT NULL,
              `group_id` int(10) unsigned NOT NULL,
              PRIMARY KEY (`attribute_group_link_id`),
              UNIQUE KEY `UNIQUE_ATTRIBUE_GROUP` (`attribute_id`,`group_id`),
              KEY `FK_GROUP_LINK` (`group_id`),
              CONSTRAINT `FK_ATTRIBUTE_LINK` FOREIGN KEY (`attribute_id`) REFERENCES `attribute` (`attribute_id`) ON DELETE CASCADE ON UPDATE CASCADE,
              CONSTRAINT `FK_GROUP_LINK` FOREIGN KEY (`group_id`) REFERENCES `attribute_group` (`attribute_group_id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Attribute and group linking table'");

            //Create category table
            $this->processor->executeQuery("CREATE TABLE `category` (
              `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `status` smallint(6) NOT NULL,
              `parent_id` int(10) unsigned DEFAULT NULL,
              `include_in_nav` smallint(5) unsigned NOT NULL,
              `position` smallint(5) unsigned DEFAULT NULL,
              `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
              `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (`category_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Category'");

            //Create category description table
            $this->processor->executeQuery("CREATE TABLE `category_description` (
              `category_description_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `category_description_category_id` int(10) unsigned NOT NULL,
              `language_id` smallint(6) NOT NULL DEFAULT '0',
              `name` text NOT NULL,
              `short_description` text,
              `description` longtext,
              `meta_title` text,
              `meta_keywords` text,
              `meta_description` longtext,
              `seo_key` char(255) NOT NULL,
              PRIMARY KEY (`category_description_id`),
              UNIQUE KEY `CATEGORY_DESCRIPTION_LANGUAGE_UNIQUE` (`category_description_category_id`,`language_id`),
              CONSTRAINT `FK_CATEGORY_DESCRIPTION` FOREIGN KEY (`category_description_category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Category description'");

            // Create product table
            $this->processor->executeQuery("CREATE TABLE `product` (
              `product_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `group_id` int(10) unsigned DEFAULT NULL,
              `image` varchar(255) DEFAULT NULL,
              `sku` varchar(255) NOT NULL,
              `price` decimal(12,4) NOT NULL,
              `qty` int(10) unsigned NOT NULL,
              `weight` decimal(12,4) DEFAULT NULL,
              `manage_stock` tinyint(1) unsigned NOT NULL,
              `stock_availability` tinyint(1) unsigned NOT NULL,
              `tax_class` smallint(6) DEFAULT NULL,
              `status` tinyint(1) unsigned NOT NULL,
              `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
              `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (`product_id`),
              UNIQUE KEY `UNIQUE_SKU` (`sku`),
              KEY `FK_PRODUCT_ATTRIBUTE_GROUP` (`group_id`),
              CONSTRAINT `FK_PRODUCT_ATTRIBUTE_GROUP` FOREIGN KEY (`group_id`) REFERENCES `attribute_group` (`attribute_group_id`) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Product'");

            //Create product_description table
            $this->processor->executeQuery("CREATE TABLE `product_description` (
              `product_description_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `product_description_product_id` int(10) unsigned NOT NULL,
              `language_id` smallint(6) NOT NULL DEFAULT '0',
              `name` text NOT NULL,
              `description` longtext,
              `short_description` longtext,
              `seo_key` varchar(255) NOT NULL,
              `meta_title` text,
              `meta_description` longtext,
              `meta_keywords` text,
              PRIMARY KEY (`product_description_id`),
              UNIQUE KEY `UNIQUE_PRODUCT_LANGUAGE` (`product_description_product_id`,`language_id`),
              KEY `FK_PRODUCT_DESCRIPTION_LANGUAGE` (`language_id`),
              CONSTRAINT `FK_PRODUCT_DESCRIPTION` FOREIGN KEY (`product_description_product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Product description'");

            //Create product_category table
            $this->processor->executeQuery("CREATE TABLE `product_category` (
              `product_category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `category_id` int(10) unsigned NOT NULL,
              `product_id` int(10) unsigned NOT NULL,
              PRIMARY KEY (`product_category_id`),
              UNIQUE KEY `PRODUCT_CATEGORY_UNIQUE` (`category_id`,`product_id`),
              KEY `FK_PRODUCT_CATEGORY_LINK` (`product_id`),
              CONSTRAINT `FK_CATEGORY_PRODUCT_LINK` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE,
              CONSTRAINT `FK_PRODUCT_CATEGORY_LINK` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Product and category link'");

            //Create product_attribute_value_index table
            $this->processor->executeQuery("CREATE TABLE `product_attribute_value_index` (
              `product_attribute_value_index_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `product_id` int(10) unsigned NOT NULL,
              `attribute_id` int(10) unsigned NOT NULL,
              `option_id` int(10) unsigned DEFAULT NULL,
              `attribute_value_text` text,
              `language_id` int(10) unsigned DEFAULT NULL,
              PRIMARY KEY (`product_attribute_value_index_id`),
              UNIQUE KEY `UNIQUE_OPTION_VALUE` (`product_id`,`attribute_id`,`option_id`),
              UNIQUE KEY `UNIQUE_TEXT_VALUE` (`product_id`,`attribute_id`,`language_id`),
              KEY `FK_ATTRIBUTE_VALUE_LINK` (`attribute_id`),
              KEY `FK_ATTRIBUTE_OPTION_VALUE_LINK` (`option_id`),
              CONSTRAINT `FK_ATTRIBUTE_OPTION_VALUE_LINK` FOREIGN KEY (`option_id`) REFERENCES `attribute_option` (`attribute_option_id`) ON DELETE CASCADE,
              CONSTRAINT `FK_ATTRIBUTE_VALUE_LINK` FOREIGN KEY (`attribute_id`) REFERENCES `attribute` (`attribute_id`) ON DELETE CASCADE,
              CONSTRAINT `FK_PRODUCT_ATTRIBUTE_LINK` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE
            ) ENGINE=InnoDB AUTO_INCREMENT=152 DEFAULT CHARSET=utf8 COMMENT='Product attribute value index'");

            //Create product_custom_option table
            $this->processor->executeQuery("CREATE TABLE `product_custom_option` (
              `product_custom_option_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `product_custom_option_product_id` int(10) unsigned NOT NULL,
              `option_name` varchar(255) NOT NULL,
              `option_type` varchar(255) NOT NULL,
              `is_required` int(5) NOT NULL DEFAULT '0',
              `sort_order` int(10) unsigned DEFAULT NULL,
              PRIMARY KEY (`product_custom_option_id`),
              KEY `FK_PRODUCT_CUSTOM_OPTION` (`product_custom_option_product_id`),
              CONSTRAINT `FK_PRODUCT_CUSTOM_OPTION` FOREIGN KEY (`product_custom_option_product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Product custom option'");

            //Create product_custom_option_value table
            $this->processor->executeQuery("CREATE TABLE `product_custom_option_value` (
              `product_custom_option_value_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `option_id` int(10) unsigned NOT NULL,
              `extra_price` decimal(12,4) DEFAULT NULL,
              `sort_order` int(10) unsigned DEFAULT NULL,
              `value` varchar(225) NOT NULL,
              PRIMARY KEY (`product_custom_option_value_id`),
              KEY `FK_CUSTOM_OPTION_VALUE` (`option_id`),
              CONSTRAINT `FK_CUSTOM_OPTION_VALUE` FOREIGN KEY (`option_id`) REFERENCES `product_custom_option` (`product_custom_option_id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Product option value'");

            //Create product_image table
            $this->processor->executeQuery("CREATE TABLE `product_image` (
              `product_image_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `product_image_product_id` int(10) unsigned NOT NULL,
              `image` varchar(225) NOT NULL,
              PRIMARY KEY (`product_image_id`),
              KEY `FK_PRODUCT_IMAGE_LINK` (`product_image_product_id`),
              CONSTRAINT `FK_PRODUCT_IMAGE_LINK` FOREIGN KEY (`product_image_product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Product image'");

            //Create product_price table
            $this->processor->executeQuery("CREATE TABLE `product_price` (
              `product_price_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `product_price_product_id` int(10) unsigned NOT NULL,
              `tier_price` decimal(12,4) NOT NULL,
              `customer_group_id` int(10) unsigned NOT NULL DEFAULT '0',
              `qty` int(10) unsigned NOT NULL DEFAULT '0',
              `active_from` datetime DEFAULT NULL,
              `active_to` datetime DEFAULT NULL,
              `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
              `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (`product_price_id`),
              UNIQUE KEY `UNIQUE_CUSTOMER_PRODUCT_PRICE_QTY` (`product_price_product_id`,`customer_group_id`,`qty`),
              KEY `FK_PRICE_PRODUCT` (`product_price_product_id`),
              KEY `FK_PRICE_CUSTOMER_GROUP` (`customer_group_id`),
              CONSTRAINT `FK_PRICE_CUSTOMER_GROUP` FOREIGN KEY (`customer_group_id`) REFERENCES `customer_group` (`customer_group_id`) ON DELETE CASCADE,
              CONSTRAINT `FK_PRICE_PRODUCT` FOREIGN KEY (`product_price_product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Product advanced price'");

            ////////////////// CREATE SOME TRIGGERS /////////////////////
            // Create TRIGGER_AFTER_INSERT_PRODUCT trigger
            $this->processor->executeQuery(
                "CREATE TRIGGER `TRIGGER_AFTER_INSERT_PRODUCT` AFTER INSERT ON `product` 
                    FOR EACH ROW BEGIN
                         INSERT INTO `product_price`(product_price_product_id, tier_price, customer_group_id, qty) VALUES(NEW.product_id, NEW.price, 1000, 1);
                    END;"
            );

            // Create TRIGGER_AFTER_DELETE_ATTRIBUTE_OPTION trigger
            $this->processor->executeQuery(
                "CREATE TRIGGER `TRIGGER_AFTER_DELETE_ATTRIBUTE_OPTION` AFTER DELETE ON `attribute_option` 
                    FOR EACH ROW BEGIN
                         DELETE FROM `product_attribute_value_index` WHERE `product_attribute_value_index`.option_id = OLD.attribute_option_id AND `product_attribute_value_index`.`attribute_id` = OLD.attribute_id;
                    END;"
            );

            //Create TRIGGER_AFTER_DELETE_TAX_CLASS trigger
            $this->processor->executeQuery(
                "CREATE TRIGGER `TRIGGER_AFTER_DELETE_TAX_CLASS` AFTER DELETE ON `tax_class` 
                    FOR EACH ROW BEGIN
                         UPDATE `product` SET `product`.tax_class = 0 WHERE `product`.tax_class = OLD.tax_class_id;
                    END;"
            );

            //Create TRIGGER_ATTRIBUTE_OPTION_UPDATE trigger
            $this->processor->executeQuery(
                "CREATE TRIGGER `TRIGGER_ATTRIBUTE_OPTION_UPDATE` AFTER UPDATE ON `attribute_option` 
                    FOR EACH ROW UPDATE `product_attribute_value_index` SET `product_attribute_value_index`.`attribute_value_text` = NEW.option_text
                        WHERE `product_attribute_value_index`.option_id = NEW.attribute_option_id AND `product_attribute_value_index`.attribute_id = NEW.attribute_id;
                "
            );

            //Create TRIGGER_PRODUCT_AFTER_UPDATE trigger
            $this->processor->executeQuery(
                "CREATE TRIGGER `TRIGGER_PRODUCT_AFTER_UPDATE` AFTER UPDATE ON `product` 
                    FOR EACH ROW BEGIN
                        INSERT INTO `product_price`(`product_price_product_id`,`customer_group_id`, `qty`, `tier_price`) VALUES (NEW.product_id, 1000, 1, NEW.price) ON DUPLICATE KEY UPDATE tier_price = NEW.price;
                        DELETE FROM `product_attribute_value_index`
                        WHERE `product_attribute_value_index`.`product_id` = New.product_id 
                        AND `product_attribute_value_index`.`attribute_id` NOT IN (SELECT `attribute_group_link`.`attribute_id` FROM `attribute_group_link` WHERE `attribute_group_link`.`group_id` = NEW.group_id);
                    END;"
            );

            //Create TRIGGER_REMOVE_ATTRIBUTE_FROM_GROUP from group
            $this->processor->executeQuery(
                "CREATE TRIGGER `TRIGGER_REMOVE_ATTRIBUTE_FROM_GROUP` AFTER DELETE ON `attribute_group_link` 
                    FOR EACH ROW BEGIN
                        DELETE FROM `product_attribute_value_index` WHERE product_attribute_value_index.attribute_id = OLD.attribute_id AND product_attribute_value_index.product_id IN (SELECT product.product_id FROM product WHERE product.group_id = OLD.group_id);
                    END;"
            );
            $this->processor->commit();
            $response->addData('success', 1)->addData('message', 'Done');
        } catch (\Exception $e) {
            $this->processor->rollback();
            $response->addData('success', 0)->addData('message', $e->getMessage());
        }

        return $response;
    }
}