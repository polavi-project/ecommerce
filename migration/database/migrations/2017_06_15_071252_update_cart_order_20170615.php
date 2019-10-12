<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCartOrder20170615 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cart', function (Blueprint $table) {
            $table->dropColumn('shipping_address_id');
            $table->dropColumn('billing_address_id');
            $table->dropColumn('shipping_note');
        });

        Schema::table('cart_item', function (Blueprint $table) {
            $table->renameColumn('form_serialized', 'requested_data');
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
