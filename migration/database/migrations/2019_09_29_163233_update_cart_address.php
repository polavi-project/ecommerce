<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCartAddress extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cart_address', function (Blueprint $table) {
//            $table->dropForeign('FK_CART_ADDRESS');
//            $table->dropUnique('CART_ADDRESS_UNIQUE');
        });
        Schema::table('order_address', function (Blueprint $table) {
            //$table->dropIndex('FK_ORDER_ADDRESS');

            //$table->dropUnique('ORDER_ADDRESS_UNIQUE');
        });
        Schema::table('cart_address', function (Blueprint $table) {
            //$table->dropColumn('cart_address_cart_id');
            //$table->dropColumn('address_type');
        });

        Schema::table('cart', function (Blueprint $table) {
//            $table->unsignedInteger('shipping_address_id')->after('shipping_method')->nullable(true);
//            $table->unsignedInteger('billing_address_id')->after('payment_method')->nullable(true);
        });


        Schema::table('order_address', function (Blueprint $table) {
            $table->dropColumn('order_address_order_id');
            $table->dropColumn('address_type');
        });

        Schema::table('order', function (Blueprint $table) {
            $table->unsignedInteger('shipping_address_id')->after('shipping_method')->nullable(true);
            $table->unsignedInteger('billing_address_id')->after('payment_method')->nullable(true);
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
