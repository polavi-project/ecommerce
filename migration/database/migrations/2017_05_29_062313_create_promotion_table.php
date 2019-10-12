<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePromotionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('promotion');
        Schema::create('promotion', function (Blueprint $table) {
            $table->increments('promotion_id');
            $table->char('description');
            $table->unsignedSmallInteger('status')->default(1);
            $table->decimal('discount_amount', 12, 4);
            $table->unsignedSmallInteger('free_shipping')->default(0);//0: No, 1: Yes
            $table->unsignedSmallInteger('discount_type')->default(1);//0: Fixed amount, 1: Percentage
            $table->char('coupon')->unique();
            $table->unsignedInteger('used_time')->default(0);
            $table->unsignedSmallInteger('apply_to')->default(0);// 0: Entire order, 1: Specific products
            $table->char('specific_product')->nullable();
            $table->decimal('cart_total', 12, 4)->nullable();
            $table->char('condition');
            $table->unsignedInteger('max_uses_time_per_coupon')->nullable();
            $table->unsignedInteger('max_uses_time_per_customer')->nullable();
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->default(\Illuminate\Support\Facades\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
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
