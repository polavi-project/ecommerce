<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSubTotalBeforeDiscountToCartOrder extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cart', function (Blueprint $table) {
            $table->decimal('sub_total_before_discount', 12, 4)->after('shipping_fee_incl_tax');
        });
        Schema::table('order', function (Blueprint $table) {
            $table->decimal('sub_total_before_discount', 12, 4)->after('shipping_fee_incl_tax');
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
