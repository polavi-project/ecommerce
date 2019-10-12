<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class FirstnameLastnameToFullnameCartOrder extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('order', function (Blueprint $table) {
            $table->renameColumn('customer_firstname', 'customer_full_name');
            $table->dropColumn('customer_lastname');
        });

        Schema::table('cart_address', function (Blueprint $table) {
            $table->renameColumn('firstname', 'full_name');
            $table->dropColumn('lastname');
        });

        Schema::table('order_address', function (Blueprint $table) {
            $table->renameColumn('firstname', 'full_name');
            $table->dropColumn('lastname');
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
