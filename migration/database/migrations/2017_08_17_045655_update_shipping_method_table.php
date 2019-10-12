<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateShippingMethodTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('shipping_method');
        Schema::create('shipping_method', function (Blueprint $table) {
            $table->increments('shipping_method_id');
            $table->char('code');
            $table->char('class');
        });

        Schema::table('shipping_method', function (Blueprint $table) {
            $table->unique('code', 'SHIPPING_METHOD_CODE_UNIQUE');
        });

        Schema::table('shipping_location', function (Blueprint $table) {
            $table->char('shipping_methods')->after('region');
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
