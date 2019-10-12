<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateProductPriceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('product_price', function (Blueprint $table) {
            $table->dropColumn('active_from');
            $table->dropColumn('active_to');
        });
        Schema::table('product_price', function (Blueprint $table) {
            $table->dateTime('active_from')->after('qty')->nullable();
        });
        Schema::table('product_price', function (Blueprint $table) {
            $table->dateTime('active_to')->after('active_from')->nullable();
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
