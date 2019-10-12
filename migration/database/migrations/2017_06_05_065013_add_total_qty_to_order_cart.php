<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTotalQtyToOrderCart extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cart', function (Blueprint $table) {
            //$table->unsignedInteger('total_qty')->after('sub_total');
        });
        Schema::table('order', function (Blueprint $table) {
            //$table->unsignedInteger('total_qty')->after('sub_total');
        });

        Schema::table('cart_item', function (Blueprint $table) {
            //$table->renameColumn('row_total', 'total');
            //$table->decimal('total_excl_tax', 12, 4)->after('discount_amount');
//            $table->renameColumn('ordered_price', 'sale_price');
//            $table->renameColumn('ordered_price_incl_tax', 'sale_price_incl_tax');
//            $table->renameColumn('ordered_qty', 'qty');
        });
        Schema::table('order_item', function (Blueprint $table) {
            //$table->decimal('total_excl_tax', 12, 4)->after('discount_amount');
            $table->decimal('total', 12, 4)->after('total_excl_tax');
            $table->renameColumn('ordered_price', 'sale_price');
            $table->renameColumn('ordered_price_incl_tax', 'sale_price_incl_tax');
            $table->renameColumn('ordered_qty', 'qty');
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
