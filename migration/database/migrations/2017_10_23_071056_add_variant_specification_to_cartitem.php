<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddVariantSpecificationToCartitem extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cart_item', function (Blueprint $table) {
            $table->text('variant_specification')->after('total')->nullable(true);
        });
        Schema::table('order_item', function (Blueprint $table) {
            $table->text('product_custom_options')->after('total')->nullable(true);
        });
        Schema::table('order_item', function (Blueprint $table) {
            $table->text('variant_specification')->after('total')->nullable(true);
        });
        Schema::dropIfExists('order_item_option');
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
