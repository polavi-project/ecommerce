<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddRequestedDataToOrderItem extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('order_item', function (Blueprint $table) {
            $table->text('requested_data')->after('product_custom_options')->nullable();
        });

        Schema::table('order_item', function (Blueprint $table) {
            $table->dropColumn('product_custom_options');
        });
        Schema::table('order', function (Blueprint $table) {
            $table->dropColumn('status');
        });
        Schema::table('order', function (Blueprint $table) {
            $table->unsignedSmallInteger('status')->after('user_agent');
        });
        Schema::table('order', function (Blueprint $table) {
            $table->unsignedSmallInteger('payment_status')->after('status');
        });
        Schema::table('order', function (Blueprint $table) {
            $table->unsignedSmallInteger('shipping_status')->after('payment_status');
        });

        Schema::table('order', function (Blueprint $table) {
            $table->string('order_number')->nullable(false)->change();
            $table->string('shipping_method')->nullable(false)->change();
            $table->string('payment_method')->nullable(false)->change();
            $table->string('customer_email')->nullable()->change();
            $table->string('customer_firstname')->nullable()->change();
            $table->string('customer_lastname')->nullable()->change();
            $table->string('customer_dob')->nullable()->change();
            $table->string('customer_gender')->nullable()->change();
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
