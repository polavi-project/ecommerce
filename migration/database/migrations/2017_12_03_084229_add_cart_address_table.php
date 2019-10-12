<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCartAddressTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('order_address', function (Blueprint $table) {
            $table->dropColumn('region');
        });

        Schema::table('order_address', function (Blueprint $table) {
            $table->string('region')->after('country');
        });

        DB::unprepared('
          CREATE TABLE `cart_address` (
          `cart_address_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
          `cart_address_cart_id` int(10) unsigned NOT NULL,
          `firstname` varchar(255) DEFAULT NULL,
          `lastname` varchar(255) DEFAULT NULL,
          `gender` varchar(255) DEFAULT NULL,
          `email` varchar(255) DEFAULT NULL,
          `postcode` varchar(255) DEFAULT NULL,
          `telephone` varchar(255) DEFAULT NULL,
          `country` varchar(255) DEFAULT NULL,
          `region` varchar(255) DEFAULT NULL,
          `city` varchar(255) DEFAULT NULL,
          `address_1` varchar(255) DEFAULT NULL,
          `address_2` char(255) DEFAULT NULL,
          `address_type` varchar(255) NOT NULL,
          PRIMARY KEY (`cart_address_id`),
          UNIQUE KEY `CART_ADDRESS_UNIQUE` (`cart_address_cart_id`,`address_type`),
          CONSTRAINT `FK_CART_ADDRESS` FOREIGN KEY (`cart_address_cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8
        ');

        Schema::table('cart', function (Blueprint $table) {
            $table->string('shipping_method')->after('grand_total');
        });
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
