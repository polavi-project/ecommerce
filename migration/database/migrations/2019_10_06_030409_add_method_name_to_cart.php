<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMethodNameToCart extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cart', function (Blueprint $table) {
            $table->char('shipping_method_name')->after('shipping_method')->nullable(true);
            $table->char('payment_method_name')->after('payment_method')->nullable(true);
        });

        Schema::table('order', function (Blueprint $table) {
            $table->char('shipping_method_name')->after('shipping_method')->nullable(true);
            $table->char('payment_method_name')->after('payment_method')->nullable(true);
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
