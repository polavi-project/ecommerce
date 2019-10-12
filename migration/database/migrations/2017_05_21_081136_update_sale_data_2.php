<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateSaleData2 extends Migration
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
            $table->decimal('tax_after_discount', 12, 4)->after('tax_amount');
        });
        Schema::table('order_item', function (Blueprint $table) {
            $table->decimal('tax_after_discount', 12, 4)->after('tax_amount');
        });

        // Change tax_amount column
        Schema::table('cart_item', function (Blueprint $table) {
            $table->renameColumn('tax_amount', 'tax_before_discount');
        });
        Schema::table('order_item', function (Blueprint $table) {
            $table->renameColumn('tax_amount', 'tax_before_discount');
        });

        // Create discount before tax. This value will be calculated base on "tax_before_discount"
        Schema::table('cart_item', function (Blueprint $table) {
            $table->decimal('discount_after_tax', 12, 4)->after('discount_amount');
        });
        Schema::table('order_item', function (Blueprint $table) {
            $table->decimal('discount_after_tax', 12, 4)->after('discount_amount');
        });

        // Change discount_amount column
        Schema::table('cart_item', function (Blueprint $table) {
            $table->renameColumn('discount_amount', 'discount_before_tax');
        });
        Schema::table('order_item', function (Blueprint $table) {
            $table->renameColumn('discount_amount', 'discount_before_tax');
        });

        // Update total column
        Schema::table('cart_item', function (Blueprint $table) {
            $table->renameColumn('total_excl_tax', 'row_total');
            $table->dropColumn('total_incl_tax');
        });
        Schema::table('order_item', function (Blueprint $table) {
            $table->renameColumn('total_excl_tax', 'total_excl_tax');
            $table->dropColumn('total_incl_tax');
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
