<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SimplifyTaxAndDiscount extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('order_item', function (Blueprint $table) {
            $table->dropColumn('tax_before_discount');
            $table->dropColumn('tax_after_discount');
            $table->decimal('tax_amount', 12, 4)->after('tax_percent');
        });
        Schema::table('order_item', function (Blueprint $table) {
            $table->dropColumn('discount_before_tax');
            $table->dropColumn('discount_after_tax');
            $table->decimal('discount_amount', 12, 4)->after('tax_amount');
        });

        Schema::table('cart_item', function (Blueprint $table) {
            $table->dropColumn('tax_before_discount');
            $table->dropColumn('tax_after_discount');
            $table->decimal('tax_amount', 12, 4)->after('tax_percent');
        });
        Schema::table('cart_item', function (Blueprint $table) {
            $table->dropColumn('discount_before_tax');
            $table->dropColumn('discount_after_tax');
            $table->decimal('discount_amount', 12, 4)->after('tax_amount');
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
