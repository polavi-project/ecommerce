<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCartAddressTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::unprepared('
        CREATE TABLE `cart_address` (
          `cart_address_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
          `cart_id` int(10) unsigned DEFAULT NULL,
          `firstname` varchar(255) DEFAULT NULL,
          `lastname` varchar(255) DEFAULT NULL,
          `gender` varchar(255) DEFAULT NULL,
          `email` varchar(255) DEFAULT NULL,
          `postcode` varchar(255) DEFAULT NULL,
          `telephone` varchar(255) DEFAULT NULL,
          `country` varchar(255) DEFAULT NULL,
          `region` int(10) unsigned DEFAULT NULL,
          `city` varchar(255) DEFAULT NULL,
          `address` varchar(255) DEFAULT NULL,
          `address_type` varchar(255) DEFAULT NULL,
          PRIMARY KEY (`cart_address_id`),
          CONSTRAINT `FK_CART_ADDRESS` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE CASCADE
        ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8
        ');

        Schema::table('order_address', function (Blueprint $table) {
            $table->renameColumn('state_province', 'region');
        });

        Schema::table('cart', function (Blueprint $table) {
            $table->char('shipping_method')->nullable(true)->after('grand_total');
        });
        Schema::table('cart', function (Blueprint $table) {
            $table->char('payment_method')->nullable(true)->after('shipping_method');
        });

//        Schema::table('order', function (Blueprint $table) {
//            $table->char('shipping_method')->nullable(true)->change();
//            $table->char('payment_method')->nullable(true)->change();
//        });
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
