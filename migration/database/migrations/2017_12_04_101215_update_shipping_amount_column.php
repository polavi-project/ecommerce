<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateShippingAmountColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cart', function (Blueprint $table) {
            $table->decimal('shipping_fee_excl_tax', 12, 4)->nullable(true)->change();
            $table->decimal('shipping_fee_incl_tax', 12, 4)->nullable(true)->change();
        });

        Schema::table('order', function (Blueprint $table) {
            $table->decimal('shipping_fee_excl_tax', 12, 4)->nullable(true)->change();
            $table->decimal('shipping_fee_incl_tax', 12, 4)->nullable(true)->change();
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
