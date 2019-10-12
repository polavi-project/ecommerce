<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MoveAddressIdToOrder extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Create tax before discount column
        Schema::table('cart_item', function (Blueprint $table) {
            $table->unsignedInteger('referer')->after('product_id')->nullable(true);
        });
        Schema::table('order_item', function (Blueprint $table) {
            $table->unsignedInteger('referer')->after('product_id')->nullable(true);
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
