<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddUniqueIndexToOrderAddressTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cart_address', function (Blueprint $table) {
            $table->unique(['cart_id', 'address_type'], 'CART_ADDRESS_UNIQUE');
        });

        Schema::table('order_address', function (Blueprint $table) {
            $table->unique(['order_id', 'address_type'], 'ORDER_ADDRESS_UNIQUE');
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
