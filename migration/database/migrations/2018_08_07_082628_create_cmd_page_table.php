<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCmdPageTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::drop('cms_page');
        DB::unprepared('
            CREATE TABLE `cms_page` (
              `cms_page_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `status` SMALLINT (6) unsigned NOT NULL,
              `layout` varchar(255) NOT NULL,
              `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
              `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (`cms_page_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8
        ');
        DB::unprepared('
            CREATE TABLE `cms_page_description` (
              `cms_page_description_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `cms_page_description_cms_page_id` int(10) unsigned,
              `language_id` SMALLINT(6) NOT NULL,
              `url_key` varchar(255) NOT NULL,
              `name` text NOT NULL,
              `content` longtext,
              `meta_title` varchar(255) DEFAULT NULL,
              `meta_keywords` varchar(255) DEFAULT NULL,
              `meta_description` text,
              PRIMARY KEY (`cms_page_description_id`),
              UNIQUE KEY `UNQ_PAGE_URL_KEY` (`url_key`),
              UNIQUE KEY `UNQ_PAGE_LANGUAGE` (`cms_page_description_cms_page_id`,`language_id`),
              CONSTRAINT `FK_CMS_PAGE_DESCRIPTION` FOREIGN KEY (`cms_page_description_cms_page_id`) REFERENCES `cms_page` (`cms_page_id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8
        ');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
