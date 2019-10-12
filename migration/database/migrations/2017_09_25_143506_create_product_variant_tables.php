<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductVariantTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();
        Schema::table('product', function (Blueprint $table) {
            $table->dropForeign('FK_PRODUCT_VARIANT_GROUP');
        });
        Schema::table('product', function (Blueprint $table) {
            $table->dropColumn('variant_group_id');
        });
        Schema::dropIfExists('variant_group');
        Schema::dropIfExists('variant_item');
        DB::unprepared('
        CREATE TABLE `variant_group` (
          `variant_group_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
          `variant_group_name` varchar(255) NOT NULL,
          `attribute_group_id` int(10) unsigned NOT NULL,
          `attr_one` int(10) unsigned NOT NULL DEFAULT \'0\',
          `attr_two` int(10) unsigned NOT NULL DEFAULT \'0\',
          `attr_three` int(10) unsigned NOT NULL DEFAULT \'0\',
          PRIMARY KEY (`variant_group_id`),
          KEY `FK_VARIANT_GROUP_ATTRIBUTE_GROUP` (`attribute_group_id`),
          CONSTRAINT `FK_VARIANT_GROUP_ATTRIBUTE_GROUP` FOREIGN KEY (`attribute_group_id`) REFERENCES `attribute_group` (`attribute_group_id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8
        ');

        DB::unprepared('
        CREATE TABLE `variant_item` (
          `variant_item_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
          `variant_group_id` int(10) unsigned NOT NULL,
          `product_id` int(10) unsigned NOT NULL,
          `attr_one` int(10) unsigned NOT NULL DEFAULT \'0\',
          `attr_two` int(10) unsigned NOT NULL DEFAULT \'0\',
          `attr_three` int(10) unsigned NOT NULL DEFAULT \'0\',
          PRIMARY KEY (`variant_item_id`),
          UNIQUE KEY `VARIANT_ATTR_UNIQUE` (`attr_one`,`attr_two`,`attr_three`,`product_id`),
          KEY `FK_VARIANT_ITEM_GROUP` (`variant_group_id`),
          KEY `FK_PRODUCT_VARIANT_ITEM` (`product_id`),
          CONSTRAINT `FK_PRODUCT_VARIANT_ITEM` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE,
          CONSTRAINT `FK_VARIANT_ITEM_GROUP` FOREIGN KEY (`variant_group_id`) REFERENCES `variant_group` (`variant_group_id`) ON DELETE CASCADE
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
