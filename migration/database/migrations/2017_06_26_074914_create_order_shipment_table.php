<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrderShipmentTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('shipment');
        Schema::create('shipment', function (Blueprint $table) {
            $table->increments('shipment_id');
            $table->unsignedInteger('order_id');
            $table->unsignedSmallInteger('status')->default(1);
            $table->char('carrier_name');
            $table->char('tracking_url');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->default(\Illuminate\Support\Facades\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
        Schema::table('shipment', function (Blueprint $table) {
            $table->foreign('order_id', 'FK_ORDER_SHIPMENT')
                ->references('order_id')->on('order')
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
