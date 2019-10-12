<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateShippingLocationMethodTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shipping_method', function (Blueprint $table) {
            $table->increments('shipping_method_id');
            $table->unsignedInteger('shipping_location_id');
            $table->char('id');
            $table->char('name');
            $table->unsignedSmallInteger('status');
            $table->text('setting');
        });
        Schema::table('shipping_method', function (Blueprint $table) {
            $table->foreign('shipping_location_id', 'FK_SHIPPING_METHOD_LOCATION')
                ->references('shipping_location_id')->on('shipping_location')
                ->onDelete('cascade');
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
