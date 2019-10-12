<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCartItemOrderItem extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cart_item', function (Blueprint $table) {
            $table->renameColumn('sale_price', 'final_price');
            $table->renameColumn('sale_price_incl_tax', 'final_price_incl_tax');
        });

        Schema::table('order_item', function (Blueprint $table) {
            $table->renameColumn('sale_price', 'final_price');
            $table->renameColumn('sale_price_incl_tax', 'final_price_incl_tax');
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
