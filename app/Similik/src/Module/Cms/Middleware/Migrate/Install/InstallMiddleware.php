<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Middleware\Migrate\Install;


use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Db\Processor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class InstallMiddleware extends MiddlewareAbstract
{
    /**@var Processor $processor*/
    protected $processor;

    public function __invoke(Request $request, Response $response)
    {
        $this->processor = new Processor();
        $cmsPageTable = $this->processor->executeQuery("SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = :dbName AND TABLE_NAME = \"cms_page\" LIMIT 0,1", ['dbName'=> DB_DATABASE])->fetch(\PDO::FETCH_ASSOC);
        if($cmsPageTable !== false) {
            $response->addData('success', 0)->addData('message', 'Installed');
            return $response;
        }

        $this->processor->startTransaction();
        try {
            //Create cms_page table
            $this->processor->executeQuery("CREATE TABLE `cms_page` (
              `cms_page_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `layout` varchar(255) NOT NULL,
              `status` smallint(6) DEFAULT NULL,
              `created_at` datetime DEFAULT NULL,
              `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (`cms_page_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Cms page'");

            //Create cms_page_description table
            $this->processor->executeQuery("CREATE TABLE `cms_page_description` (
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
              CONSTRAINT `FK_CMS_PAGE_DESCRIPTION` FOREIGN KEY (`cms_page_description_cms_page_id`) REFERENCES `cms_page` (`cms_page_id`) ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'Cms page description'");

            //Create cms_widget table
            $this->processor->executeQuery("CREATE TABLE `cms_widget` (
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


            $this->processor->commit();
            $response->addData('success', 1)->addData('message', 'Done');
        } catch (\Exception $e) {
            $this->processor->rollback();
            $response->addData('success', 0)->addData('message', $e->getMessage());
        }

        return $response;
    }
}