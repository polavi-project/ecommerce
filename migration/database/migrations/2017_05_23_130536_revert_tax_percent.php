<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RevertTaxPercent extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('order_item', function (Blueprint $table) {
            $table->decimal('tax_percent', 12, 4)->after('tax_rate');
            $table->dropColumn('tax_rate');
        });
        Schema::table('cart_item', function (Blueprint $table) {
            $table->decimal('tax_percent', 12, 4)->after('tax_rate');
            $table->dropColumn('tax_rate');
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
