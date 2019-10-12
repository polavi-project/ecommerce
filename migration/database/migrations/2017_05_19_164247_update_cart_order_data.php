<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCartOrderData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cart_item', function (Blueprint $table) {
            $table->dropColumn('tax_percent');
        });
        Schema::table('order_item', function (Blueprint $table) {
            $table->dropColumn('tax_percent');
        });

        Schema::table('cart_item', function (Blueprint $table) {
            $table->text('tax_rate')->after('tax_amount');
        });
        Schema::table('order_item', function (Blueprint $table) {
            $table->text('tax_rate')->after('tax_amount');
        });

        Schema::table('cart', function (Blueprint $table) {
            $table->renameColumn('sub_total_excl_tax', 'sub_total');
            $table->dropColumn('sub_total_incl_tax');
        });
        Schema::table('order', function (Blueprint $table) {
            $table->renameColumn('sub_total_excl_tax', 'sub_total');
            $table->dropColumn('sub_total_incl_tax');
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
