<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveSomeColumnInCartOrder extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cart', function (Blueprint $table) {
            $table->dropColumn('sub_total_before_discount');
        });

        Schema::table('order', function (Blueprint $table) {
            $table->dropColumn('sub_total_before_discount');
        });

        Schema::table('cart_item', function (Blueprint $table) {
            $table->dropColumn('total_excl_tax');
        });

        Schema::table('order_item', function (Blueprint $table) {
            $table->dropColumn('total_excl_tax');
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
