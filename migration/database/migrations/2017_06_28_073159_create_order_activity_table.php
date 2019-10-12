<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrderActivityTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('order_activity');
        Schema::create('order_activity', function (Blueprint $table) {
            $table->increments('order_activity_id');
            $table->unsignedInteger('order_id');
            $table->unsignedSmallInteger('status');
            $table->text('comment');
            $table->unsignedSmallInteger('customer_notified');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->default(\Illuminate\Support\Facades\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
        Schema::table('order_activity', function (Blueprint $table) {
            $table->foreign('order_id', 'FK_ORDER_ACTIVITY')
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
