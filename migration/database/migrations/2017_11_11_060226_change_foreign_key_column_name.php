<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeForeignKeyColumnName extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
//        Schema::table('product_discount', function (Blueprint $table) {
//            $table->dropColumn('from');
//            $table->dropColumn('to');
//        });
//        Schema::table('product_discount', function (Blueprint $table) {
//            $table->dateTime('from')->after('amount')->nullable(true);
//        });
//        Schema::table('product_discount', function (Blueprint $table) {
//            $table->dateTime('to')->after('from')->nullable(true);
//        });
        Schema::table('product_attribute_value_text', function (Blueprint $table) {
            $table->renameColumn('product_id', 'product_attribute_value_text_product_id');
        });
        Schema::table('product_category', function (Blueprint $table) {
            $table->renameColumn('product_id', 'product_category_product_id');
        });


        Schema::table('product_custom_option', function (Blueprint $table) {
            $table->renameColumn('product_id', 'product_custom_option_product_id');
        });
        Schema::table('product_description', function (Blueprint $table) {
            $table->renameColumn('product_id', 'product_description_product_id');
        });
        Schema::table('product_discount', function (Blueprint $table) {
            $table->renameColumn('product_id', 'product_discount_product_id');
        });
        Schema::table('product_image', function (Blueprint $table) {
            $table->renameColumn('product_id', 'product_image_product_id');
        });
        Schema::table('product_price', function (Blueprint $table) {
            $table->renameColumn('product_id', 'product_price_product_id');
        });

        Schema::table('order_item', function (Blueprint $table) {
            $table->renameColumn('order_id', 'order_item_order_id');
        });
        Schema::table('order_address', function (Blueprint $table) {
            $table->renameColumn('order_id', 'order_address_order_id');
        });
        Schema::table('order_activity', function (Blueprint $table) {
            $table->renameColumn('order_id', 'order_activity_order_id');
        });
        Schema::table('shipment', function (Blueprint $table) {
            $table->renameColumn('order_id', 'shipment_order_id');
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
